const db = require("../../../app/models/index");
const { Op, Sequelize  } = require("sequelize");

exports.getAllReportingManager = async (req, res) => {
  try {
    const { entity_id } = req.query;

    if (!entity_id) {
      return res.status(400).send({
        code: 400,
        message: "entity_id is required"
      });
    }

    // 🔹 Base query
    let query = `
      SELECT DISTINCT RM.employee_id, CONCAT(RM.title, ' ', RM.first_name, ' ', RM.last_name, ' [' ,RM.employee_code, ']') AS employee_name
        FROM HRMS_REGISTERED_USER AS U
        LEFT JOIN HRMS_REGISTERED_USER AS RM ON U.reporting_manager_id = RM.employee_id
        WHERE U.role_master_id = 2 AND U.primary_entity_id = :entity_id;
     `;

    const [response] = await db.sequelize.query(query, {
      replacements: {entity_id}
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched successfully",
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

exports.getAllSalesEmployee = async (req, res) => {
  try {
    const { reporting_manager_id } = req.query;

    if (!reporting_manager_id) {
      return res.status(400).send({
        code: 400,
        message: "reporting_manager_id is required"
      });
    }

    // 🔹 Base query
    let query = `
      SELECT U.employee_id, CONCAT(U.title, ' ', U.first_name, ' ', U.last_name, ' [' ,U.employee_code, ']') AS employee_name 
      FROM HRMS_REGISTERED_USER AS U WHERE U.role_master_id=2 AND U.reporting_manager_id = :reporting_manager_id;
     `;

    const [response] = await db.sequelize.query(query, {
      replacements: {reporting_manager_id}
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched successfully",
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

exports.createUpdateTarget = async(req,res)=>{
try {

  const {
    id,
    employee_targets = [],
    ...restData
  } = req.body;

  // ================= OVERLAP CHECK =================

  const existingRecord = await db.salesTarget.findOne({
    where: {
      entity_id: restData.entity_id,
      reporting_manager_id: restData.reporting_manager_id,

      // edit me current id ignore
      ...(id && {
        id: {
          [Op.ne]: id
        }
      }),

      [Op.or]: [

        // existing valid_from between selected dates
        {
          valid_from: {
            [Op.between]: [
              restData.valid_from,
              restData.valid_to
            ]
          }
        },

        // existing valid_to between selected dates
        {
          valid_to: {
            [Op.between]: [
              restData.valid_from,
              restData.valid_to
            ]
          }
        },

        // existing record fully covers selected range
        {
          [Op.and]: [
            {
              valid_from: {
                [Op.lte]: restData.valid_from
              }
            },
            {
              valid_to: {
                [Op.gte]: restData.valid_to
              }
            }
          ]
        }

      ]
    }
  });

  if (existingRecord) {
    return res.status(400).send({
      code: 400,
      message: "Target already exists between selected dates"
    });
  }

  // =========================================================
  // ======================= UPDATE ==========================
  // =========================================================

  if (id) {

    const updatePayload = { ...restData };

    delete updatePayload.entity_id;
    delete updatePayload.financial_year_id;

    // updatePayload.updatedBy = req.user?.employee_id;

    await db.salesTarget.update(updatePayload, {
      where: { id }
    });

    // remove old mapping
    await db.salesTargetMapping.destroy({
      where: {
        sales_target_id: id
      }
    });

    // recreate mapping
    if (employee_targets.length) {

      const mappingData = employee_targets.map((item) => ({
        sales_target_id: id,
        sales_employee_id: item.employee_id,
        target_amount: Number(item.target_amount || 0)
      }));

      await db.salesTargetMapping.bulkCreate(mappingData);
    }

    return res.status(200).send({
      code: 200,
      message: "Record updated successfully",
      id
    });
  }

  // =========================================================
  // ======================= CREATE ==========================
  // =========================================================

  const createPayload = {
    ...restData,
    createdBy: req.user?.employee_id
  };

  const createdRecord = await db.salesTarget.create(createPayload);

  // employee mapping create
  if (employee_targets.length) {

    const mappingData = employee_targets.map((item) => ({
      sales_target_id: createdRecord.id,
      sales_employee_id: item.employee_id,
      target_amount: Number(item.target_amount || 0)
    }));

    await db.salesTargetMapping.bulkCreate(mappingData);
  }

  return res.status(201).send({
    code: 201,
    message: "Record created successfully",
    id: createdRecord.id
  });

} catch (error) {

  console.log(error);

  return res.status(500).send({
    code: 500,
    message: "Something went wrong",
    error: error.message
  });
}
}

exports.getTargetDetails = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "target_id is required"
      });
    }

    const record = await db.salesTarget.findOne({
        where: { id },

        include: [
        {
            model: db.salesTargetMapping,
            as: "SALES_TARGET_MAPPINGs",
            attributes: [
            "id",
            "sales_employee_id",
            "target_amount"
            ],
            include: [
            {
                model: db.user,
                as: "salesUser",

                attributes: [
                    "employee_id",

                    [
                    Sequelize.fn(
                        "CONCAT",
                        Sequelize.col("SALES_TARGET_MAPPINGs.salesUser.title"),
                        " ",
                        Sequelize.col("SALES_TARGET_MAPPINGs.salesUser.first_name"),
                        " ",
                        Sequelize.col("SALES_TARGET_MAPPINGs.salesUser.last_name"),
                        " [",
                        Sequelize.col("SALES_TARGET_MAPPINGs.salesUser.employee_code"),
                        "]"
                    ),
                    "employee_name"
                    ]
                ]
            }
            ]
        }
        ]
    });

    if (!record) {
        return res.status(404).send({
        code: 404,
        message: "Record not found"
        });
    }

    return res.status(200).send({
        code: 200,
        message: "Record fetched successfully",
        data: record
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}

exports.getTargetList = async (req, res) => {
  try {

    const { entity_id, status } = req.query;

    const login_employee_id = req.user.employee_id;
    const role_code = req.user.role_code;

    let records = [];

    const countResult = await db.sequelize.query(`
      SELECT COUNT(*) AS total
      FROM HRMS_REGISTERED_USER AS U
      WHERE U.role_master_id = 2
        AND U.reporting_manager_id = ${login_employee_id}
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    const count = countResult[0].total;

    // REPORTING MANAGER / SUPER ADMIN
    if (count > 0 || role_code === 'Super Admin') {

      let extraCondition = '';

      if (role_code !== 'Super Admin') {
        extraCondition = ` AND st.reporting_manager_id = ${login_employee_id}`;
      }

      records = await db.sequelize.query(`
        SELECT 
            st.*,

            (
              SELECT COUNT(*)
              FROM SALES_TARGET_MAPPING stm
              WHERE stm.sales_target_id = st.id
            ) AS employee_count,

            (
              SELECT CONCAT(
                  u.title,' ',
                  u.first_name,' ',
                  u.last_name,' [',u.employee_code,']'
              )
              FROM HRMS_REGISTERED_USER u
              WHERE u.employee_id = st.reporting_manager_id
              LIMIT 1
            ) AS reporting_manager_name,

            CONCAT(
              DATE_FORMAT(st.valid_from, '%d-%m-%Y'),
              ' To ',
              DATE_FORMAT(st.valid_to, '%d-%m-%Y')
            ) AS period

        FROM SALES_TARGET st

        WHERE st.entity_id = ${entity_id}
          AND st.status = '${status}'
          ${extraCondition}

        ORDER BY st.id DESC
      `, {
        type: db.sequelize.QueryTypes.SELECT
      });

    } else {

      // SALES EMPLOYEE
      records = await db.sequelize.query(`
        SELECT 
          ST.id,
          ST.target_name,
          ST.createdAt,
          ST.reporting_manager_id,
          STM.target_amount,

          CONCAT(
            DATE_FORMAT(ST.valid_from, '%d-%m-%Y'),
            ' To ',
            DATE_FORMAT(ST.valid_to, '%d-%m-%Y')
          ) AS period,

          'Self' AS employee_count,

          (
            SELECT CONCAT(
                u.title,' ',
                u.first_name,' ',
                u.last_name,' [',u.employee_code,']'
            )
            FROM HRMS_REGISTERED_USER u
            WHERE u.employee_id = ST.reporting_manager_id
            LIMIT 1
          ) AS reporting_manager_name

        FROM SALES_TARGET_MAPPING AS STM

        INNER JOIN SALES_TARGET AS ST
          ON ST.id = STM.sales_target_id AND ST.status='APPROVED'

        WHERE STM.sales_employee_id = ${login_employee_id}

        ORDER BY ST.id DESC
      `, {
        type: db.sequelize.QueryTypes.SELECT
      });

    }

    return res.status(200).send({
      code: 200,
      message: "List fetched successfully",
      data: records,
      is_reporting_manager: count > 0
    });

  } catch (error) {

    return res.status(500).send({
      code: 500,
      message: error.message
    });

  }
};

exports.targetStatusChange = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({message: "target_id, status are required"});
    }

    const updatePayload = {
      status: status,
      approvedRejectedBy: req.user.employee_id,
      updatedAt: new Date()
    };

    await db.salesTarget.update(updatePayload, { where: { id: id } });

    return res.status(200).json({message: "Record updated successfully" });

  } catch (error) {
    return res.status(500).json({message: "Internal server error",error: error.message});
  }
}

const getAchievementBaseQuery = ({
  employeeCondition,
  fromField,
  toField
}) => {

  return `

    (

      -- APPROVED

      SELECT

        SIM.id AS invoice_id,

        SIM.sales_invoice_no AS invoice_no,

        SIM.sales_invoice_date AS invoice_date,

        SIM.invoice_status,

        SOM.id AS so_id,

        SOM.sales_order_no AS so_number,

        SIM.grand_total AS invoice_amount,

        SIM.grand_total AS achievement_value

      FROM CRM_SALES_INVOICE_MST SIM

      INNER JOIN SALES_ORDER_MST SOM
        ON SOM.id = SIM.so_id

      INNER JOIN CRM_CREATE_PROPOSAL_MST CPM
        ON CPM.id = SOM.proposal_id

      WHERE

        SIM.invoice_status = 'APPROVED'
        AND SIM.payment_status != 'UNPAID' -- 'UNPAID','PAID','PARTIALLY PAID'
        AND DATE(SIM.sales_invoice_date)
            BETWEEN ${fromField} AND ${toField}

       AND ${employeeCondition}

        AND
        (
          SIM.cancelled_invoice_date IS NULL

          OR DATE(SIM.cancelled_invoice_date)
              NOT BETWEEN ${fromField} AND ${toField}
        )



      UNION ALL



      -- CANCELLED

      SELECT

        SIM.id AS invoice_id,

        SIM.sales_invoice_no AS invoice_no,

        SIM.cancelled_invoice_date AS invoice_date,

        SIM.invoice_status,

        SOM.id AS so_id,

        SOM.sales_order_no AS so_number,

        SIM.grand_total AS invoice_amount,

        -SIM.grand_total AS achievement_value

      FROM CRM_SALES_INVOICE_MST SIM

      INNER JOIN SALES_ORDER_MST SOM
        ON SOM.id = SIM.so_id

      INNER JOIN CRM_CREATE_PROPOSAL_MST CPM
        ON CPM.id = SOM.proposal_id

      WHERE

        SIM.invoice_status = 'CANCELLED'
        AND SIM.payment_status != 'UNPAID' -- 'UNPAID','PAID','PARTIALLY PAID'
        AND DATE(SIM.cancelled_invoice_date)
            BETWEEN ${fromField} AND ${toField}

        AND ${employeeCondition}

    )

  `;

};

const getAchievementQuery = ({
  employeeCondition,
  fromField,
  toField
}) => {

  return `

    (

      SELECT IFNULL(
        SUM(T.achievement_value),
      0)

      FROM

      ${getAchievementBaseQuery({
        employeeCondition,
        fromField,
        toField
      })} T

    )

  `;

};

const getAchievementInvoiceListQuery = ({
  employeeCondition,
  fromField,
  toField
}) => {

  return `

    (

      SELECT JSON_ARRAYAGG(

        JSON_OBJECT(

          'invoice_id',
          T.invoice_id,

          'invoice_no',
          T.invoice_no,

          'invoice_date',
          T.invoice_date,

          'invoice_status',
          T.invoice_status,

          'so_id',
          T.so_id,

          'so_number',
          T.so_number,

          'invoice_amount',
          T.invoice_amount,

          'achievement_value',
          T.achievement_value

        )

      )

      FROM

      ${getAchievementBaseQuery({
        employeeCondition,
        fromField,
        toField
      })} T

    )

  `;

};

exports.getAchievementList = async (req, res) => {
  try {

    const { entity_id } = req.query;

    const login_employee_id = req.user.employee_id;
    const role_code = req.user.role_code;

    let records = [];

    const countResult = await db.sequelize.query(`
      SELECT COUNT(*) AS total
      FROM HRMS_REGISTERED_USER AS U
      WHERE U.role_master_id = 2
        AND U.reporting_manager_id = ${login_employee_id}
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    const count = countResult[0].total;

    // REPORTING MANAGER / SUPER ADMIN
    if (count > 0 || role_code === 'Super Admin') {

      let extraCondition = '';

      if (role_code !== 'Super Admin') {
        extraCondition = ` AND st.reporting_manager_id = ${login_employee_id}`;
      }

      records = await db.sequelize.query(`
        SELECT 
            st.*,
            ${getAchievementQuery({
            employeeCondition: `
              (
                CASE
                  WHEN CPM.created_by_id IS NOT NULL
                    THEN CPM.created_by_id
                  ELSE CPM.employee_id
                END
              ) IN
              (
                SELECT STM.sales_employee_id
                FROM SALES_TARGET_MAPPING STM
                WHERE STM.sales_target_id = st.id
              )
            `,
            fromField: 'st.valid_from',
            toField: 'st.valid_to'
          })} AS achievement_amount,

          ROUND(
            (
              ${getAchievementQuery({
                employeeCondition: `
                  (
                    CASE
                      WHEN CPM.created_by_id IS NOT NULL
                        THEN CPM.created_by_id
                      ELSE CPM.employee_id
                    END
                  ) IN
                  (
                    SELECT STM.sales_employee_id
                    FROM SALES_TARGET_MAPPING STM
                    WHERE STM.sales_target_id = st.id
                  )
                `,
                fromField: 'st.valid_from',
                toField: 'st.valid_to'
              })}
              / NULLIF(st.target_amount,0)
            ) * 100,
          2
          ) AS achievement_per,
            (
              SELECT CONCAT(
                  u.title,' ',
                  u.first_name,' ',
                  u.last_name,' [',u.employee_code,']'
              )
              FROM HRMS_REGISTERED_USER u
              WHERE u.employee_id = st.reporting_manager_id
              LIMIT 1
            ) AS reporting_manager_name,

            CONCAT(
              DATE_FORMAT(st.valid_from, '%d-%m-%Y'),
              ' To ',
              DATE_FORMAT(st.valid_to, '%d-%m-%Y')
            ) AS period

        FROM SALES_TARGET st

        WHERE st.entity_id = ${entity_id}
          AND st.status = 'APPROVED'
          ${extraCondition}

        ORDER BY st.id DESC
      `, {
        type: db.sequelize.QueryTypes.SELECT
      });

    } else {

      // SALES EMPLOYEE
      records = await db.sequelize.query(`
        SELECT 
          ST.id,
          ST.target_name,
          ST.createdAt,
          ST.reporting_manager_id,
          STM.target_amount,
          ${getAchievementQuery({
          employeeCondition: `
            (
              CASE
                WHEN CPM.created_by_id IS NOT NULL
                  THEN CPM.created_by_id
                ELSE CPM.employee_id
              END
            ) = STM.sales_employee_id
          `,
          fromField: 'ST.valid_from',
          toField: 'ST.valid_to'
        })} AS achievement_amount,

        ROUND(
          (
            ${getAchievementQuery({
              employeeCondition: `
                (
                  CASE
                    WHEN CPM.created_by_id IS NOT NULL
                      THEN CPM.created_by_id
                    ELSE CPM.employee_id
                  END
                ) = STM.sales_employee_id
              `,
              fromField: 'ST.valid_from',
              toField: 'ST.valid_to'
            })}
            / NULLIF(STM.target_amount,0)
          ) * 100,
        2
        ) AS achievement_per,

          CONCAT(
            DATE_FORMAT(ST.valid_from, '%d-%m-%Y'),
            ' To ',
            DATE_FORMAT(ST.valid_to, '%d-%m-%Y')
          ) AS period,
          (
            SELECT CONCAT(
                u.title,' ',
                u.first_name,' ',
                u.last_name,' [',u.employee_code,']'
            )
            FROM HRMS_REGISTERED_USER u
            WHERE u.employee_id = ST.reporting_manager_id
            LIMIT 1
          ) AS reporting_manager_name

        FROM SALES_TARGET_MAPPING AS STM

        INNER JOIN SALES_TARGET AS ST
          ON ST.id = STM.sales_target_id AND ST.status='APPROVED'

        WHERE STM.sales_employee_id = ${login_employee_id}

        ORDER BY ST.id DESC
      `, {
        type: db.sequelize.QueryTypes.SELECT
      });

    }

    return res.status(200).send({
      code: 200,
      message: "List fetched successfully",
      data: records,
      is_reporting_manager: count > 0
    });

  } catch (error) {

    return res.status(500).send({
      code: 500,
      message: error.message
    });

  }
};

exports.getAchievementDetails = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send({
        code: 400,
        message: "target_id is required"
      });
    }

    const login_employee_id = req.user.employee_id;
    const role_code = req.user.role_code;
    const countResult = await db.sequelize.query(`
      SELECT COUNT(*) AS total
      FROM HRMS_REGISTERED_USER AS U
      WHERE U.role_master_id = 2
        AND U.reporting_manager_id = ${login_employee_id}
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    const count = countResult[0].total;

    let employee_id = '';
    if (count == 0 && role_code !== 'Super Admin') {
      employee_id = login_employee_id;
    }

    const [record] = await db.sequelize.query(`
        SELECT 
            st.id, st.target_amount, st.target_name, st.valid_from, st.valid_to,
            (
              SELECT CONCAT(
                  u.title,' ',
                  u.first_name,' ',
                  u.last_name,' [',u.employee_code,']'
              )
              FROM HRMS_REGISTERED_USER u
              WHERE u.employee_id = st.reporting_manager_id
              LIMIT 1
            ) AS reportingManagerName,
            (
            SELECT JSON_ARRAYAGG(

              JSON_OBJECT(

                'sales_employee_id',
                stm.sales_employee_id,

                'target_amount',
                stm.target_amount,
                 'achievement_amount',

                  ${getAchievementQuery({
                    employeeCondition: `
                      (
                        CASE
                          WHEN CPM.created_by_id IS NOT NULL
                            THEN CPM.created_by_id
                          ELSE CPM.employee_id
                        END
                      ) = stm.sales_employee_id
                    `,
                    fromField: 'st.valid_from',
                    toField: 'st.valid_to'
                  })},

                  'invoice_list',

                  ${getAchievementInvoiceListQuery({
                    employeeCondition: `
                      (
                        CASE
                          WHEN CPM.created_by_id IS NOT NULL
                            THEN CPM.created_by_id
                          ELSE CPM.employee_id
                        END
                      ) = stm.sales_employee_id
                    `,
                    fromField: 'st.valid_from',
                    toField: 'st.valid_to'
                  })},

                  'achievement_percentage',

                  ROUND(
                    (
                      ${getAchievementQuery({
                        employeeCondition: `
                          (
                            CASE
                              WHEN CPM.created_by_id IS NOT NULL
                                THEN CPM.created_by_id
                              ELSE CPM.employee_id
                            END
                          ) = stm.sales_employee_id
                        `,
                        fromField: 'st.valid_from',
                        toField: 'st.valid_to'
                      })}
                      / NULLIF(stm.target_amount,0)
                    ) * 100,
                  2
                  ),
                'employee_name',

                (
                  SELECT CONCAT(
                      emp.title,' ',
                      emp.first_name,' ',
                      emp.last_name,' [',emp.employee_code,']'
                  )
                  FROM HRMS_REGISTERED_USER emp
                  WHERE emp.employee_id = stm.sales_employee_id
                  LIMIT 1
                )

              )

            )

            FROM SALES_TARGET_MAPPING stm

            WHERE stm.sales_target_id = st.id

            ${employee_id
              ? `AND stm.sales_employee_id = ${employee_id}`
              : ''
            }

          ) AS employeeList

        FROM SALES_TARGET st
        WHERE st.id = ${id}
      `, {
        type: db.sequelize.QueryTypes.SELECT
      });


    if (!record) {
        return res.status(404).send({
        code: 404,
        message: "Record not found"
        });
    }

    return res.status(200).send({
        code: 200,
        message: "Record fetched successfully",
        data: record
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
}