const db = require("../../../models/index");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");


exports.createAttendance = async (req, res) => {
  try {
    const {
      employee_id,
      selected_date,
      attendance_data,
      attendance_month,
      entity_id,
    } = req.body;

    if (!employee_id || !selected_date) {
      return res.status(400).json({
        code: 400,
        message: "employee_id and selected_date are required",
      });
    }
    const record = await db.attendance_request.create({
      selected_date: selected_date,
      employee_id,
      entity_id,
      attendance_month,
      attendance_data,
    });

    return res.status(200).json({
      code: 200,
      message: "Attendance request stored successfully!",
      data: record,
    });
  } catch (error) {
    console.error("create Attendance request error:", error);
    return res.status(500).json({
      code: 500,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllAttendanceById = async (req, res) => {
  try {
    const id = req.params.id;
    const records = await db.attendance_request.findAll({
      where: { employee_id: id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.user,
          as: "employee",
          attributes: ["first_name", "last_name"],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      message: "Data fetched successfully!",
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.get_attendance_request_by_manager = async (req, res) => {
  try {
    const { manager_id } = req.body;
    const employees = await db.user.findAll({
      where: {
        [Op.or]: [
          { reporting_manager_id: manager_id },
          { approval_manager_id: manager_id },
        ],
      },
      attributes: ["employee_id", "first_name", "last_name"],
    });
    const employeeIds = (employees || [])
      .map((e) => e.employee_id)
      .filter(Boolean);

    const attendanceAttrs = Object.keys(
      db.attendance_request.rawAttributes || {}
    );
    const approvalCandidates = ["reporting_manager_id", "approval_manager_id"];
    const orConditions = [];

    if (employeeIds.length) {
      orConditions.push({ employee_id: { [Op.in]: employeeIds } });
    }

    approvalCandidates.forEach((col) => {
      if (attendanceAttrs.includes(col)) {
        const cond = {};
        cond[col] = manager_id;
        orConditions.push(cond);
      }
    });
    if (orConditions.length === 0) {
      return res
        .status(200)
        .json({ code: 200, message: "Data fetched successfully", data: [] });
    }

    const whereClause = { [Op.or]: orConditions };

    const records = await db.attendance_request.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.user,
          as: "employee",
          attributes: ["employee_id", "first_name", "last_name"],
        },
        {
          model: db.entityMaster,
          attributes: ["id", "entity_name"],
        },
      ],
    });

    return res
      .status(200)
      .json({ code: 200, message: "Data fetched successfully", data: records });
  } catch (err) {
    return res
      .status(500)
      .json({
        code: 500,
        message: "Internal server error!",
        error: err.message,
      });
  }
};

// exports.updateAttendanceStatus = async (req, res) => {
//   try {
//     const { id, approval_status } = req.body;    

//         await db.attendance_request.update({ approval_status }, { where: { id } });

//     return res.json({ message: "Status updated successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error!" });
//   }
// };

exports.updateAttendanceStatus = async (req, res) => {
  try {
    const { id, approval_status } = req.body;

    if (!id || !approval_status) {
      return res.status(400).json({ message: "Missing id or approval_status" });
    }

    // Fetch request details
    const request = await db.attendance_request.findOne({ where: { id } });

    if (!request) {
      return res.status(404).json({ message: "Attendance request not found!" });
    }

    // Normalize casing — just in case caller sends lowercase
    const statusNormalized = approval_status.toUpperCase();

    // If approved → update daily attendance data
    if (statusNormalized === "APPROVED") {
      let attendanceData = request.attendance_data;

      // Handle both raw JSON and stringified JSON
      if (typeof attendanceData === "string") {
        try {
          attendanceData = JSON.parse(attendanceData);
        } catch (err) {
          return res.status(400).json({ message: "Invalid attendance_data JSON" });
        }
      }

      if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
        return res
          .status(400)
          .json({ message: "attendance_data must be a non-empty array" });
      }

      // Filter valid records
      const validRecords = attendanceData.filter(
        (r) => r.att_date && r.employee_id && r.entry_type
      );

      if (validRecords.length === 0) {
        return res.status(400).json({
          message: "No valid attendance records found in attendance_data",
        });
      }

      // Step 1: Delete existing attendance for same employee/date/entity
      const uniqueCombos = [
        ...new Set(
          validRecords.map((r) => `${r.employee_id}_${r.att_date}_${r.entity_id}`)
        ),
      ];

      await Promise.all(
        uniqueCombos.map(async (combo) => {
          const [employee_id, att_date, entity_id] = combo.split("_");
          await db.daily_attendance.destroy({
            where: { employee_id, att_date, entity_id },
          });
        })
      );

      // Step 2: Insert new attendance records
      const newRecords = await db.daily_attendance.bulkCreate(
        validRecords.map((record) => ({
          att_day: record.att_day,
          att_month: record.att_month,
          att_year: record.att_year,
          att_date: record.att_date,
          att_checktime: record.att_checktime,
          att_time: record.att_time,
          entry_type: record.entry_type,
          employee_id: record.employee_id,
          entity_id: record.entity_id,
          job_type: record.job_type || null,
          status: "Active",
          isDeleted: false,
          att_mode: record.att_mode || "MANUAL",
        }))
      );

      // Step 3: Calculate working hours
      const submittedCombos = [
        ...new Set(
          newRecords.map((r) => `${r.employee_id}_${r.att_date}_${r.entity_id}`)
        ),
      ];

      await Promise.all(
        submittedCombos.map(async (combo) => {
          const [employee_id, att_date, entity_id] = combo.split("_");
          const entries = await db.daily_attendance.findAll({
            where: { employee_id, att_date, entity_id, isDeleted: false, status: "Active" },
            attributes: ["att_checktime", "entry_type"],
            order: [["att_checktime", "ASC"]],
          });

          const fullEntries = entries
            .filter((e) => e.att_checktime)
            .map((e) => {
              const fullDateTime = DateTime.fromFormat(
                `${att_date} ${e.att_checktime.toString().trim()}`,
                "yyyy-MM-dd hh:mm:ss a"
              );
              return { entry_type: e.entry_type, datetime: fullDateTime };
            })
            .filter((e) => e.datetime.isValid)
            .sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());

          let totalMilliseconds = 0;
          const inStack = [];
          for (const entry of fullEntries) {
            if (entry.entry_type === "IN") inStack.push(entry.datetime);
            else if (entry.entry_type === "OUT" && inStack.length > 0) {
              const inTime = inStack.shift();
              const duration = entry.datetime.diff(inTime).milliseconds;
              if (duration > 0) totalMilliseconds += duration;
            }
          }

          const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
          const totalMinutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
          const formatted = `${totalHours} hour(s) ${totalMinutes} minute(s)`;

          await db.daily_attendance_master.update(
            { working_hours: formatted },
            { where: { employee_id, att_date, entity_id } }
          );
        })
      );
    }

    // Step 4: Update request status
    await db.attendance_request.update(
      { approval_status: statusNormalized },
      { where: { id } }
    );

    return res.status(200).json({
      message:
        statusNormalized === "APPROVED"
          ? "Attendance approved and updated successfully!"
          : "Attendance status updated successfully!",
    });
  } catch (err) {
    console.error("Error in updateAttendanceStatus:", err);
    return res.status(500).json({ message: err.message||"Internal server error!" });
  }
};