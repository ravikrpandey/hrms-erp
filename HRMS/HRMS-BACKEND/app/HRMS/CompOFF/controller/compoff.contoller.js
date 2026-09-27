const db = require("../../../models/index");
const { Op, QueryTypes } = require("sequelize");
const moment = require("moment");
// exports.saveCompOff = async (req, res) => {
//   const { employee_id, from_date, to_date, reason, entity_id, created_by } =
//     req.body;

//   try {
//     const overlappingEmployees = [];
//     for (const empId of employee_id) {
//       const existingEntries = await db.assign_comp_off_employee.findAll({
//         where: {
//           employee_id: empId,
//         },
//         include: [
//           {
//             model: db.assign_comp_off,
//             where: {
//               isDeleted: 0,
//               [Op.or]: [
//                 {
//                   from_date: {
//                     [Op.between]: [from_date, to_date],
//                   },
//                 },
//                 {
//                   to_date: {
//                     [Op.between]: [from_date, to_date],
//                   },
//                 },
//                 {
//                   from_date: {
//                     [Op.lte]: from_date,
//                   },
//                   to_date: {
//                     [Op.gte]: to_date,
//                   },
//                 },
//               ],
//             },
//           },
//         ],
//       });

//       if (existingEntries.length > 0) {
//         overlappingEmployees.push(empId);
//       }
//     }
//     if (overlappingEmployees.length > 0) {
//       return res.status(400).json({
//         error: `Comp-off work already assigned on selected date for selected employee!`,
//       });
//     }
//     const compOff = await db.assign_comp_off.create({
//       from_date,
//       to_date,
//       reason,
//       entity_id,
//       created_by,
//     });
//     const employeeInsertPromises = employee_id.map((empId) => {
//       return db.assign_comp_off_employee.create({
//         comp_id: compOff.id,
//         employee_id: empId,
//       });
//     });
//     await Promise.all(employeeInsertPromises);
//     res.status(201).json({
//       message: "Comp-off assigned successfully",
//       data: compOff,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Comp-off could not be created",
//     });
//   }
// };

