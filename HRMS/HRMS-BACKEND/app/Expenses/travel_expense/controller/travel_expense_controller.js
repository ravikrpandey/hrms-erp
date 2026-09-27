const db = require("../../../models/index");
const Travel_model = db.travel_request;
const Travel_data = db.travel_request_data;
const WorkFlow = db.WorkFlow_Master;
const moment = require("moment");
const { sendDynamicMail } = require("../../../Recruitment/utils/mail/mail");
const logger = require("../../../../logger/index");
const { Sequelize, Op, where } = require("sequelize");
const { re, exp } = require("mathjs");
const { required } = require("nodemon/lib/config");
const {
  attribute,
} = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const model = require("../../../master/Currency_Convert/models/model");

/**Get all travel request*/
exports.getAlltravel = async (req, res) => {
  try {
    let { entity_id, fy_id, employee_id, expense_request_type } = req.query;
    entity_id = parseInt(entity_id);
    fy_id = parseInt(fy_id);
    // Optional expense type filtering for Indirect or Other expenses
    let filterCriteria = {
      entity_id: entity_id,
      financial_year_id: fy_id,
      user_id: employee_id,
      isDeleted: false,
      travel_request_status: {
        [Op.in]: ["APPROVED", "PENDING"],
      },
    };

    // Adding expense type filter if provided in the query
    if (
      expense_request_type &&
      (expense_request_type === "Indirect" || expense_request_type === "Other")
    ) {
      filterCriteria.expense_request_type = expense_request_type; // Filtering by expense type (Indirect or Other)
    } else if (expense_request_type) {
      return res.status(400).send({
        code: 400,
        message: "Invalid expense type. Must be 'Indirect' or 'Other'.",
      });
    }

    const getAllData = await Travel_model.findAll({
      where: filterCriteria, // Applying dynamic filter criteria
      attributes: [
        "travel_request_number",
        "travel_name",
        "travel_request_status",
        "id",
      ],
      order: [["id", "DESC"]],
    });

    const userData = await db.user.findOne({
      where: {
        employee_id: req.user.id,
      },
      include: [
        {
          model: db.TravelType,
          as: "grade",
          attributes: ["id", "name", "type"],
        },
      ],
      attributes: ["grade_id"],
    });

    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Travel Data Successfully",
        data: getAllData,
        grade: userData.grade,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Travel Data Found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/** get travel details */
exports.getTravelDetailsData = async (req, res) => {
  try {
    let Obj = {};
    const travel_id = req.params.id;
    const { expense_request_type } = req.body; // New field for expense type filtering

    // Fetching travel data
    const travel_data = await db.travel_request.findOne({
      where: { id: parseInt(travel_id) },
      attributes: [
        "travel_request_number",
        "current_date",
        "department_id",
        "id",
      ],
    });

    if (travel_data) {
      // Fetching travel data details based on the travel request ID
      const trv_data_array = await Travel_data.findAll({
        where: { travel_request_id: travel_data.id },
        include: [
          {
            model: db.travel_journey_bifurcation,
            as: "journeyBifurcation",
            include: [
              {
                model: db.city,
                as: "journeyFromCity",
                attributes: ["city_name"],
              },
              {
                model: db.city,
                as: "journeyToCity",
                attributes: ["city_name"],
              },
            ],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      const trv_approval_data = await db.travel_advance_booking.findOne({
        where: { travel_request_id: travel_data.id },
      });

      // Fetch the first and last travel details
      const first_trv_data = trv_data_array[0];
      const last_trv_data = trv_data_array[trv_data_array.length - 1];

      // Fetching the cities based on the travel data
      const from_location = await db.city.findOne({
        where: { city_id: first_trv_data.travel_from_city_id },
      });

      const to_location = await db.city.findOne({
        where: { city_id: last_trv_data.travel_to_city_id },
      });

      // Prepare the response data object
      Obj = {
        travel_id: travel_data.id,
        curr_date: moment().format("DD-MM-YYYY"),
        from_location: from_location ? from_location.city_name : null,
        to_location: to_location ? to_location.city_name : null,
        advance_amt: trv_approval_data ? trv_approval_data.total_amount : null,
        travel_request_number: travel_data.travel_request_number,
        travel_from_city_id: first_trv_data.travel_from_city_id,
        travel_to_city_id: last_trv_data.travel_to_city_id,
        department_id: travel_data.department_id,
        travel_from_date: first_trv_data.travel_from_date,
        travel_to_date: last_trv_data.travel_to_date,
        journeyBifurcation: first_trv_data.journeyBifurcation,
      };

      // Filter data based on the expense type (Indirect/Other) if provided
      if (expense_request_type) {
        // Check if the provided type matches
        if (
          expense_request_type !== "Indirect" &&
          expense_request_type !== "Other"
        ) {
          return res.status(400).send({
            code: 400,
            message: "Invalid expense type. Must be 'Indirect' or 'Other'.",
          });
        }

        // Additional filtering logic for Indirect/Other expenses can be added here if needed
        Obj.expense_request_type = expense_request_type;
      }

      // Fetching workflow data based on department ID and job name
      console.log(travel_data.department_id);

      const getData = await WorkFlow.findOne({
        where: {
          department_id: travel_data.department_id,
          job_name: "Travel Expense",
          status: "ACTIVE",
        },
        attributes: ["id"],
      });

      if (!getData) {
        return res.status(500).send({
          code: 500,
          message: "Workflow is not created for the required department!",
        });
      }

      return res.status(200).send({
        code: 200,
        message: "Data Fetched successfully",
        data: Obj,
      });
    } else {
      return res.status(404).send({
        code: "404",
        message: "No Travel Data found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.createExpRequest = async (req, res) => {
  const t = await db.sequelize.transaction(); // Start transaction

  try {
    let {
      entity_id,
      employee_id,
      financial_id,
      current_date,
      expense_request_type,
      travel_id,
      travel_from_city_id,
      travel_to_city_id,
      advance_amt,
      expenses,
      expense_data,
      expense_name,
    } = req.body;

    // Generate new expense request number
    const latestExpense = await db.expense_request.findOne({
      where: { entity_id },
      order: [["createdAt", "DESC"]],
      transaction: t,
    });

    const serial_number = latestExpense
      ? parseInt(latestExpense.expense_request_number.split("EXP")[1]) + 1
      : 1;

    // Get department info
    const department_data = await db.user.findOne({
      where: { employee_id: parseInt(employee_id) },
      attributes: ["employee_id", "department_id"],
      transaction: t,
    });

    if (!department_data) {
      await t.rollback();
      return res.status(404).send({
        code: 404,
        message: "Department not found for the employee!",
      });
    }

    // Get workflow for department
    const get_data = await WorkFlow.findOne({
      where: {
        department_id: department_data.department_id,
        entity_id: entity_id,
        job_name: "Travel Expense",
        status: "ACTIVE",
      },
      attributes: ["id"],
      transaction: t,
    });

    if (!get_data) {
      await t.rollback();
      return res.status(404).send({
        code: 404,
        message: "Workflow is not created for required department!",
      });
    }

    let exp_request;
    let createdExpenses = [];

    // Indirect Expense
    if (expense_request_type === "Indirect_Expense") {
      exp_request = await db.expense_request.create(
        {
          expense_request_number: "EXP" + serial_number,
          entity_id,
          department_id: department_data.department_id,
          employee_id,
          financial_year_id: financial_id,
          expense_request_type: "Indirect_Expense",
          current_date,
          travel_request_id: travel_id,
          travel_from_city_id,
          travel_to_city_id,
          advance_amount: advance_amt ? advance_amt : null,
        },
        { transaction: t }
      );

      if (Array.isArray(expenses)) {
        for (const expense of expenses) {
          const createdExpense = await db.expense_request_data.create(
            {
              expense_request_id: exp_request.id,
              exp_category_id: expense.exp_category_id,
              expense_name: expense.exp_name,
              expense_date: expense.exp_date,
              expense_remarks: expense.remarks,
              expense_document: expense.exp_documents,
              exp_amount: expense.exp_amount,
              journey_id: expense?.journey_id || null,
            },
            { transaction: t }
          );

          createdExpenses.push(createdExpense);
        }
      }
    }

    // Other Expense
    else if (expense_request_type === "Other_Expense") {
      const existingRequest = await db.expense_request.findOne({
        where: {
          current_date,
          entity_id,
          employee_id,
          financial_year_id: financial_id,
          isDeleted: false,
          expense_request_type: "Other_Expense",
        },
        order: [["createdAt", "DESC"]],
        transaction: t,
      });
      if (existingRequest) {
        // Update existing request
        exp_request = await existingRequest.update(
          {
            expense_request_number: existingRequest.expense_request_number,
            entity_id,
            department_id: department_data.department_id,
            employee_id,
            financial_year_id: financial_id,
            current_date,
            expense_request_type: "Other_Expense",
          },
          { transaction: t }
        );
      } else {
        exp_request = await db.expense_request.create(
          {
            expense_request_number: "EXP" + serial_number,
            entity_id,
            department_id: department_data.department_id,
            employee_id,
            financial_year_id: financial_id,
            current_date,
            expense_request_type: "Other_Expense",
          },
          { transaction: t }
        );
      }

      if (!exp_request) {
        await t.rollback();
        return res.status(400).send({
          code: 400,
          message: "Expense request not created!",
        });
      }

      if (Array.isArray(expense_data)) {
        for (const expense of expense_data) {
          const createdExpense = await db.expense_request_data.create(
            {
              expense_request_id: exp_request.id,
              expense_name: expense_name,
              travel_range: expense.travel_range,
              conveyance_type_id: expense.conveyance_type_id,
              expense_date: expense.expense_date,
              expense_remarks: expense.remark,
              exp_amount: expense.expense_amount,
              expense_document: expense.documents || null,
            },
            { transaction: t }
          );

          createdExpenses.push(createdExpense);
        }
      }
    } else if (expense_request_type === "Reimbursement_Expense") {
      const existingRequest = await db.expense_request.findOne({
        where: {
          current_date,
          entity_id,
          employee_id,
          financial_year_id: financial_id,
          isDeleted: false,
          expense_request_type: "Reimbursement_Expense",
        },
        order: [["createdAt", "DESC"]],
        transaction: t,
      });
      if (existingRequest) {
        // Update existing request
        exp_request = await existingRequest.update(
          {
            expense_request_number: existingRequest.expense_request_number,
            entity_id,
            department_id: department_data.department_id,
            employee_id,
            financial_year_id: financial_id,
            current_date,
            expense_request_type: "Reimbursement_Expense",
          },
          { transaction: t }
        );
      } else {
        exp_request = await db.expense_request.create(
          {
            expense_request_number: "EXP" + serial_number,
            entity_id,
            department_id: department_data.department_id,
            employee_id,
            financial_year_id: financial_id,
            current_date,
            expense_request_type: "Reimbursement_Expense",
          },
          { transaction: t }
        );
      }

      if (!exp_request) {
        await t.rollback();
        return res.status(400).send({
          code: 400,
          message: "Expense request not created!",
        });
      }

      if (Array.isArray(expense_data)) {
        for (const expense of expense_data) {
          const createdExpense = await db.expense_request_data.create(
            {
              expense_request_id: exp_request.id,
              expense_name: expense.expense_name,
              conveyance_type_id: expense.conveyance_type_id,
              expense_date: expense.expense_date,
              expense_remarks: expense.remark,
              exp_amount: expense.expense_amount,
              expense_document: expense.documents || null,
            },
            { transaction: t }
          );

          createdExpenses.push(createdExpense);
        }
      }
    }
    // Invalid Type
    else {
      await t.rollback();
      return res.status(400).send({
        code: 400,
        message: "No valid expense request type found!",
      });
    }

    // Approval Levels
    const expense_id = exp_request.id;

    const get_levels = await db.Work_Flow_range.findAll({
      where: {
        workflow_id: get_data.id,
        status: "ACTIVE",
      },
      attributes: ["level", "employee_id", "role_id", "workflow_id"],
      transaction: t,
    });

    const level_promises = get_levels.map(async (level) => {
      return await db.expense_approval.create(
        {
          level: level.level,
          employee_id: level.employee_id,
          workflow_id: level.workflow_id,
          expense_request_id: expense_id,
          role_id: level.role_id,
          department_id: department_data.department_id,
        },
        { transaction: t }
      );
    });

    await Promise.all(level_promises);

    // ✅ COMMIT TRANSACTION
    await t.commit();

    return res.status(200).send({
      code: 200,
      message: "Request created successfully!",
      data: { exp_request, createdExpenses },
    });
  } catch (error) {
    // ❌ ROLLBACK TRANSACTION
    await t.rollback();
    console.error("Error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getallExpRequest = async (req, res) => {
  const {
    entity_id,
    employee_id,
    role,
    financial_year_id,
    expense_type,
    expense_request_type,
  } = req.body;

  try {
    let query = `
        SELECT 
            k.*,
            MAX(q.expense_name) as expense_name,
            MAX(q.expense_date) as expense_date,
            MAX(q.expense_remarks) as expense_remarks,
            MAX(q.expense_document) as expense_document,
            SUM(q.exp_amount) as exp_amount,
            MAX(q.exp_category_id) as exp_category_id,
            MAX(a.level) as level,
            MAX(a.expense_approvel_status) as expense_approvel_status,
            MAX(a.expense_approval_remarks) as expense_approval_remarks,
            MAX(u.first_name) as first_name,
            MAX(u.last_name) as last_name,
            MAX(m.expense_type) as expense_category_name,
            MAX(MTT.name) as reimbursement_type
        FROM 
            EXPENSE_REQUEST AS k
        LEFT JOIN 
            EXPENSE_APPROVEL_LEVEL AS a ON k.id = a.expense_request_id
        LEFT JOIN 
            EXPENSE_REQUEST_DATA AS q ON k.id = q.expense_request_id
        LEFT JOIN 
          MASTER_TRAVEL_TYPE AS MTT ON q.conveyance_type_id = MTT.id
        LEFT JOIN 
            HRMS_REGISTERED_USER AS u ON u.employee_id = k.employee_id
        LEFT JOIN 
            MASTER_EXPENSE AS m ON m.id = q.exp_category_id
        WHERE 
            k.isDeleted = false AND k.entity_id = :entity_id AND k.financial_year_id = :financial_year_id AND k.expense_request_type = :expense_request_type
        `;

    // If an expense type filter is provided (either "DIRECT" or "OTHER"), add it to the query
    if (expense_type) {
      query += ` AND m.expense_type = :expense_type`;
    }

    // If the role is not "Super Admin", apply employee_id filter
    if (role !== "Super Admin") {
      query += ` AND k.employee_id = :employee_id`;
    }

    query += ` GROUP BY k.id ORDER BY k.createdAt DESC`;

    const replacements = { entity_id, financial_year_id, expense_request_type };
    if (role !== "Super Admin") replacements.employee_id = employee_id;
    if (expense_type) replacements.expense_type = expense_type; // Adding expense_type to replacements if provided

    const results = await db.sequelize.query(query, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(results.length > 0 ? 200 : 404).send({
      code: results.length > 0 ? 200 : 404,
      message:
        results.length > 0
          ? "Expense requests fetched successfully!"
          : "No expense requests found",
      data: results,
    });
  } catch (error) {
    logger.error(`Error in getallExpRequest: ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

// exports.getExpenseRequestById = async (req, res) => {
//     try {
//         const expense_request_id = req.params.id;
//         const expense_type = req.query.expense_type; // 'indirect' or 'other'

//         if (!expense_request_id || !expense_type) {
//             return res.status(400).send({
//                 code: 400,
//                 message: "Missing expense_request_id or expense_type"
//             });
//         }

//         // Map expense type to DB value
//         let dbExpenseType = '';
//         if (expense_type === 'indirect') {
//             dbExpenseType = 'Indirect_Expense';
//         } else if (expense_type === 'other') {
//             dbExpenseType = 'Other_Expense';
//         } else {
//             return res.status(400).send({
//                 code: 400,
//                 message: "Invalid expense_type. Must be 'indirect' or 'other'."
//             });
//         }

//         const query = `
//             SELECT
//                 er.id AS expense_request_id,
//                 er.employee_id,
//                 er.isDeleted,
//                 er.current_date,
//                 er.expense_request_type,
//                 er.advance_amount,
//                 er.expense_final_status,
//                 er.expense_request_number,
//                 er.travel_request_id,

//                 el.level,
//                 el.expense_approvel_status,
//                 el.expense_approval_remarks,

//                 u.first_name,
//                 u.last_name,

//                 ed.expense_name,
//                 ed.expense_date,
//                 ed.expense_remarks,
//                 ed.expense_document,
//                 ed.exp_amount,
//                 ed.exp_category_id,

//                 me.expense_type AS expense_category_name
//             FROM expense_request er
//             LEFT JOIN EXPENSE_APPROVEL_LEVEL el ON er.id = el.expense_request_id
//             LEFT JOIN hrms_registered_user u ON er.employee_id = u.employee_id
//             LEFT JOIN expense_request_data ed ON er.id = ed.expense_request_id AND ed.isDeleted = false
//             LEFT JOIN master_expense me ON ed.exp_category_id = me.id
//             WHERE er.isDeleted = false
//               AND er.id = :expense_request_id
//               AND er.expense_request_type = :dbExpenseType
//         `;

//         const results = await db.sequelize.query(query, {
//             replacements: { expense_request_id, dbExpenseType },
//             type: db.Sequelize.QueryTypes.SELECT
//         });

//         if (results.length > 0) {
//             const first = results[0];

//             const expenseRequest = {
//                 expense_request_id: first.expense_request_id,
//                 employee_id: first.employee_id,
//                 first_name: first.first_name,
//                 last_name: first.last_name,
//                 level: first.level,
//                 expense_approvel_status: first.expense_approvel_status,
//                 expense_approval_remarks: first.expense_approval_remarks,
//                 current_date: first.current_date,
//                 advance_amount: first.advance_amount,
//                 expense_final_status: first.expense_final_status,
//                 expense_request_number: first.expense_request_number,
//                 expense_request_type: first.expense_request_type,
//                 travel_request_id:first.travel_request_id,
//                 expense_request_data: []
//             };

//             results.forEach(row => {
//                 if (row.expense_name) {
//                     expenseRequest.expense_request_data.push({
//                         expense_name: row.expense_name,
//                         expense_date: row.expense_date,
//                         expense_remarks: row.expense_remarks,
//                         expense_document: row.expense_document,
//                         expense_amount: row.exp_amount,
//                         exp_category_id: row.exp_category_id,
//                         expense_category_name: row.expense_category_name
//                     });
//                 }
//             });

//             return res.status(200).send({
//                 code: 200,
//                 message: `${expense_type} expense request fetched successfully`,
//                 data: expenseRequest
//             });
//         } else {
//             return res.status(404).send({
//                 code: 404,
//                 message: "Expense Request not found"
//             });
//         }
//     } catch (error) {
//         logger.error(`Error ${error.message}`, { error });
//         console.error(error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Internal Server Error"
//         });
//     }
// };

exports.getExpenseRequestById = async (req, res) => {
  try {
    const expense_request_id = req.params.id;
    const expense_type = req.query.expense_type; // 'indirect' or 'other'

    if (!expense_request_id || !expense_type) {
      return res.status(400).send({
        code: 400,
        message: "Missing expense_request_id or expense_type",
      });
    }

    // Normalize the expense type input
    let dbExpenseType = "";
    if (expense_type.toLowerCase() === "indirect") {
      dbExpenseType = "indirect_expense";
    } else if (expense_type.toLowerCase() === "other") {
      dbExpenseType = "other_expense";
    } else {
      return res.status(400).send({
        code: 400,
        message: "Invalid expense_type. Must be 'indirect' or 'other'.",
      });
    }

    const query = `
            SELECT  
                er.id AS expense_request_id,
                er.employee_id,
                er.isDeleted,
                er.current_date,
                er.expense_request_type,
                er.advance_amount,
                er.expense_final_status,
                er.expense_request_number,
                er.travel_request_id,
                er.status,
                el.level,
                el.expense_approvel_status,
                el.expense_approval_remarks,
                u.first_name,
                u.last_name,
                ed.expense_name,
                ed.expense_date,
                ed.expense_remarks,
                ed.expense_document,
                ed.exp_amount,
                ed.exp_category_id,
                me.expense_type AS expense_category_name,
                ed.journey_id,
                TRD.travel_to_date
            FROM EXPENSE_REQUEST er
LEFT JOIN (
  SELECT *
  FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY expense_request_id ORDER BY level DESC) as rn
    FROM EXPENSE_APPROVEL_LEVEL
  ) as ranked
  WHERE rn = 1
) el ON er.id = el.expense_request_id 
            LEFT JOIN HRMS_REGISTERED_USER u ON er.employee_id = u.employee_id
            LEFT JOIN EXPENSE_REQUEST_DATA ed ON er.id = ed.expense_request_id AND ed.isDeleted = false
            LEFT JOIN ESS_TRAVEL_REQUEST_DATA TRD ON er.travel_request_id = TRD.travel_request_id
            LEFT JOIN MASTER_EXPENSE me ON ed.exp_category_id = me.id
            WHERE er.isDeleted = false 
              AND er.id = :expense_request_id 
              AND LOWER(er.expense_request_type) = :dbExpenseType
        `;

    const results = await db.sequelize.query(query, {
      replacements: {
        expense_request_id,
        dbExpenseType: dbExpenseType.toLowerCase(),
      },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      const first = results[0];

      const expenseRequest = {
        expense_request_id: first.expense_request_id,
        employee_id: first.employee_id,
        first_name: first.first_name,
        last_name: first.last_name,
        level: first.level,
        expense_approvel_status: first.expense_approvel_status,
        status: first.status,
        expense_approval_remarks: first.expense_approval_remarks,
        current_date: first.current_date,
        advance_amount: first.advance_amount,
        expense_final_status: first.expense_final_status,
        expense_request_number: first.expense_request_number,
        expense_request_type: first.expense_request_type,
        travel_request_id: first.travel_request_id,
        travel_to_date: first.travel_to_date,
        expense_request_data: [],
      };

      results.forEach((row) => {
        if (row.expense_name) {
          expenseRequest.expense_request_data.push({
            expense_name: row.expense_name,
            expense_date: row.expense_date,
            expense_remarks: row.expense_remarks,
            expense_document: row.expense_document,
            expense_amount: row.exp_amount,
            exp_category_id: row.exp_category_id,
            expense_category_name: row.expense_category_name,
            journey_id: row.journey_id || null, // Include journey_id if available
          });
        }
      });

      return res.status(200).send({
        code: 200,
        message: `${expense_type} expense request fetched successfully`,
        data: expenseRequest,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Expense Request not found",
      });
    }
  } catch (error) {
    console.error("getExpenseRequestById error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

/** Delete expense request by type (indirect / other) */
exports.deleteExpenseRequestById = async (req, res) => {
  try {
    const expense_id = Number(req.params.id);
    const expense_type = req.query.expense_type; // 'indirect' or 'other'

    if (!expense_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing expense ID or expense type",
      });
    }

    // Table mapping
    let requestModel, requestDataModel;
    requestModel = db.expense_request;
    requestDataModel = db.expense_request_data;
    // if (expense_type === "indirect") {
    //     requestModel = db.indirect_expense_request;
    //     requestDataModel = db.indirect_expense_request_data;
    // } else if (expense_type === "other") {
    //     requestModel = db.other_expense_request;
    //     requestDataModel = db.other_expense_request_data;
    // } else {
    //     return res.status(400).send({
    //         code: 400,
    //         message: "Invalid expense type. Must be 'indirect' or 'other'."
    //     });
    // }

    // Find if exists
    const data = await requestModel.findOne({
      where: { id: expense_id, isDeleted: false },
    });

    if (data) {
      // Soft delete from main table
      await requestModel.update(
        { isDeleted: true },
        {
          where: { id: expense_id },
        }
      );

      // Soft delete from approval table
      await db.expense_approval.update(
        { isDeleted: true },
        {
          where: { expense_request_id: expense_id },
        }
      );

      // Soft delete from data table
      await requestDataModel.update(
        { isDeleted: true },
        {
          where: { expense_request_id: expense_id },
        }
      );

      return res.status(200).send({
        code: 200,
        message: `Expense deleted successfully`,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Expense not found",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

/** update expense */
// exports.updateExpRequest = async (req, res) => {
//     try {
//         const {
//             expense_request_id,
//             expense_request_type, // "Indirect_Expense" or "Other_Expense"
//             expenses
//         } = req.body;

//         if (!expense_request_id || !expense_request_type || !expenses) {
//             return res.status(400).send({
//                 code: 400,
//                 message: "Missing required fields"
//             });
//         }

//         // Model mapping
//         let requestModel, requestDataModel;

//         if (expense_request_type === "Indirect_Expense") {
//             requestModel = db.indirect_expense_request;
//             requestDataModel = db.indirect_expense_request_data;
//         } else if (expense_request_type === "Other_Expense") {
//             requestModel = db.other_expense_request;
//             requestDataModel = db.other_expense_request_data;
//         } else {
//             return res.status(400).send({
//                 code: 400,
//                 message: "Invalid expense request type"
//             });
//         }

//         // Check if request exists
//         const expense_details = await requestModel.findOne({
//             where: { id: expense_request_id }
//         });

//         if (!expense_details) {
//             return res.status(404).send({
//                 code: 404,
//                 message: "Expense request not found!"
//             });
//         }

//         // Delete old data
//         await requestDataModel.destroy({ where: { expense_request_id } });

//         // Create updated data
//         let updatedExpenses = [];

//         for (const expense of expenses) {
//             const updatedExpense = await requestDataModel.create({
//                 expense_request_id: expense_request_id,
//                 exp_category_id: expense.exp_category_id,
//                 expense_name: expense.exp_name,
//                 expense_date: expense.exp_date,
//                 expense_remarks: expense.remarks,
//                 expense_document: expense.exp_documents,
//                 exp_amount: expense.exp_amount
//             });
//             updatedExpenses.push(updatedExpense);
//         }

//         return res.status(200).send({
//             code: 200,
//             message: "Expense request updated successfully",
//             data: updatedExpenses
//         });

//     } catch (error) {
//         logger.error(`Error ${error.message}`, { error });
//         console.error("Error in updateExpRequest:", error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Server Error"
//         });
//     }
// };

exports.updateExpRequest = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      expense_request_id,
      entity_id,
      employee_id,
      financial_id,
      current_date,
      expense_request_type,
      travel_id,
      travel_from_city_id,
      travel_to_city_id,
      advance_amt,
      expenses,
      expense_amount,
      expense_description,
      expense_name,
      remark,
      expense_category,
      isValidToSubmit,
      isValidToApprove,
      expense_data,
    } = req.body;

    // === Basic Input Validation ===
    if (!entity_id || !employee_id || !financial_id || !expense_request_type) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields!",
      });
    }

    const empId = Number(employee_id);
    if (isNaN(empId)) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid employee_id!" });
    }

    // === Get Department Info ===
    const department_data = await db.user.findOne({
      where: { employee_id: empId },
      attributes: ["employee_id", "department_id"],
      transaction,
    });

    if (!department_data) {
      await transaction.rollback();
      return res.status(404).send({
        code: 404,
        message: "Department not found for the employee!",
      });
    }

    // === Get Workflow ===
    const workflow = await WorkFlow.findOne({
      where: {
        department_id: department_data.department_id,
        entity_id,
        job_name: "Travel Expense",
        status: "ACTIVE",
      },
      attributes: ["id"],
      transaction,
    });

    if (!workflow) {
      await transaction.rollback();
      return res.status(404).send({
        code: 404,
        message: "Workflow is not created for the required department!",
      });
    }

    let exp_request;
    let createdExpenses = [];
    // Indirect Expense
    if (expense_request_type === "Indirect_Expense") {
      // === CASE 1: Update Existing ===
      if (expense_request_id) {
        const existingRequest = await db.expense_request.findOne({
          where: { id: expense_request_id },
          transaction,
        });

        if (!existingRequest) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: "Expense request not found!",
          });
        }

        // Handle status
        if (
          existingRequest.expense_final_status === "DRAFT" &&
          isValidToSubmit
        ) {
          existingRequest.expense_final_status = isValidToApprove
            ? "APPROVED"
            : "PENDING";

          const [approval, created] = await db.expense_approval.findOrCreate({
            where: { employee_id, expense_request_id },
            defaults: {
              level: 1,
              workflow_id: workflow.id,
              role_id: null,
              department_id: department_data.department_id,
              expense_approvel_status: isValidToApprove
                ? "APPROVED"
                : "PENDING",
              expense_approval_remarks: isValidToApprove
                ? "Default Approve"
                : null,
            },
            transaction,
          });

          if (!created) {
            await approval.update(
              {
                expense_approvel_status: isValidToApprove
                  ? "APPROVED"
                  : "PENDING",
                expense_approval_remarks: isValidToApprove
                  ? "Default Approve"
                  : null,
              },
              { transaction }
            );
          }
        }

        const updatedFields = {
          entity_id,
          department_id: department_data.department_id,
          employee_id,
          financial_year_id: financial_id,
          current_date,
          travel_request_id: travel_id || null,
          travel_from_city_id: travel_from_city_id || null,
          travel_to_city_id: travel_to_city_id || null,
          advance_amount: advance_amt || null,
          expense_request_type,
          exp_amount: expense_amount || null,
          expense_description: expense_description || null,
          expense_remarks: remark || null,
          exp_category_id: expense_category || null,
          expense_final_status: existingRequest.expense_final_status,
        };

        await existingRequest.update(updatedFields, { transaction });
        exp_request = existingRequest;

        // Clear old request data
        const deletedRows = await db.expense_request_data.destroy({
          where: { expense_request_id: existingRequest.id },
          transaction,
        });
        console.log(`Deleted previous expense rows: ${deletedRows}`);
      } else {
        // === CASE 2: Create New ===
        const latestExpense = await db.expense_request.findOne({
          where: { entity_id },
          order: [["createdAt", "DESC"]],
          transaction,
        });

        const serial = latestExpense?.expense_request_number?.replace(
          "EXP",
          ""
        );
        const serial_number = /^\d+$/.test(serial) ? parseInt(serial) + 1 : 1;

        exp_request = await db.expense_request.create(
          {
            expense_request_number: "EXP" + serial_number,
            entity_id,
            department_id: department_data.department_id,
            employee_id,
            financial_year_id: financial_id,
            current_date,
            travel_request_id: travel_id || null,
            travel_from_city_id: travel_from_city_id || null,
            travel_to_city_id: travel_to_city_id || null,
            advance_amount: advance_amt || null,
            expense_request_type,
            exp_amount: expense_amount || null,
            expense_description: expense_description || null,
            expense_remarks: remark || null,
            exp_category_id: expense_category || null,
          },
          { transaction }
        );
      }

      // === Add Expense Request Data ===
      if (Array.isArray(expenses)) {
        for (const expense of expenses) {
          const baseData = {
            expense_request_id: exp_request.id,
            exp_category_id: expense.exp_category_id,
            expense_date: expense.exp_date,
            expense_remarks: expense.remarks,
            expense_document: expense.exp_documents,
            exp_amount: expense.exp_amount,
          };

          if (expense_request_type === "Indirect_Expense") {
            baseData.expense_name = expense.exp_name;
            baseData.journey_id = expense.journey_id || null;
          } else if (expense_request_type === "Other_Expense") {
            baseData.expense_description = expense.exp_name;
          } else {
            await transaction.rollback();
            return res.status(400).send({
              code: 400,
              message: "Invalid expense request type!",
            });
          }

          const created = await db.expense_request_data.create(baseData, {
            transaction,
          });
          createdExpenses.push(created);
        }
      }
    }

    // Other Expense
    else if (expense_request_type === "Other_Expense") {
      // === CASE 1: Update Existing ===
      if (expense_request_id) {
        const existingRequest = await db.expense_request.findOne({
          where: { id: expense_request_id },
          transaction,
        });

        if (!existingRequest) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: "Expense request not found!",
          });
        }

        // Handle status
        if (
          existingRequest.expense_final_status === "DRAFT" &&
          isValidToSubmit
        ) {
          existingRequest.expense_final_status = isValidToApprove
            ? "APPROVED"
            : "PENDING";

          const [approval, created] = await db.expense_approval.findOrCreate({
            where: { employee_id, expense_request_id },
            defaults: {
              level: 1,
              workflow_id: workflow.id,
              role_id: null,
              department_id: department_data.department_id,
              expense_approvel_status: isValidToApprove
                ? "APPROVED"
                : "PENDING",
              expense_approval_remarks: isValidToApprove
                ? "Default Approve"
                : null,
            },
            transaction,
          });

          if (!created) {
            await approval.update(
              {
                expense_approvel_status: isValidToApprove
                  ? "APPROVED"
                  : "PENDING",
                expense_approval_remarks: isValidToApprove
                  ? "Default Approve"
                  : null,
              },
              { transaction }
            );
          }
        }

        const updatedFields = {
          entity_id,
          department_id: department_data.department_id,
          employee_id,
          financial_year_id: financial_id,
          current_date,
          advance_amount: advance_amt || null,
          expense_request_type,
          expense_final_status: existingRequest.expense_final_status,
        };

        await existingRequest.update(updatedFields, { transaction });
        exp_request = existingRequest;

        // Clear old request data
        const deletedRows = await db.expense_request_data.destroy({
          where: { expense_request_id: existingRequest.id },
          transaction,
        });
        console.log(`Deleted previous expense rows: ${deletedRows}`);

        if (Array.isArray(expense_data)) {
          for (const expense of expense_data) {
            const createdExpense = await db.expense_request_data.create(
              {
                expense_request_id: exp_request.id,
                expense_name: expense_name,
                travel_range: expense.travel_range,
                conveyance_type_id: expense.conveyance_type_id,
                expense_date: expense.expense_date,
                expense_remarks: expense.remark,
                exp_amount: expense.expense_amount,
                expense_document: expense.documents || null,
              },
              { transaction }
            );

            createdExpenses.push(createdExpense);
          }
        }
      }
    }
    // Reimbursement Expense
    else if (expense_request_type === "Reimbursement_Expense") {
      // === CASE 1: Update Existing ===
      if (expense_request_id) {
        const existingRequest = await db.expense_request.findOne({
          where: { id: expense_request_id },
          transaction,
        });

        if (!existingRequest) {
          await transaction.rollback();
          return res.status(404).send({
            code: 404,
            message: "Expense request not found!",
          });
        }

        // Handle status
        if (
          existingRequest.expense_final_status === "DRAFT" &&
          isValidToSubmit
        ) {
          existingRequest.expense_final_status = isValidToApprove
            ? "APPROVED"
            : "PENDING";

          const [approval, created] = await db.expense_approval.findOrCreate({
            where: { employee_id, expense_request_id },
            defaults: {
              level: 1,
              workflow_id: workflow.id,
              role_id: null,
              department_id: department_data.department_id,
              expense_approvel_status: isValidToApprove
                ? "APPROVED"
                : "PENDING",
              expense_approval_remarks: isValidToApprove
                ? "Default Approve"
                : null,
            },
            transaction,
          });

          if (!created) {
            await approval.update(
              {
                expense_approvel_status: isValidToApprove
                  ? "APPROVED"
                  : "PENDING",
                expense_approval_remarks: isValidToApprove
                  ? "Default Approve"
                  : null,
              },
              { transaction }
            );
          }
        }

        const updatedFields = {
          entity_id,
          department_id: department_data.department_id,
          employee_id,
          financial_year_id: financial_id,
          current_date,
          advance_amount: advance_amt || null,
          expense_request_type,
          expense_final_status: existingRequest.expense_final_status,
        };

        await existingRequest.update(updatedFields, { transaction });
        exp_request = existingRequest;

        // Clear old request data
        const deletedRows = await db.expense_request_data.destroy({
          where: { expense_request_id: existingRequest.id },
          transaction,
        });
        console.log(`Deleted previous expense rows: ${deletedRows}`);

        if (Array.isArray(expense_data)) {
          for (const expense of expense_data) {
            const createdExpense = await db.expense_request_data.create(
              {
                expense_request_id: exp_request.id,
                expense_name: expense.expense_name,
                conveyance_type_id: expense.conveyance_type_id,
                expense_date: expense.expense_date,
                expense_remarks: expense.remark,
                exp_amount: expense.expense_amount,
                expense_document: expense.documents || null,
              },
              { transaction }
            );

            createdExpenses.push(createdExpense);
          }
        }
      }
    }
    // Invalid Type
    else {
      await t.rollback();
      return res.status(400).send({
        code: 400,
        message: "No valid expense request type found!",
      });
    }

    // === Setup Approval (New Only) ===
    if (!expense_request_id) {
      const approvalLevels = await db.Work_Flow_range.findAll({
        where: {
          workflow_id: workflow.id,
          status: "ACTIVE",
        },
        attributes: ["level", "employee_id", "role_id", "workflow_id"],
        transaction,
      });

      const approvalPromises = approvalLevels.map((level) =>
        db.expense_approval.create(
          {
            level: level.level,
            employee_id: level.employee_id,
            workflow_id: level.workflow_id,
            expense_request_id: exp_request.id,
            role_id: level.role_id,
            department_id: department_data.department_id,
          },
          { transaction }
        )
      );

      await Promise.all(approvalPromises);
    }

    // === Commit Everything ===
    await transaction.commit();
    return res.status(200).send({
      code: 200,
      message: expense_request_id
        ? "Request updated successfully!"
        : "Request created successfully!",
      data: { exp_request, createdExpenses },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error:", error.stack || error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/** Get level to be approved */
// exports.getExpLevelsToBeApproved = async (req, res) => {
//     try {
//         const employee_id = req.query;
//         const entity_id = req.query;

//         // Log the input parameters to verify
//         console.log("Employee ID: ", employee_id);
//         console.log("Entity ID: ", entity_id);

//         // Indirect Expense Query
//         const indirectExpenseQuery = `
//             SELECT
//                 tr.id,
//                 tr.level,
//                 tr.expense_request_id,
//                 tr.expense_approvel_status,
//                 td.expense_request_type,
//                 tr.status,
//                 tr.employee_id,
//                 tr.workflow_id,
//                 tr.role_id,
//                 tr.department_id,
//                 td.entity_id AS entity_id,
//                 td.expense_request_number,
//                 td.current_date,
//                 tr.isDeleted,
//                 tr.createdAt,
//                 tr.updatedAt,
//                 fc.first_name,
//                 fc.last_name
//             FROM
//                 EXPENSE_APPROVEL_LEVEL AS tr
//             LEFT JOIN
//                 EXPENSE_REQUEST AS td ON tr.expense_request_id = td.id AND td.isDeleted = false
//             LEFT JOIN
//                 HRMS_REGISTERED_USER AS fc ON td.employee_id = fc.employee_id
//             LEFT JOIN
//                 MASTER_DEPARTMENT AS tc ON tc.dept_id = tr.department_id
//             WHERE
//                 tr.employee_id = ${employee_id}
//                 AND td.entity_id = ${entity_id}
//                 AND td.expense_request_type = 'Indirect_Expense'
//                 AND tr.status = 'ACTIVE'
//                 AND tr.expense_approvel_status = 'PENDING'
//                 AND NOT EXISTS (
//                     SELECT 1
//                     FROM EXPENSE_APPROVEL_LEVEL AS prev
//                     WHERE prev.expense_request_id = tr.expense_request_id
//                     AND prev.level < tr.level
//                     AND prev.expense_approvel_status != 'APPROVED'
//                 );
//         `;

//         // Log the query to check if it's being built correctly
//         console.log("Indirect Expense Query:", indirectExpenseQuery);

//         // Execute the query
//         const indirectResults = await db.sequelize.query(indirectExpenseQuery, {
//             type: db.sequelize.QueryTypes.SELECT,
//         });

//         // Log the results to check if any data is fetched
//         console.log("Indirect Expense Results:", indirectResults);

//         if (indirectResults.length === 0) {
//             return res.status(404).send({
//                 code: 404,
//                 message: "No Indirect Expense Found",
//                 data: [],
//             });
//         }

//         // Return the results
//         return res.status(200).send({
//             code: 200,
//             message: "Expense requests fetched successfully",
//             data: {
//                 indirect_expenses: indirectResults,
//             },
//         });

//     } catch (error) {
//         logger.error(`Error ${error.message}`, { error });
//         console.error(error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Server Error",
//         });
//     }
// };

// exports.getExpLevelsToBeApproved = async (req, res) => {
//     try {
//         const { employee_id, entity_id } = req.params;
//         if (!employee_id || !entity_id) {
//             return res.status(400).send({
//                 code: 400,
//                 message: "Missing employee_id or entity_id in route params!",
//             });
//         }

//         const indirectExpenseQuery = `
//             SELECT
//                 TR.id,
//                 TR.level,
//                 TR.expense_request_id,
//                 TR.expense_approvel_status,
//                 TD.expense_request_type,
//                 TR.status,
//                 TR.employee_id,
//                 TR.workflow_id,
//                 TR.role_id,
//                 TR.department_id,
//                 TD.entity_id AS entity_id,
//                 TD.expense_request_number,
//                 TD.current_date,
//                 TR.isDeleted,
//                 TR.createdAt,
//                 TR.updatedAt,
//                 FC.first_name,
//                 FC.last_name
//             FROM
//                 EXPENSE_APPROVEL_LEVEL AS TR
//             LEFT JOIN
//                 EXPENSE_REQUEST AS TD
//                 ON TR.expense_request_id = TD.id AND TD.isDeleted = false
//             LEFT JOIN
//                 HRMS_REGISTERED_USER AS FC
//                 ON TD.employee_id = FC.employee_id
//             LEFT JOIN
//                 MASTER_DEPARTMENT AS TC
//                 ON TC.dept_id = TR.department_id
//             WHERE
//                 TR.employee_id = :employee_id
//                 AND TD.entity_id = :entity_id
//                 AND TD.expense_request_type = 'Indirect_Expense'
//                 AND TR.status = 'ACTIVE'
//                 AND TR.expense_approvel_status = 'PENDING'
//                 AND NOT EXISTS (
//                     SELECT 1
//                     FROM EXPENSE_APPROVEL_LEVEL AS prev
//                     WHERE prev.expense_request_id = TR.expense_request_id
//                     AND prev.level < TR.level
//                     AND prev.expense_approvel_status != 'APPROVED'
//                 );
//         `;

//         const indirectResults = await db.sequelize.query(indirectExpenseQuery, {
//             type: db.sequelize.QueryTypes.SELECT,
//             replacements: {
//                 employee_id,
//                 entity_id
//             }
//         });

//         if (indirectResults.length === 0) {
//             return res.status(404).send({
//                 code: 404,
//                 message: "No indirect expense found!",
//                 data: [],
//             });
//         }

//         return res.status(200).send({
//             code: 200,
//             message: "Expense data fetched successfully!",
//             data: indirectResults
//         });

//     } catch (error) {
//         console.error("Error in getExpLevelsToBeApproved:", error);
//         return res.status(500).send({
//             code: 500,
//             message: error.message || "Server Error",
//         });
//     }
// };

exports.getExpLevelsToBeApproved = async (req, res) => {
    try {
        const { employee_id, entity_id } = req.params;
        const { expense_type = 'Indirect_Expense' } = req.query; // Default to Indirect_Expense

        if (!employee_id || !entity_id) {
            return res.status(400).send({
                code: 400,
                message: "Missing employee_id or entity_id in route params!",
            });
        }

        const expenseLevelQuery = `
            SELECT
                TR.id,
                TR.level,
                TR.expense_request_id,
                TR.expense_approvel_status,
                TD.expense_request_type,
                TR.status,
                TR.employee_id,
                TR.workflow_id,
                TR.role_id,
                TR.department_id,
                TD.entity_id AS entity_id,
                TD.expense_request_number,
                TD.current_date,
                TR.isDeleted,
                TR.createdAt,
                TR.updatedAt,
                FC.first_name,
                FC.last_name
            FROM
                EXPENSE_APPROVEL_LEVEL AS TR
            LEFT JOIN
                EXPENSE_REQUEST AS TD
                ON TR.expense_request_id = TD.id AND TD.isDeleted = false
            LEFT JOIN
                HRMS_REGISTERED_USER AS FC
                ON TD.employee_id = FC.employee_id
            LEFT JOIN
                MASTER_DEPARTMENT AS TC
                ON TC.dept_id = TR.department_id
            WHERE
                TR.employee_id = :employee_id
                AND TD.entity_id = :entity_id
                AND TD.expense_request_type = :expense_type
                AND TR.status = 'ACTIVE'
                AND TR.expense_approvel_status = 'PENDING'
                AND NOT EXISTS (
                    SELECT 1
                    FROM EXPENSE_APPROVEL_LEVEL AS prev
                    WHERE prev.expense_request_id = TR.expense_request_id
                    AND prev.level < TR.level
                    AND prev.expense_approvel_status != 'APPROVED'
                );
        `;

        const results = await db.sequelize.query(expenseLevelQuery, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: {
                employee_id,
                entity_id,
                expense_type
            }
        });

        if (results.length === 0) {
            return res.status(404).send({
                code: 404,
                message: `No ${expense_type} found!`,
                data: [],
            });
        }

        return res.status(200).send({
            code: 200,
            message: `${expense_type} data fetched successfully!`,
            data: results
        });

    } catch (error) {
        console.error("Error in getExpLevelsToBeApproved:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};

// exports.getExpLevelsToBeApproved = async (req, res) => {
//   try {
//     const { employee_id, entity_id } = req.params;

//     if (!employee_id || !entity_id) {
//       return res.status(400).send({
//         code: 400,
//         message: "Missing employee_id or entity_id in route params!",
//       });
//     }

//     // Query for both 'Indirect_Expense' and 'Other_Expense'
//     const expenseLevelQuery = `
//             SELECT 
//                 TR.id,
//                 TR.level,
//                 TR.expense_request_id,
//                 TR.expense_approvel_status,
//                 TD.expense_request_type,
//                 TR.status,
//                 TR.employee_id,
//                 TR.workflow_id,
//                 TR.role_id,
//                 TR.department_id,
//                 TD.entity_id AS entity_id,
//                 TD.expense_request_number,
//                 TD.current_date,
//                 TR.isDeleted,
//                 TR.createdAt,
//                 TR.updatedAt,
//                 FC.first_name,
//                 FC.last_name
//             FROM 
//                 EXPENSE_APPROVEL_LEVEL AS TR
//             LEFT JOIN 
//                 EXPENSE_REQUEST AS TD 
//                 ON TR.expense_request_id = TD.id AND TD.expense_final_status = 'PENDING' AND TD.isDeleted = false
//             LEFT JOIN 
//                 HRMS_REGISTERED_USER AS FC 
//                 ON TD.employee_id = FC.employee_id
//             LEFT JOIN 
//                 MASTER_DEPARTMENT AS TC 
//                 ON TC.dept_id = TR.department_id
//             WHERE 
//                 TR.employee_id = :employee_id 
//                 AND TD.entity_id = :entity_id
//                 AND TR.status = 'ACTIVE'
//                 AND TR.expense_approvel_status = 'PENDING'
//                 AND NOT EXISTS (
//                     SELECT 1
//                     FROM EXPENSE_APPROVEL_LEVEL AS prev
//                     WHERE prev.expense_request_id = TR.expense_request_id 
//                     AND prev.level < TR.level
//                     AND prev.expense_approvel_status != 'APPROVED'
//                 )
//             ORDER BY createdAt DESC
//         `;

//     // Fetching both types of expense data
//     const results = await db.sequelize.query(expenseLevelQuery, {
//       type: db.sequelize.QueryTypes.SELECT,
//       replacements: {
//         employee_id,
//         entity_id,
//       },
//     });

//     if (results.length === 0) {
//       return res.status(404).send({
//         code: 404,
//         message: "No expenses found!",
//         data: [],
//       });
//     }

//     // Sending data back to frontend
//     return res.status(200).send({
//       code: 200,
//       message: "Expense data fetched successfully!",
//       data: results, // This will include both 'Indirect_Expense' and 'Other_Expense'
//     });
//   } catch (error) {
//     console.error("Error in getExpLevelsToBeApproved:", error);
//     return res.status(500).send({
//       code: 500,
//       message: error.message || "Server Error",
//     });
//   }
// };

/** Get Rejected Expense Request*/
exports.getExpenseRejectedList = async (req, res) => {
  try {
    const user_id = req.params.id;
    const entity_id = req.params.entity_id;
    const { expense_request_type } = req.query;

    const query = `
        WITH CTE AS (
            SELECT 
                tr.id AS id,
                tr.level AS level,
                tr.expense_approvel_status AS expense_approvel_status,
                tr.status AS status,
                td.expense_request_type,
                tr.isDeleted AS isDeleted,
                tr.createdAt AS createdAt,
                tr.updatedAt AS updatedAt,
                tr.employee_id AS employee_id,
                tr.workflow_id AS workflow_id,
                tr.expense_request_id AS expense_request_id,
                tr.role_id AS role_id,
                tr.department_id AS department_id,
                fc.first_name AS first_name,
                fc.last_name AS last_name,
                td.entity_id AS entity_id,
                td.current_date,
                td.expense_request_number AS expense_request_number,
                aggregated_data.travel_from_date AS travel_from_date,
                aggregated_data.travel_to_date AS travel_to_date,
                ROW_NUMBER() OVER (PARTITION BY td.expense_request_number ORDER BY tr.id) as row_num
            FROM 
                EXPENSE_APPROVEL_LEVEL AS tr
            INNER JOIN 
                EXPENSE_REQUEST AS td ON tr.expense_request_id = td.id AND td.isDeleted = false
            LEFT JOIN (
                SELECT 
                    travel_request_id,
                    MIN(travel_from_date) AS travel_from_date,
                    MAX(travel_to_date) AS travel_to_date
                FROM 
                    ESS_TRAVEL_REQUEST_DATA
                WHERE 
                    isDeleted = false
                GROUP BY 
                    travel_request_id
            ) AS aggregated_data ON td.travel_request_id = aggregated_data.travel_request_id
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON td.employee_id = fc.employee_id
            LEFT JOIN 
                MASTER_DEPARTMENT AS tc ON tc.dept_id = tr.department_id
            LEFT JOIN 
                EXPENSE_REQUEST_DATA AS tds ON tr.expense_request_id = tds.expense_request_id AND tds.isDeleted = false    
            WHERE 
                tr.employee_id = ${user_id}
                AND td.entity_id = ${entity_id}
                AND td.expense_request_type = '${expense_request_type}'
                AND tr.status = 'ACTIVE'
                AND tr.expense_approvel_status = 'REJECTED'
                AND td.expense_request_type IN ('Indirect_Expense', 'Other_Expense', 'Reimbursement_Expense')
        )
        SELECT * FROM CTE
        WHERE row_num = 1
        ORDER BY createdAt DESC
        `;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData && getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message:
          "Fetched Rejected Indirect and Other Expense Data Successfully",
        data: getAllData,
      });
    } else {
      return res
        .status(403)
        .send({ code: 403, message: "Record Not Found", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** Get Approved Expense Request */
exports.getApprovedExpenseRequest = async (req, res) => {
  try {
    const user_id = req.params.id;
    const entity_id = req.params.entity_id;
    const { expense_request_type } = req.query;

    const query = `
        WITH CTE AS (
            SELECT 
                tr.id AS id,
                tr.level AS level,
                tr.expense_approvel_status AS expense_approvel_status,
                tr.status AS status,
                tr.isDeleted AS isDeleted,
                tr.createdAt AS createdAt,
                tr.updatedAt AS updatedAt,
                tr.employee_id AS employee_id,
                tr.workflow_id AS workflow_id,
                tr.expense_request_id AS expense_request_id,
                td.current_date,
                tr.role_id AS role_id,
                tr.department_id AS department_id,
                fc.first_name AS first_name,
                fc.last_name AS last_name,
                td.entity_id AS entity_id,
                td.expense_request_type,
                td.expense_request_number AS expense_request_number,
                aggregated_data.travel_from_date AS travel_from_date,
                aggregated_data.travel_to_date AS travel_to_date,
                ROW_NUMBER() OVER (PARTITION BY td.expense_request_number ORDER BY tr.id) as row_num
            FROM 
                EXPENSE_APPROVEL_LEVEL AS tr
            LEFT JOIN 
                EXPENSE_REQUEST AS td ON tr.expense_request_id = td.id AND td.isDeleted = false
            LEFT JOIN 
                HRMS_REGISTERED_USER AS fc ON td.employee_id = fc.employee_id
            LEFT JOIN 
                MASTER_DEPARTMENT AS tc ON tc.dept_id = tr.department_id
            LEFT JOIN (
                SELECT 
                    travel_request_id,
                    MIN(travel_from_date) AS travel_from_date,
                    MAX(travel_to_date) AS travel_to_date
                FROM 
                    ESS_TRAVEL_REQUEST_DATA
                WHERE 
                    isDeleted = false
                GROUP BY 
                    travel_request_id
            ) AS aggregated_data ON td.travel_request_id = aggregated_data.travel_request_id
            LEFT JOIN 
                EXPENSE_REQUEST_DATA AS tds ON tr.expense_request_id = tds.expense_request_id AND tds.isDeleted = false    
            WHERE 
                tr.employee_id = ${user_id}
                AND td.entity_id = ${entity_id}
                AND td.expense_request_type = '${expense_request_type}'
                AND tr.status = 'ACTIVE'
                AND tr.expense_approvel_status = 'APPROVED'
                AND td.expense_request_type IN ('Indirect_Expense', 'Other_Expense', 'Reimbursement_Expense')
        )
        SELECT * FROM CTE
        WHERE row_num = 1
        ORDER BY createdAt DESC
        `;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message:
          "Fetched All Approved Indirect and Other Expense Approvals Successfully!",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message:
          "No Approved Indirect or Other Expense Approvals Found for This Employee!",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/** Expense Approval Levels */
exports.expenseApprovelLevels = async (req, res) => {
  try {
    const expense_id = req.params.expense_id;
    const { approvel_status, employee_id, remarks } = req.body;

    // Fetch all approval levels for the given expense and employee
    const allLevelsData = await db.expense_approval.findAll({
      where: { employee_id, expense_request_id: expense_id },
      order: [["level", "ASC"]],
    });

    if (!allLevelsData || allLevelsData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Level has been Assigned to this Employee!",
      });
    }

    // Fetch current level for the employee and expense request
    const currentLevelData = await db.expense_approval.findOne({
      attributes: ["level"],
      where: { employee_id, expense_request_id: expense_id },
    });

    const currentLevelValue = currentLevelData?.level;

    if (!currentLevelValue) {
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }

    // Handling rejection of the expense
    if (approvel_status === "REJECTED") {
      // Reject the expense request
      await db.expense_request.update(
        { expense_final_status: "REJECTED" },
        { where: { id: expense_id } }
      );

      const approvalUpdated = await db.expense_approval.update(
        {
          expense_approval_remarks: remarks,
          expense_approvel_status: "REJECTED",
        },
        { where: { employee_id, expense_request_id: expense_id } }
      );

      if (approvalUpdated[0] === 0) {
        return res.status(500).send({
          code: 500,
          message: "Failed to update approval status.",
        });
      }

      return res.status(200).send({
        code: 200,
        message: "Expense Request Rejected Successfully!",
      });
    }

    // Handling approval of the expense
    if (approvel_status === "APPROVED") {
      const maxLevel = await db.expense_approval.max("level", {
        where: { expense_request_id: expense_id },
      });

      // If it's the last level, mark the expense as approved
      if (currentLevelValue === maxLevel) {
        await db.expense_request.update(
          { expense_final_status: "APPROVED" },
          { where: { id: expense_id } }
        );
      }

      // Update the approval status for the current level
      const approvalUpdated = await db.expense_approval.update(
        {
          expense_approval_remarks: remarks,
          expense_approvel_status: approvel_status,
        },
        { where: { employee_id, expense_request_id: expense_id } }
      );

      if (approvalUpdated[0] === 0) {
        return res.status(500).send({
          code: 500,
          message: "Failed to update approval status.",
        });
      }

      // If not the last level, move to the next level
      if (currentLevelValue !== maxLevel) {
        const nextLevel = currentLevelValue + 1;

        const nextLevelEmp = await db.expense_approval.findOne({
          attributes: ["employee_id"],
          where: {
            level: nextLevel,
            expense_request_id: expense_id,
          },
        });

        if (nextLevelEmp?.employee_id) {
          const employeeInfo = await db.user.findOne({
            where: { employee_id: nextLevelEmp.employee_id },
            attributes: ["employee_official_email", "first_name", "last_name"],
          });

          if (employeeInfo) {
            // Send notification to the next approver
            await sendDynamicMail(
              employeeInfo.employee_official_email,
              employeeInfo.first_name,
              employeeInfo.last_name
            );
          }
        }
      }

      return res
        .status(200)
        .send({ code: 200, message: "Expense Request Updated Successfully!" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

/** get approver level */
exports.allExpenseApprovalLevel = async (req, res) => {
  try {
    const expense_id = req.params.expense_id;
    const { department_id, employeeId, expense_request_type } = req.body;

    // Query to get all approval levels for the given expense
    let getData = await db.expense_approval.findAll({
      where: {
        expense_request_id: expense_id,
      },
      attributes: [
        "expense_approvel_status",
        "level",
        "employee_id",
        "department_id",
        "expense_approval_remarks",
      ],
    });

    if (!getData || getData.length === 0) {
      return res.status(400).send({ code: 400, message: "Data not found" });
    }

    // Filter by department_id and employeeId if provided
    if (department_id && employeeId) {
      getData.employee_id = employeeId;
      getData.department_id = department_id;
    }

    // Optional: filter for Indirect or Other Expenses if expense_request_type is provided
    if (expense_request_type) {
      getData = getData.filter(
        (item) => item.expense_request_type === expense_request_type
      );
    }

    const levelsWithNames = [];
    for (const levelInfo of getData) {
      // Fetch user info for each level
      const employeeInfo = await db.user.findOne({
        where: {
          employee_id: levelInfo.employee_id,
        },
        attributes: ["first_name", "last_name"],
      });

      if (!employeeInfo) {
        return res.status(400).send({
          code: 400,
          message: "User not found for level " + levelInfo.level,
        });
      }

      const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
      const levelWithName = {
        level: levelInfo.level,
        name: fullName,
        status: levelInfo.expense_approvel_status,
        remark: levelInfo.expense_approval_remarks,
      };
      levelsWithNames.push(levelWithName);
    }

    // Sort by approval level
    levelsWithNames.sort((a, b) => a.level - b.level);

    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully!",
      data: levelsWithNames,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_by_otherExpense = async (req, res) => {
  try {
    const expense_request_id = req.params.id;
    let { expense_request_type } = req.query;

    if (!expense_request_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing expense_request_id",
      });
    }
    let results;
    if (expense_request_type !== "Reimbursement_Expense") {
      expense_request_type = "Other_Expense";
    }

    results = await db.expense_request.findAll({
      where: {
        id: expense_request_id,
        expense_request_type: expense_request_type,
      },
      include: [
        {
          model: db.expense_request_data,
        },
      ],
    });
    if (results.length > 0) {
      return res.status(200).send({
        code: 200,
        message: `Other expense request fetched successfully`,
        data: results[0], // ✅ SIRF ek object bhej rahe hain
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Expense Request not found",
      });
    }
  } catch (error) {
    console.error("get_by_otherExpense error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.get_all_otherExpense = async (req, res) => {
  try {
    const { employee_id, entity_id } = req.params;
    const { expense_request_type } = req.query;

    if (!employee_id || !entity_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing employee_id or entity_id in route params!",
      });
    }

    // Query for both 'Indirect_Expense' and 'Other_Expense'
    const expenseLevelQuery = `
            SELECT 
                TR.id,
                TR.level,
                TR.expense_request_id,
                TR.expense_approvel_status,
                TD.expense_request_type,
                TR.status,
                TR.employee_id,
                TR.workflow_id,
                TR.role_id,
                TR.department_id,
                TD.entity_id AS entity_id,
                TD.expense_request_number,
                TD.current_date,
                TR.isDeleted,
                TR.createdAt,
                TR.updatedAt,
                FC.first_name,
                FC.last_name
            FROM 
                EXPENSE_APPROVEL_LEVEL AS TR
            LEFT JOIN 
                EXPENSE_REQUEST AS TD 
                ON TR.expense_request_id = TD.id AND TD.expense_final_status = 'PENDING' AND TD.isDeleted = false
            LEFT JOIN 
                HRMS_REGISTERED_USER AS FC 
                ON TD.employee_id = FC.employee_id
            LEFT JOIN 
                MASTER_DEPARTMENT AS TC 
                ON TC.dept_id = TR.department_id
            WHERE 
                TR.employee_id = :employee_id 
                AND TD.entity_id = :entity_id
                AND TR.status = 'ACTIVE'
                AND TD.expense_request_type = :expense_request_type
                AND TR.expense_approvel_status = 'PENDING'
                AND NOT EXISTS (
                    SELECT 1
                    FROM EXPENSE_APPROVEL_LEVEL AS prev
                    WHERE prev.expense_request_id = TR.expense_request_id 
                    AND prev.level < TR.level
                    AND prev.expense_approvel_status != 'APPROVED'
                );
        `;

    // Fetching both types of expense data
    const results = await db.sequelize.query(expenseLevelQuery, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: {
        employee_id,
        entity_id,
        expense_request_type,
      },
    });

    if (results.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No expenses found!",
        data: [],
      });
    }

    // Sending data back to frontend
    return res.status(200).send({
      code: 200,
      message: "Expense data fetched successfully!",
      data: results, // This will include both 'Indirect_Expense' and 'Other_Expense'
    });
  } catch (error) {
    console.error("Error in getExpLevelsToBeApproved:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.myotherExpense_All = async (req, res) => {
  try {
    const { employee_id, entity_id, financial_year_id, role } = req.body;

    // if (!employee_id || !entity_id) {
    //     return res.status(400).send({
    //         code: 400,
    //         message: "Missing employee_id or entity_id in route params!"
    //     });
    // }

    const expensedata = await db.expense_request_data.findAll({
      where: {
        isDeleted: false,
      },
    });

    if (expensedata) {
      return res.status(200).send({
        code: 200,
        message: "Fetched Expense Data Successfully",
        data: expensedata,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Record Not Found",
      });
    }
  } catch (error) {
    console.error("get_all_otherExpense error:", error);
    return res.status(500).send({
      code: 500,
      message: error?.message || "Server Error",
    });
  }
};

exports.getBudgetDataOfGrade = async (req, res) => {
  try {
    const { toCityId } = req.params;
    const {grade_id} = req.query;
    if (!grade_id) {
      return res.status(400).send({
        code: 400,
        message: "Grade is not assigned to the user!",
      });
    }
    const budgetData = await db.MASTER_TRAVEL_BUDGET_LIMIT.findAll({
      include: [
        {
          model: db.MASTER_TRAVEL_DOMESTIC_BUDGET,
          as: "domesticBudgetLimits",
          required: true, // 👉 forces INNER JOIN
          where: Sequelize.literal(
            `JSON_CONTAINS(travel_grade_ids, '[${grade_id}]')`
          ),
          include: [
            {
              model: db.states,
              as: "state",
              attributes: ["states_id", "states_name"],
            },
            {
              model: db.city,
              as: "city",
              attributes: ["city_id", "city_name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (budgetData.length > 0) {
      // at here i want to filter the budget data based on the toCityId but if the toCityId is not present then i want to return latest budget data
      if (toCityId) {
        const filteredData = budgetData.filter((budget) =>
          budget.domesticBudgetLimits.some(
            (limit) => limit.city?.city_id === parseInt(toCityId)
          )
        );

        // ✅ If filtered found, return it. Otherwise, fallback to full data.
        const finalData =
          filteredData.length > 0 ? filteredData[0] : budgetData[0];

        return res.status(200).send({
          code: 200,
          message:
            filteredData.length > 0
              ? "Fetched Budget Data Successfully"
              : "No city-specific match found, returning latest budget data",
          data: finalData,
          isCitySpecific: filteredData.length > 0 ? true : false,
        });
      }
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Budget Data Found",
      });
    }
  } catch (error) {
    console.error("getBudgetDataOfGrade error:", error);
    return res.status(500).send({
      code: 500,
      message: error?.message || "Server Error",
    });
  }
};
exports.getLocalConveyanceDataOfGrade = async (req, res) => {
  try {
    const { employee_id } = req.query;
    const usrData = await db.user.findByPk(employee_id, {
      attributes: ["grade_id", "role_master_id"],
    });
    const grade_id = usrData.grade_id;
    if (!grade_id) {
      return res.status(400).send({
        code: 400,
        message: "Grade is not assigned to the user!",
      });
    }
    const budgetData = await db.MASTER_TRAVEL_BUDGET_LIMIT.findAll({
      include: [
        {
          model: db.TravelType,
          where: {
            type: "travel",
            name: "Local",
          },
          as: "travelType",
          required: true,
          attributes: ["name", "type"],
        },
        {
          model: db.MASTER_TRAVEL_LOCAL_BUDGET,
          as: "localBudgetLimits",
          required: true,
          where: Sequelize.literal(`JSON_CONTAINS(gradeIds, '[${grade_id}]')`),
          include: [
            {
              model: db.TravelType,
              required: true,
              as: "conveyanceType",
              attributes: ["name", "type"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (budgetData.length > 0) {
      return res.status(200).send({
        code: 200,
        message:
          budgetData.length > 0
            ? "Fetched Budget Data Successfully"
            : "No city-specific match found, returning latest budget data",
        data: budgetData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Budget Data Found",
      });
    }
  } catch (error) {
    console.error("getBudgetDataOfGrade error:", error);
    return res.status(500).send({
      code: 500,
      message: error?.message || "Server Error",
    });
  }
};

exports.getReimbursementDataOfGrade = async (req, res) => {
  try {
    const { employee_id } = req.query;
    const usrData = await db.user.findByPk(employee_id, {
      attributes: ["grade_id", "role_master_id"],
    });
    const grade_id = usrData.grade_id;
    if (!grade_id) {
      return res.status(400).send({
        code: 400,
        message: "Grade is not assigned to the user!",
      });
    }
    const budgetData = await db.MASTER_TRAVEL_BUDGET_LIMIT.findAll({
      include: [
        {
          model: db.TravelType,
          where: {
            type: "reimbursement",
          },
          as: "travelType",
          required: true,
          attributes: ["name", "type"],
        },
        {
          model: db.MASTER_REIMBURSEMENT_BUDGET,
          as: "reimbursementsBudgets",
          required: true,
          where: Sequelize.literal(`JSON_CONTAINS(gradeIds, '[${grade_id}]')`),
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "remark",
        "createdAt",
        "updatedAt",
        "status",
        "travel_type_id",
      ],
    });
    if (budgetData.length > 0) {
      return res.status(200).send({
        code: 200,
        message:
          budgetData.length > 0
            ? "Fetched Budget Data Successfully"
            : "No city-specific match found, returning latest budget data",
        data: budgetData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Budget Data Found",
      });
    }
  } catch (error) {
    console.error("getBudgetDataOfGrade error:", error);
    return res.status(500).send({
      code: 500,
      message: error?.message || "Server Error",
    });
  }
};

exports.getTravelRequestOfEmp = async (req, res) => {
  try {
    const { entity_Id, financial_year_id,employee_id } = req.query;
    console.log(employee_id);

    const data = await db.travel_request.findAll({
      where: {
        entity_Id,
        financial_year_id,
        user_id:employee_id,
      },
      attributes: [
        "id",
        "travel_request_status",
        "current_date",
        "travel_request_number",
      ],
      include: [
        {
          model: db.travel_request_data,
          attributes: ["id", "travel_from_date", "travel_to_date"],
        },
      ],
    });

    return res.status(200).send({
      code: 404,
      message: "Fetched Data Successfully",
      data: data,
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).send({
      code: 500,
      message: error?.message || "Server Error",
    });
  }
};

// exports.getTravelJourneyByDate = async (req, res) => {
//   try {
//     let { entity_Id, financial_year_id, type, dataId } = req.query;

//     entity_Id = parseInt(entity_Id);
//     financial_year_id = parseInt(financial_year_id);
//     let travel_request = null;

//     switch (type) {
//       case "date":
//         const startOfDay = moment(dataId).startOf("day").toDate();
//         const endOfDay = moment(dataId).endOf("day").toDate();

//         const travel = await db.travel_request_data.findOne({
//           where: {
//             travel_from_date: { [Op.lte]: endOfDay },
//             travel_to_date: { [Op.gte]: startOfDay },
//             isDeleted: false,
//           },
//           include: [
//             {
//               required: true,
//               model: db.travel_request,
//               where: {
//                 entity_Id,
//                 financial_year_id,
//                 user_id: req.user.employee_id,
//               },
//             },
//           ],
//           attributes: ["travel_request_id"],
//         });
//         if (travel && travel.travel_request_id) {
//           travel_request = travel.travel_request_id;
//         } else {
//           return res.status(404).send({
//             code: 404,
//             message: "Invalid Travel request Id",
//             data: [],
//           });
//         }

//         travel_request = travel?.travel_request_id;
//         break;
//       case "expense":
//         const expense = await db.expense_request.findOne({
//           where: {
//             id: parseInt(dataId),
//             isDeleted: false,
//           },
//           attributes: ["travel_request_id"],
//         });
//         if (expense) {
//           travel_request = expense.travel_request_id;
//         } else {
//           return res.status(404).send({
//             code: 404,
//             message: "Invalid Expense Id",
//             data: [],
//           });
//         }
//         break;
//       case "ess":
//         travel_request = parseInt(dataId);
//         break;
//       default:
//         return res.status(404).send({
//           code: 404,
//           message: "Invalid type",
//           data: [],
//         });
//     }

//     if (!travel_request) {
//       return res.status(404).send({
//         code: 404,
//         message: "No Travel Request Found for the Given Date",
//         data: [],
//       });
//     }

//     let data = await db.travel_request.findOne({
//       where: {
//         id: travel_request,
//         entity_Id,
//         financial_year_id,
//         user_id: req.user.employee_id,
//       },
//       attributes: ["id", "current_date", "travel_request_number"],
//       include: [
//         {
//           model: db.travel_request_data,
//           required: true,
//           include: [
//             { model: db.expense_request_data },
//             {
//               model: db.travel_journey_bifurcation,
//               as: "journeyBifurcation",
//               attributes: ["from_date"],
//               required: false,
//               include: [
//                 {
//                   model: db.city,
//                   as: "journeyFromCity",
//                   attributes: ["city_name"],
//                 },
//                 {
//                   model: db.city,
//                   as: "journeyToCity",
//                   attributes: ["city_name"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!data) {
//       return res.status(404).send({
//         code: 404,
//         message: "No Travel Request Found",
//         data: [],
//       });
//     }

//     let result = data.get({ plain: true });

//     return res.status(200).send({
//       code: 200,
//       message: "Fetched Data Successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("error:", error);
//     return res.status(500).send({
//       code: 500,
//       message: error?.message || "Server Error",
//     });
//   }
// };


exports.getTravelJourneyByDate = async (req, res) => {
  try {
    let { entity_Id, financial_year_id, type, dataId, employee_id } = req.query;

    // convert to integers
    entity_Id = parseInt(entity_Id);
    financial_year_id = parseInt(financial_year_id);
    employee_id = parseInt(employee_id); // frontend se bhejna hoga
    let travel_request = null;

    switch (type) {
      case "date":
        const startOfDay = moment(dataId).startOf("day").toDate();
        const endOfDay = moment(dataId).endOf("day").toDate();

        const travel = await db.travel_request_data.findOne({
          where: {
            travel_from_date: { [Op.lte]: endOfDay },
            travel_to_date: { [Op.gte]: startOfDay },
            isDeleted: false,
          },
          include: [
            {
              required: true,
              model: db.travel_request,
              where: {
                entity_Id,
                financial_year_id,
                user_id: employee_id, // ab query param se le raha hai
              },
            },
          ],
          attributes: ["travel_request_id"],
        });

        if (travel && travel.travel_request_id) {
          travel_request = travel.travel_request_id;
        } else {
          return res.status(404).send({
            code: 404,
            message: "Invalid Travel request Id",
            data: [],
          });
        }
        break;

      case "expense":
        const expense = await db.expense_request.findOne({
          where: {
            id: parseInt(dataId),
            isDeleted: false,
          },
          attributes: ["travel_request_id"],
        });

        if (expense) {
          travel_request = expense.travel_request_id;
        } else {
          return res.status(404).send({
            code: 404,
            message: "Invalid Expense Id",
            data: [],
          });
        }
        break;

      case "ess":
        travel_request = parseInt(dataId);
        break;

      default:
        return res.status(404).send({
          code: 404,
          message: "Invalid type",
          data: [],
        });
    }

    if (!travel_request) {
      return res.status(404).send({
        code: 404,
        message: "No Travel Request Found for the Given Date",
        data: [],
      });
    }

    let data = await db.travel_request.findOne({
      where: {
        id: travel_request,
        entity_Id,
        financial_year_id,
        user_id: employee_id, // ab query param se le raha hai
      },
      attributes: ["id", "current_date", "travel_request_number"],
      include: [
         {
          model: db.user,
          attributes: ["employee_id","grade_id"],
          required: false,
        },
        {
          model: db.travel_request_data,
          required: true,
          include: [
            { model: db.expense_request_data },
            {
              model: db.travel_journey_bifurcation,
              as: "journeyBifurcation",
              attributes: ["from_date"],
              required: false,
              include: [
                { model: db.city, as: "journeyFromCity", attributes: ["city_name"] },
                { model: db.city, as: "journeyToCity", attributes: ["city_name"] },
              ],
            },
          ],
        },
      ],
    });

    if (!data) {
      return res.status(404).send({
        code: 404,
        message: "No Travel Request Found",
        data: [],
      });
    }

    let result = data.get({ plain: true });

    return res.status(200).send({
      code: 200,
      message: "Fetched Data Successfully",
      data: result,
    });

  } catch (error) {
    console.error("error:", error);
    return res.status(500).send({
      code: 500,
      message: error?.message || "Server Error",
    });
  }
};
