const db = require("../../../models/index");

exports.getAllLeaveQuotaById = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const data = await db.sequelize.query(
      `
      SELECT ULA.no_of_days,
      ULA.available_days,
      ULA.leave_id,
      ULA.employee_id,
      LM.leave_name,
      LM.leave_code,
      RU.employee_code,CONCAT(RU.first_name, ' ', RU.last_name) AS employee_name
      FROM HRMS_USER_LEAVE_ALLOTMENT ULA
      INNER JOIN HRMS_REGISTERED_USER RU 
        ON ULA.employee_id = RU.employee_id
      LEFT JOIN HRMS_LEAVE_MASTER LM 
        ON ULA.leave_id = LM.id
      WHERE ULA.status = 'ACTIVE'
        AND ULA.isDeleted = 0
        AND ULA.employee_id = :employee_id
      `,
      {
        replacements: { employee_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (data.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched successfully!", data });
    } else {
      return res.status(404).send({ code: 404, message: "No data found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getLeaveListByEntityId = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const data = await db.sequelize.query(
      `
      SELECT * FROM HRMS_LEAVE_MASTER
      WHERE status = 'ACTIVE'
        AND isDeleted = 0
        AND entity_id = :entity_id
      `,
      {
        replacements: { entity_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (data.length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched successfully!", data });
    } else {
      return res.status(404).send({ code: 404, message: "No data found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.updateLeaveQuotaById = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { employee_id } = req.query;

    const leaveData = req.body.leaveData; // expect array of leaves

    // Validation

    if (!employee_id) {
      return res
        .status(400)
        .send({ code: 400, message: "employee_id is required" });
    }

    if (!leaveData || !Array.isArray(leaveData) || leaveData.length === 0) {
      return res
        .status(400)
        .send({ code: 400, message: "leaveData is required" });
    }

    // Delete existing leave allotments for the employee

    await db.hrmsLeaveAllotment.destroy({
      where: { employee_id },

      transaction: t,
    });

    // Insert all valid leave rows

    for (const leave of leaveData) {
      if (!leave.leave_id || leave.no_of_days == null) {
        // Skip rows without required fields

        continue;
      }

      await db.hrmsLeaveAllotment.create(
        {
          employee_id,

          leave_id: leave.leave_id,

          no_of_days: leave.no_of_days,

          available_days: leave.available_days || 0,

          status: "ACTIVE",

          isDeleted: 0,

          createdAt: new Date(),

          updatedAt: new Date(),
        },

        { transaction: t }
      );
    }

    await t.commit();

    return res.status(200).send({
      code: 200,

      message: "Leave quota updated successfully!",
    });
  } catch (error) {
    await t.rollback();

    console.error("Error updating leave quota:", error);

    return res.status(500).send({
      code: 500,

      message: error.message || "Internal server error!",
    });
  }
};

// exports.getAllLeaveQuotaByMobile = async (req, res) => {
//   try {
//     const { mobile } = req.params;

//     // Normalize the number (remove +91, spaces, etc.)
//     const cleanNumber = mobile.replace("+91", "").replace(/\s+/g, "");

//     // Step 1: Find employee by phone number
//     const employee = await db.sequelize.query(
//       `
//       SELECT employee_id, first_name, last_name, employee_code
//       FROM HRMS_REGISTERED_USER
//       WHERE contact_number LIKE :cleanNumber
//         AND status = 'ACTIVE'
//       LIMIT 1
//       `,
//       {
//         replacements: { cleanNumber: `%${cleanNumber}` },
//         type: db.Sequelize.QueryTypes.SELECT,
//       }
//     );

//     if (employee.length === 0)
//       return res
//         .status(404)
//         .json({ code: 404, message: "Employee not found!" });

//     const employee_id = employee[0].employee_id;

//     // Step 2: Fetch leave quotas using your existing query
//     const data = await db.sequelize.query(
//       `
//       SELECT 
//         ULA.no_of_days,
//         ULA.available_days,
//         ULA.leave_id,
//         ULA.employee_id,
//         LM.leave_name,
//         LM.leave_code
//       FROM HRMS_USER_LEAVE_ALLOTMENT ULA
//       LEFT JOIN HRMS_LEAVE_MASTER LM 
//         ON ULA.leave_id = LM.id
//       WHERE ULA.status = 'ACTIVE'
//         AND ULA.isDeleted = 0
//         AND ULA.employee_id = :employee_id
//       `,
//       {
//         replacements: { employee_id },
//         type: db.Sequelize.QueryTypes.SELECT,
//       }
//     );

//     if (data.length === 0)
//       return res
//         .status(404)
//         .json({ code: 404, message: "No leave data found!" });

//     // Step 3: Return simplified JSON for WhatsApp
//     res.status(200).json({
//       code: 200,
//       message: "Leave data fetched successfully!",
//       employee_id,
//       employee_name: `${employee[0].first_name} ${employee[0].last_name}`,
//       data: data.map((item) => ({
//         name: item.leave_name,
//         code: item.leave_code,
//         available: item.available_days,
//       })),
//     });
//   } catch (error) {
//     console.error("❌ Error fetching leave quota by mobile:", error);
//     res
//       .status(500)
//       .json({ code: 500, message: error.message || "Internal server error!" });
//   }
// };