exports.getListdataAssignCompOff = async (req, res) => {
  try {
    const { entity_id } = req.params;

    const results = await db.sequelize.query(
      `SELECT 
        c.*, 
        GROUP_CONCAT(e.employee_id) AS employee_ids,
        ru.employee_id AS created_by_employee_id,
        ru.first_name,
        ru.middle_name,
        ru.last_name,
        ru.employee_code
      FROM HRMS_ASSIGN_COMPOFF c
      LEFT JOIN HRMS_ASSIGN_COMPOFF_EMPLOYEE e 
        ON c.id = e.comp_id AND e.isDeleted = false
      LEFT JOIN HRMS_REGISTERED_USER ru 
        ON ru.employee_id = c.created_by
      WHERE c.entity_id = :entity_id AND c.isDeleted = false
      GROUP BY c.id
    `,
      {
        replacements: { entity_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const formattedResults = results.map((item) => ({
      ...item,
      employee_id: item.employee_ids
        ? item.employee_ids.split(",").map((id) => Number(id))
        : [],
    }));

    res.status(200).json({ data: formattedResults });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getSingleUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.sequelize.query(
      `SELECT 
        c.*, 
        GROUP_CONCAT(e.employee_id) AS employee_ids,
        ru.employee_id AS created_by_employee_id,
        ru.first_name,
        ru.middle_name,
        ru.last_name,
        ru.employee_code
      FROM HRMS_ASSIGN_COMPOFF c
      LEFT JOIN HRMS_ASSIGN_COMPOFF_EMPLOYEE e ON c.id = e.comp_id
      LEFT JOIN HRMS_REGISTERED_USER ru ON ru.employee_id = c.created_by
      WHERE c.id = :id
      GROUP BY c.id
    `,
      {
        replacements: { id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    const formattedResults = results.map((item) => ({
      ...item,
      employee_id: item.employee_ids
        ? item.employee_ids.split(",").map((id) => Number(id))
        : [],
    }));
    res.status(200).json({ data: formattedResults });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.deleteCompOff = async (req, res) => {
  try {
    const comp_id = req.params.id;
    const dltStage = await db.assign_comp_off.findOne({
      where: { id: comp_id },
    });
    if (dltStage) {
      const deletedEmployees = await db.assign_comp_off_employee.update(
        { isDeleted: true },
        { where: { comp_id: comp_id } }
      );
      const deletedCompOff = await db.assign_comp_off.update(
        { isDeleted: true },
        { where: { id: comp_id } }
      );
      return res.status(200).send({
        code: 200,
        message: "Data Deleted Successfully!",
        data: {
          comp_off: deletedCompOff,
          employees: deletedEmployees,
        },
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.error(" Delete Error:", error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.updateCompOffData = async (req, res) => {
  const { id } = req.params;
  const { employee_id, from_date, to_date, reason, entity_id, created_by } =
    req.body;
  try {
    const overlappingEmployees = [];

    for (const empId of employee_id) {
      const existingEntries = await db.assign_comp_off_employee.findAll({
        where: {
          employee_id: empId,
        },
        include: [
          {
            model: db.assign_comp_off,
            where: {
              id: { [Op.ne]: id },
              [Op.or]: [
                {
                  from_date: {
                    [Op.between]: [from_date, to_date],
                  },
                },
                {
                  to_date: {
                    [Op.between]: [from_date, to_date],
                  },
                },
                {
                  from_date: {
                    [Op.lte]: from_date,
                  },
                  to_date: {
                    [Op.gte]: to_date,
                  },
                },
              ],
            },
          },
        ],
      });
      if (existingEntries.length > 0) {
        overlappingEmployees.push(empId);
      }
    }
    if (overlappingEmployees.length > 0) {
      return res.status(400).json({
        error: `Comp-off work already assigned on selected date for selected employee!`,
      });
    }
    await db.assign_comp_off.update(
      {
        from_date,
        to_date,
        reason,
        entity_id,
        created_by,
      },
      {
        where: { id },
      }
    );
    await db.assign_comp_off_employee.destroy({ where: { comp_id: id } });
    const employeeInsertPromises = employee_id.map((empId) => {
      return db.assign_comp_off_employee.create({
        comp_id: id,
        employee_id: empId,
      });
    });
    await Promise.all(employeeInsertPromises);
    res.status(200).json({
      message: "Comp-off updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Comp-off could not be updated",
    });
  }
};

exports.getEmployeebasedOnEntity = async (req, res) => {
  const { primary_entity_id } = req.params;
  try {
    const results = await db.sequelize.query(
      "SELECT * FROM HRMS_REGISTERED_USER  WHERE primary_entity_id = ?",
      {
        replacements: [primary_entity_id],
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for this entity." });
    }
    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected error", error });
  }
};

exports.getDailyAttendancedataInOutCompOff = async (req, res) => {
  try {
    const { from_date, to_date, entity_id, employee_id } = req.query;
    if (!from_date || !to_date || !entity_id || !employee_id) {
      return res.status(400).send({
        code: 400,
        message: "Missing required query parameters.",
      });
    }
    const employeeIds = Array.isArray(employee_id)
      ? employee_id.map((id) => parseInt(id, 10))
      : [parseInt(employee_id, 10)];

    const attendanceData = await db.sequelize.query(
      `
      SELECT 
        md.department_name,
        hrs.department_id,
        hrs.employee_id,
        hrs.first_name,
        hrs.middle_name,
        hrs.last_name,
        hrs.employee_code,
        att_data.att_date,
        att_data.first_in_time,
        att_data.last_out_time,
        eds.working_hours,
        att_data.entity_id,
        att_data.job_type
      FROM HRMS_REGISTERED_USER AS hrs
      LEFT JOIN MASTER_DEPARTMENT AS md 
        ON hrs.department_id = md.dept_id
      LEFT JOIN (
        SELECT 
          employee_id,
          att_date,
          entity_id,
          job_type,
          MIN(CASE WHEN entry_type = 'IN' THEN STR_TO_DATE(att_checktime, '%r') END) AS first_in_time,
          MAX(CASE WHEN entry_type = 'OUT' THEN STR_TO_DATE(att_checktime, '%r') END) AS last_out_time
        FROM ESS_DAILY_ATTENDANCE
        WHERE att_date BETWEEN :from_date AND :to_date
          AND entity_id = :entity_id
          AND employee_id IN (:employeeIds)
        GROUP BY employee_id, att_date, entity_id, job_type
      ) AS att_data
        ON hrs.employee_id = att_data.employee_id
      LEFT JOIN ESS_DAILY_ATTENDANCE_MASTER AS eds
        ON eds.att_date = att_data.att_date AND eds.employee_id = att_data.employee_id
      WHERE hrs.employee_id IN (:employeeIds)
        AND (att_data.first_in_time IS NOT NULL OR att_data.last_out_time IS NOT NULL)
      ORDER BY hrs.employee_id, att_data.att_date;
      `,
      {
        replacements: {
          from_date,
          to_date,
          entity_id,
          employeeIds,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).send({
      code: 200,
      message:
        attendanceData.length === 0
          ? "No attendance records found!"
          : "Attendance data fetched successfully.",
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error fetching daily attendance:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getOnlyCreatedUserData = async (req, res) => {
  try {
    const { entity_id, employee_id } = req.params;

    const query = `
      SELECT 
        hsc.*,                                
        he.employee_id AS assigned_employee_id,
        hru.employee_id AS creator_id,
        hru.first_name AS creator_first_name,
        hru.middle_name AS creator_middle_name,
        hru.last_name AS creator_last_name,
        hru.employee_code AS creator_employee_code
      FROM HRMS_ASSIGN_COMPOFF AS hsc
      JOIN HRMS_ASSIGN_COMPOFF_EMPLOYEE AS he
        ON he.comp_id = hsc.id
      JOIN HRMS_REGISTERED_USER AS hru
        ON hsc.created_by = hru.employee_id
      WHERE hsc.entity_id = :entity_id 
        AND he.employee_id = :employee_id
    `;

    const results = await db.sequelize.query(query, {
      replacements: { entity_id, employee_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching created user data:", error);
    return res.status(500).send({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.saveCompOff = async (req, res) => {
  const { employee_id, from_date, to_date, reason, entity_id, created_by } =
    req.body;

  try {
    const overlappingEmployees = [];

    for (const empId of employee_id) {
      const existingEntries = await db.assign_comp_off_employee.findAll({
        where: { employee_id: empId },
        include: [
          {
            model: db.assign_comp_off,
            where: {
              isDeleted: 0,
              [Op.or]: [
                { from_date: { [Op.between]: [from_date, to_date] } },
                { to_date: { [Op.between]: [from_date, to_date] } },
                {
                  from_date: { [Op.lte]: from_date },
                  to_date: { [Op.gte]: to_date },
                },
              ],
            },
          },
        ],
      });

      if (existingEntries.length > 0) {
        overlappingEmployees.push(empId);
      }
    }

    if (overlappingEmployees.length > 0) {
      return res.status(400).json({
        error: `Comp-off work already assigned on selected date for selected employee!`,
      });
    }
    const compOff = await db.assign_comp_off.create({
      from_date,
      to_date,
      reason,
      entity_id,
      created_by,
    });

    const employeeInsertPromises = employee_id.map((empId) =>
      db.assign_comp_off_employee.create({
        comp_id: compOff.id,
        employee_id: empId,
      })
    );
    await Promise.all(employeeInsertPromises);
    try {
      const users = await getUserDetailsByEmployeeId(employee_id);
      const createdByUser = await db.user.findOne({
        where: { employee_id: created_by },
        attributes: ["first_name", "middle_name", "last_name"],
      });

      await sendNotificationsToEmployees(compOff, users, createdByUser);
    } catch (notifyErr) {
      console.error("Notification sending failed:", notifyErr);
    }

    res.status(201).json({
      message: "Comp-off assigned successfully",
      data: compOff,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Comp-off could not be created",
    });
  }
};

async function getUserDetailsByEmployeeId(employeeIds) {
  try {
    const users = await db.user.findAll({
      where: {
        employee_id: {
          [Op.in]: employeeIds,
        },
      },
      attributes: ["employee_id", "primary_entity_id"],
    });
    return users;
  } catch (error) {
    throw new Error("Failed to fetch employee details for notifications.");
  }
}

async function sendNotificationsToEmployees(compOff, users, createdByUser) {
  try {
    const createdByName = [
      createdByUser.first_name,
      createdByUser.middle_name,
      createdByUser.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    const notifications = users.map((user) => ({
      employee_id: user.employee_id,
      entity_id: user.primary_entity_id || 1,
      notification_type: "COMPOFF_EMPLOYEE",
      message: `Comp-work request from ${compOff.from_date} to ${compOff.to_date} requested by ${createdByName}!`,
    }));
    console.log("Sending notifications:", notifications);
    if (notifications.length === 0) {
      console.warn("No notifications to send.");
      return;
    }
    const result = await db.hrms_notification.bulkCreate(notifications);
    console.log("Notification insert result:", result);
  } catch (error) {
    console.error("Notification error:", error);
    throw new Error("Notifications could not be sent.");
  }
}
