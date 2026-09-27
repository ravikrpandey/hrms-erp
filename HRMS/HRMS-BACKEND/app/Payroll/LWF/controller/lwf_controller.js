const db = require("../../../models/index");
const Op = db.Sequelize.Op;

exports.createLwf = async (req, res) => {
  try {
    const { stateName, employee, employer, government } = req.body;
    const normalizedInput = stateName.replace(/\s+/g, "").toLowerCase();
    const existing = await db.payroll_lwf.findAll({
      where: { is_deleted: false },
    });
    const duplicate = existing.find((lwf) => {
      const normalizedDb = lwf.state_name.replace(/\s+/g, "").toLowerCase();
      return normalizedDb === normalizedInput;
    });

    if (duplicate) {
      return res.status(400).send({
        status: false,
        message: `LWF already exists for ${stateName}!`,
      });
    }
    const lwf = await db.payroll_lwf.create({
      state_name: stateName,
      employee,
      employer,
      government: government || null,
    });

    return res.status(200).send({
      status: true,
      message: "LWF created successfully!",
      data: lwf,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.getAllLwf = async (req, res) => {
  try {
    let query = `
      SELECT id, state_name, status 
      FROM PAYROLL_LWF
      WHERE is_deleted = false
    `;
    const [lwfList] = await db.sequelize.query(query);

    if (lwfList.length <= 0) {
      return res.status(200).send({
        status: true,
        code: 404,
        message: "Data not found!",
        data: lwfList,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Data fetched successfully!",
      data: lwfList,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.updateLwfStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const existingLwf = await db.payroll_lwf.findOne({
      where: { id, is_deleted: false },
    });
    if (!existingLwf) {
      return res
        .status(404)
        .send({ status: false, message: "Record not found!" });
    }

    await existingLwf.update({ status });

    return res.status(200).send({
      status: true,
      message: "Status updated successfully!",
      data: existingLwf,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.getLwfById = async (req, res) => {
  try {
    const id = req.params.id;

    const [data] = await db.sequelize.query(`
      SELECT state_name, employee, employer, government, is_deleted, status
      FROM PAYROLL_LWF
      WHERE id = ${id} AND is_deleted = false
    `);

    if (data.length <= 0) {
      return res.status(404).send({ status: false, message: "No data found!" });
    }

    return res.status(200).send({
      status: true,
      message: "Data fetched successfully!",
      data: data[0],
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.updateLwfById = async (req, res) => {
  try {
    const id = req.params.id;
    const { stateName, employee, employer, government } = req.body;

    const existingLwf = await db.payroll_lwf.findOne({
      where: { id, is_deleted: false },
    });
    if (!existingLwf) {
      return res
        .status(404)
        .send({ status: false, message: "Record not found!" });
    }

    // Normalize for duplicate check
    const normalizedInput = stateName.replace(/\s+/g, "").toLowerCase();

    // Check duplicates excluding the same record
    const duplicate = await db.payroll_lwf.findOne({
      where: {
        is_deleted: false,
        id: { [db.Sequelize.Op.ne]: id },
      },
    });

    if (duplicate) {
      const normalizedDb = duplicate.state_name
        .replace(/\s+/g, "")
        .toLowerCase();

      if (normalizedDb === normalizedInput) {
        return res.status(400).send({
          status: false,
          message: `LWF already exists for this state!`,
        });
      }
    }

    // Update record
    await db.payroll_lwf.update(
      {
        state_name: stateName,
        employee: employee || null,
        employer: employer || null,
        government: government || null,
        status: "ACTIVE",
        updatedAt: new Date(),
      },
      { where: { id } }
    );

    return res.status(200).send({
      status: true,
      message: "LWF updated successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};

exports.getComplianceDetails = async (req, res) => {
  try {
    const entity_id = req.query.entityType;
    const employee_id = req.params.employee_id;
    const [state_data] = await db.sequelize.query(`
      SELECT 
        MS.states_name
      FROM HRMS_REGISTERED_USER AS RU
      LEFT JOIN MASTER_STATE AS MS ON RU.employee_state_id = MS.states_id
      WHERE RU.employee_id = ${employee_id}
    `);

    if (!state_data || state_data.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "Entity not found!" });
    }
    const emp_work_state = state_data[0].states_name
      ? state_data[0].states_name.toLowerCase().replace(/\s+/g, "")
      : null;

    const [data] = await db.sequelize.query(`
  SELECT 
    EPF.id AS epf_id,
    ESI.id AS esi_id,
    OM.id AS overtime_id,
    LWF.id AS lwf_id,
    PT.id AS pt_id,
    PG.id AS gratuity_id,
    NPS.id AS nps_id,
    SAF.id AS saf_id
  FROM (SELECT 1) AS dummy
  LEFT JOIN PAYROLL_EPF AS EPF
    ON EPF.status = 'Active'
    AND EPF.is_deleted = false
  LEFT JOIN PAYROLL_ESI AS ESI 
    ON ESI.status = 'Active'
  LEFT JOIN OVERTIME_MASTER AS OM 
    ON OM.status = 'ACTIVE' AND OM.entity_id= ${entity_id}
  LEFT JOIN PAYROLL_LWF AS LWF 
    ON LWF.status = 'ACTIVE'
    AND LWF.is_deleted = false
    AND LOWER(REPLACE(LWF.state_name, ' ', '')) = '${emp_work_state}'
  LEFT JOIN PAYROLL_PT AS PT 
    ON PT.status = 'ACTIVE'
    AND PT.is_deleted = false
    AND LOWER(REPLACE(PT.state_name, ' ', '')) = '${emp_work_state}'
  LEFT JOIN PAYROLL_GRATUITY AS PG 
    ON PG.status = 'ACTIVE'
    AND PG.isDeleted = false
  LEFT JOIN PAYROLL_NPS_SCHEME AS NPS 
    ON NPS.status = 'ACTIVE'
    AND NPS.isDeleted = false
  LEFT JOIN PAYROLL_SUPERANNUATION_DATA AS SAF 
    ON SAF.status = 'ACTIVE'
    AND SAF.isDeleted = false
  LIMIT 1
`);

    if (!data || data.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "No compliance data found!" });
    }

    return res.status(200).send({
      status: true,
      message: "Data fetched successfully!",
      data: {
        epf_id: data[0].epf_id,
        esi_id: data[0].esi_id,
        overtime_id: data[0].overtime_id,
        lwf_id: data[0].lwf_id,
        pt_id: data[0].pt_id,
        gratuity_id: data[0].gratuity_id,
        nps_id: data[0].nps_id,
        saf_id: data[0].saf_id,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal server error!",
    });
  }
};
