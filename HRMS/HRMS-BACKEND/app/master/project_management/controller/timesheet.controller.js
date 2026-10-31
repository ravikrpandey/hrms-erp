const db = require("../../../models");
const TimesheetLog = db.timesheetLog;
const TimesheetSubmission = db.timesheetSubmission;
const TimesheetActivity = db.timesheetActivity;
const Project = db.project;
const Task = db.task;
const { Op } = require("sequelize");
const projectAuth = require("../middleware/projectAuth");
const projectCostService = require("../services/projectCostService");

const parseHoursFromRange = (start_time, end_time) => {
  if (!start_time || !end_time) return 0;
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map((v) => parseInt(v, 10));
    return (h || 0) * 60 + (m || 0);
  };
  const diff = toMinutes(end_time) - toMinutes(start_time);
  if (diff <= 0) return 0;
  return Math.round((diff / 60) * 100) / 100;
};

const recordActivity = async ({
  submission_id = null,
  log_id = null,
  project_id = null,
  actor,
  activity_type,
  message,
  old_value = null,
  new_value = null,
}) => {
  try {
    if (!TimesheetActivity) return null;
    return await TimesheetActivity.create({
      submission_id,
      log_id,
      project_id,
      actor_id: actor ? actor.employee_id : 0,
      actor_name: actor ? `${actor.first_name || ""} ${actor.last_name || ""}`.trim() : "System",
      actor_role: actor ? actor.role_master_name || "Member" : "System",
      activity_type,
      message,
      old_value: old_value ? String(old_value) : null,
      new_value: new_value ? String(new_value) : null,
    });
  } catch (err) {
    console.error("Error recording timesheet activity:", err);
    return null;
  }
};

const getManagedProjectIds = async (user) => {
  if (!user) return [];
  if (projectAuth.isProjectAdmin(user)) return null;
  const [rows] = await db.sequelize.query(
    `SELECT DISTINCT project_id FROM PROJECTS WHERE is_deleted = 0 AND (project_manager_id = :empId OR supervisor_id = :empId OR created_by = :empId)`,
    { replacements: { empId: user.employee_id } }
  );
  return rows.map((r) => r.project_id);
};

const syncTaskLoggedHours = async (taskId) => {
  if (!taskId) return;
  try {
    const [res] = await db.sequelize.query(
      "SELECT COALESCE(SUM(total_hours), 0) AS total FROM TIMESHEET_LOGS WHERE task_id = :taskId AND is_deleted = 0",
      { replacements: { taskId } }
    );
    const total = parseFloat(res[0]?.total || 0);
    await db.sequelize.query(
      "UPDATE PROJECT_TASKS SET logged_hours = :total WHERE task_id = :taskId",
      { replacements: { total, taskId } }
    );
  } catch (e) {
    console.error("Error syncing task logged hours:", e);
  }
};

exports.createLog = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const {
      employee_id,
      employee_name,
      project_id,
      project_name,
      task_id,
      task_name,
      work_item,
      log_date,
      work_mode,
      description,
      hours_mode,
      start_time,
      end_time,
      total_hours,
      attachment_path,
      is_billable,
    } = req.body;

    if (!project_id) {
      return res.status(400).send({ success: false, message: "Project Name is required" });
    }
    if (!task_id) {
      return res.status(400).send({ success: false, message: "Task is required" });
    }
    if (!log_date) {
      return res.status(400).send({ success: false, message: "Date is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).send({ success: false, message: "Description is required" });
    }
    if (description.length > 15000) {
      return res.status(400).send({ success: false, message: "Description cannot exceed 15000 characters" });
    }

    const isAdmin = projectAuth.isProjectAdmin(authUser);
    const userProjectRole = await projectAuth.getProjectRole(project_id, authUser);

    if (!isAdmin && userProjectRole === "unassigned") {
      return res.status(403).send({
        success: false,
        message: "Forbidden: You are not assigned to this project",
      });
    }

    const targetEmpId = employee_id ? parseInt(employee_id, 10) : authUser.employee_id;
    if (targetEmpId !== authUser.employee_id) {
      if (!isAdmin && userProjectRole !== "head") {
        return res.status(403).send({
          success: false,
          message: "Forbidden: You cannot log time for other team members",
        });
      }
      const targetRole = await projectAuth.getProjectRole(project_id, {
        employee_id: targetEmpId,
        role_master_id: 0,
      });
      if (targetRole === "unassigned") {
        return res.status(400).send({
          success: false,
          message: "Target employee is not assigned to this project",
        });
      }
    }

    const task = await Task.findOne({
      where: { task_id, is_deleted: false },
    });
    if (!task) {
      return res.status(404).send({ success: false, message: "Task not found" });
    }
    if (task.project_id != project_id) {
      return res.status(400).send({
        success: false,
        message: "Task does not belong to the selected project",
      });
    }

    const mode = hours_mode || "Total Hours";
    let computedHours = 0;
    if (mode === "Start-End Time") {
      computedHours = parseHoursFromRange(start_time, end_time);
    } else {
      computedHours = parseFloat(total_hours) || 0;
    }

    const validModes = ["Office", "WFH", "Client Site", "Day Off"];
    const selectedWorkMode = validModes.includes(work_mode) ? work_mode : "Office";

    if (selectedWorkMode === "Day Off") {
      if (computedHours < 0) {
        return res.status(400).send({
          success: false,
          message: "Duration cannot be negative",
        });
      }
    } else {
      if (computedHours <= 0) {
        return res.status(400).send({
          success: false,
          message: "Duration must be greater than 0 hours",
        });
      }
    }

    if (computedHours > 24) {
      return res.status(400).send({
        success: false,
        message: "Duration cannot exceed 24 hours per day",
      });
    }

    let pName = project_name;
    let tName = task_name;
    if (!pName) {
      const project = await Project.findOne({ where: { project_id } });
      if (project) pName = project.project_name;
    }
    if (!tName) {
      tName = task.task_name;
    }

    let empName = employee_name;
    if (!empName) {
      if (targetEmpId === authUser.employee_id) {
        empName = `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim();
      } else {
        const [targetUser] = await db.sequelize.query(
          "SELECT first_name, last_name FROM HRMS_REGISTERED_USER WHERE employee_id = :id",
          { replacements: { id: targetEmpId } }
        );
        if (targetUser && targetUser.length > 0) {
          empName = `${targetUser[0].first_name || ""} ${targetUser[0].last_name || ""}`.trim();
        }
      }
    }

    const newLog = await TimesheetLog.create({
      employee_id: targetEmpId,
      employee_name: empName || "",
      project_id,
      project_name: pName || "",
      task_id,
      task_name: tName || "",
      work_item: work_item || "",
      log_date,
      work_mode: selectedWorkMode,
      description: description.trim(),
      hours_mode: mode,
      start_time: mode === "Start-End Time" ? start_time : null,
      end_time: mode === "Start-End Time" ? end_time : null,
      total_hours: computedHours,
      is_billable: is_billable !== undefined ? Boolean(is_billable) : true,
      attachment_path: attachment_path || null,
      submission_status: "Not Submitted",
      approval_status: "Pending",
      is_deleted: false,
      created_by: authUser.employee_id,
    });

    await recordActivity({
      log_id: newLog.log_id,
      project_id,
      actor: authUser,
      activity_type: "TIME_ENTRY_ADDED",
      message: `Logged ${computedHours}h on task "${tName}"`,
      new_value: `${computedHours}h`,
    });

    await syncTaskLoggedHours(newLog.task_id);

    return res.status(201).send({
      success: true,
      message: "Time log created successfully",
      data: newLog,
    });
  } catch (error) {
    console.error("Error creating timesheet log:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while creating time log",
      error: error.message,
    });
  }
};

exports.getLogList = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { employee_id, start_date, end_date, project_id, task_id, approval_status, submission_status, work_mode } = req.query;
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    let filterEmpId = null;
    if (employee_id && employee_id !== "all") {
      filterEmpId = parseInt(employee_id, 10);
    } else if (!employee_id) {
      filterEmpId = authUser.employee_id;
    }

    if (!isAdmin && filterEmpId && filterEmpId !== authUser.employee_id) {
      if (!project_id) {
        return res.status(403).send({
          success: false,
          message: "Forbidden: You can only view your own time logs",
        });
      }
      const role = await projectAuth.getProjectRole(project_id, authUser);
      if (role !== "head") {
        return res.status(403).send({
          success: false,
          message: "Forbidden: You are not authorized to view logs for this employee",
        });
      }
    }

    if (employee_id === "all" && !isAdmin) {
      filterEmpId = authUser.employee_id;
    }

    const whereClause = {
      is_deleted: false,
    };

    if (filterEmpId) whereClause.employee_id = filterEmpId;
    if (project_id) whereClause.project_id = project_id;
    if (task_id) whereClause.task_id = task_id;
    if (approval_status) whereClause.approval_status = approval_status;
    if (submission_status) whereClause.submission_status = submission_status;
    if (work_mode) whereClause.work_mode = work_mode;

    if (start_date && end_date) {
      whereClause.log_date = { [Op.between]: [start_date, end_date] };
    } else if (start_date) {
      whereClause.log_date = { [Op.gte]: start_date };
    } else if (end_date) {
      whereClause.log_date = { [Op.lte]: end_date };
    }

    const logs = await TimesheetLog.findAll({
      where: whereClause,
      order: [["log_date", "DESC"], ["log_id", "DESC"]],
    });

    const missingNameEmpIds = [...new Set(logs.filter(l => !l.employee_name).map(l => l.employee_id))];
    if (missingNameEmpIds.length > 0) {
      try {
        const [userRows] = await db.sequelize.query(
          "SELECT employee_id, first_name, last_name FROM HRMS_REGISTERED_USER WHERE employee_id IN (:ids)",
          { replacements: { ids: missingNameEmpIds } }
        );
        const userMap = {};
        (userRows || []).forEach(u => {
          userMap[u.employee_id] = `${u.first_name || ""} ${u.last_name || ""}`.trim();
        });
        logs.forEach(l => {
          if (!l.employee_name && userMap[l.employee_id]) {
            l.employee_name = userMap[l.employee_id];
          }
        });
      } catch (err) {
        console.error("Error populating employee names for logs:", err);
      }
    }

    let holidays = [];
    if (start_date && end_date) {
      try {
        const monthStart = String(start_date).slice(0, 7) + "-01";
        const eDate = new Date(end_date);
        const lastDay = new Date(eDate.getFullYear(), eDate.getMonth() + 1, 0).getDate();
        const monthEnd = String(end_date).slice(0, 7) + "-" + String(lastDay).padStart(2, "0");

        const [holidayRows] = await db.sequelize.query(
          `SELECT MIN(id) as id, TRIM(holiday_name) as holiday_name, date
           FROM MASTER_HOLIDAY
           WHERE isDeleted = 0 AND status = 'ACTIVE'
             AND date BETWEEN :startDate AND :endDate
           GROUP BY date, TRIM(holiday_name)
           ORDER BY date ASC`,
          { replacements: { startDate: monthStart, endDate: monthEnd } }
        );
        holidays = (holidayRows || []).map((h) => ({
          id: h.id,
          holiday_name: h.holiday_name,
          date: h.date ? String(h.date).split("T")[0] : "",
          hours: 8.0,
        }));
      } catch (err) {
        console.error("Error fetching holidays:", err);
      }
    }

    let leaves = [];
    if (start_date && end_date && filterEmpId) {
      try {
        const monthStart = String(start_date).slice(0, 7) + "-01";
        const eDate = new Date(end_date);
        const lastDay = new Date(eDate.getFullYear(), eDate.getMonth() + 1, 0).getDate();
        const monthEnd = String(end_date).slice(0, 7) + "-" + String(lastDay).padStart(2, "0");

        const [leaveRows] = await db.sequelize.query(
          `SELECT L.id, L.employee_id, L.start_date, L.end_date, L.leave_days, L.approval_status,
                  COALESCE(M.leave_name, 'Leave') as leave_name
           FROM ESS_APPLIED_LEAVE_DETAIL L
           LEFT JOIN HRMS_LEAVE_MASTER M ON L.leaveId = M.id
           WHERE L.isDeleted = 0
             AND L.employee_id = :empId
             AND L.approval_status != 'REJECTED'
             AND L.start_date <= :endDate
             AND L.end_date >= :startDate
           ORDER BY L.start_date ASC`,
          { replacements: { empId: filterEmpId, startDate: monthStart, endDate: monthEnd } }
        );

        const startBound = new Date(monthStart);
        const endBound = new Date(monthEnd);
        (leaveRows || []).forEach((l) => {
          const s = new Date(l.start_date);
          const e = new Date(l.end_date);
          const totalDays = parseFloat(l.leave_days) || 1;
          const hoursPerDay = totalDays < 1 ? totalDays * 8.0 : 8.0;

          for (let cur = new Date(s); cur <= e; cur.setDate(cur.getDate() + 1)) {
            if (cur >= startBound && cur <= endBound) {
              const dateStr = cur.toISOString().split("T")[0];
              leaves.push({
                id: l.id,
                leave_name: l.leave_name,
                date: dateStr,
                hours: hoursPerDay,
                approval_status: l.approval_status,
              });
            }
          }
        });
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
    }

    let weekOffs = [];
    let weekOffRules = [];
    if (start_date && end_date) {
      try {
        let rulesQuery = `
          SELECT id, month_name, week_name, week_1st, week_2nd, week_3rd, week_4th, week_5th
          FROM SETUP_WORK_CALENDERS
          WHERE isDeleted = 0 AND status = 'ACTIVE'
        `;
        const replacements = {};
        if (filterEmpId) {
          rulesQuery += ` AND employee_id = :empId`;
          replacements.empId = String(filterEmpId);
        }
        const [empRules] = await db.sequelize.query(rulesQuery, { replacements });
        weekOffRules = empRules || [];

        if (weekOffRules.length === 0) {
          const [genericRules] = await db.sequelize.query(
            `SELECT id, month_name, week_name, week_1st, week_2nd, week_3rd, week_4th, week_5th
             FROM SETUP_WORK_CALENDERS
             WHERE isDeleted = 0 AND status = 'ACTIVE'
             LIMIT 100`
          );
          weekOffRules = genericRules || [];
        }

        const [startY, startM] = start_date.split("-").map(Number);
        const [endY, endM] = end_date.split("-").map(Number);
        const sBound = new Date(startY, startM - 1, 1);
        const lastDay = new Date(endY, endM, 0).getDate();
        const eBound = new Date(endY, endM - 1, lastDay);
        const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        for (let cur = new Date(sBound); cur <= eBound; cur.setDate(cur.getDate() + 1)) {
          const y = cur.getFullYear();
          const m = String(cur.getMonth() + 1).padStart(2, "0");
          const d = String(cur.getDate()).padStart(2, "0");
          const dateStr = `${y}-${m}-${d}`;
          const dayName = daysMap[cur.getDay()];
          const monthNum = String(cur.getMonth() + 1);

          const dayOfMonth = cur.getDate();
          const firstDayOfMonth = new Date(cur.getFullYear(), cur.getMonth(), 1).getDay();
          const adjustedDay = dayOfMonth + firstDayOfMonth;
          const weekNumber = Math.ceil(adjustedDay / 7);
          const suffix = weekNumber === 1 ? "st" : weekNumber === 2 ? "nd" : weekNumber === 3 ? "rd" : "th";
          const weekKey = `week_${weekNumber}${suffix}`;

          let matchingRule = weekOffRules.find(r => r.week_name === dayName && String(r.month_name) === monthNum && r[weekKey]);
          if (!matchingRule) {
            matchingRule = weekOffRules.find(r => r.week_name === dayName && r[weekKey]);
          }

          let isOff = false;
          let offType = "Full Day";

          if (dayName === "Sunday" || dayName === "Saturday") {
            isOff = true;
            if (matchingRule && matchingRule[weekKey]) {
              offType = matchingRule[weekKey];
            }
          }

          if (isOff) {
            weekOffs.push({
              date: dateStr,
              day_name: dayName,
              week_key: weekKey,
              type: offType,
              name: "Weekly Off",
              hours: 0,
            });
          }
        }
      } catch (err) {
        console.error("Error computing week offs:", err);
      }
    }

    return res.status(200).send({
      success: true,
      data: logs,
      holidays,
      leaves,
      weekOffs,
      weekOffRules,
      total: logs.length,
    });
  } catch (error) {
    console.error("Error retrieving timesheet logs:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { id } = req.params;
    const log = await TimesheetLog.findOne({ where: { log_id: id, is_deleted: false } });
    if (!log) {
      return res.status(404).send({ success: false, message: "Time log not found" });
    }

    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && log.employee_id !== authUser.employee_id) {
      const role = await projectAuth.getProjectRole(log.project_id, authUser);
      if (role !== "head") {
        return res.status(403).send({ success: false, message: "Forbidden: Access denied" });
      }
    }

    return res.status(200).send({ success: true, data: log });
  } catch (error) {
    console.error("Error retrieving timesheet log:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateLog = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { id } = req.params;
    const log = await TimesheetLog.findOne({ where: { log_id: id, is_deleted: false } });
    if (!log) {
      return res.status(404).send({ success: false, message: "Time log not found" });
    }
    const oldTaskId = log.task_id;

    const isAdmin = projectAuth.isProjectAdmin(authUser);
    const userProjectRole = await projectAuth.getProjectRole(log.project_id, authUser);
    const isApproverOrAdmin = isAdmin || userProjectRole === "head";

    if (!isAdmin && log.employee_id !== authUser.employee_id && !isApproverOrAdmin) {
      return res.status(403).send({ success: false, message: "Forbidden: You cannot edit another member's log" });
    }

    if (log.submission_status === "Submitted" && !isApproverOrAdmin && log.approval_status !== "Rejected") {
      return res.status(400).send({
        success: false,
        message: "This time log has already been submitted and cannot be edited",
      });
    }

    const wasApproved = (log.approval_status === "Approved");

    if (log.approval_status === "Approved" && !isAdmin) {
      return res.status(400).send({
        success: false,
        message: "Approved time logs are locked and cannot be edited",
      });
    }

    if (req.body.approval_status !== undefined) {
      if (req.body.approval_status === "Rejected") {
        const reason = (req.body.rejection_reason || req.body.reason || "").trim();
        if (!reason) {
          return res.status(400).send({
            success: false,
            message: "Rejection reason is required",
          });
        }
        log.approval_status = "Rejected";
        log.submission_status = "Not Submitted";
      } else {
        log.approval_status = req.body.approval_status;
      }
    }

    const oldTotal = log.total_hours;

    if (req.body.project_id && req.body.project_id !== log.project_id) {
      const targetRole = await projectAuth.getProjectRole(req.body.project_id, authUser);
      if (!isAdmin && targetRole === "unassigned") {
        return res.status(403).send({ success: false, message: "Forbidden: You are not assigned to target project" });
      }
      log.project_id = req.body.project_id;
      if (req.body.project_name) log.project_name = req.body.project_name;
    }

    if (req.body.task_id && req.body.task_id !== log.task_id) {
      const task = await Task.findOne({ where: { task_id: req.body.task_id, is_deleted: false } });
      if (!task || task.project_id !== log.project_id) {
        return res.status(400).send({ success: false, message: "Invalid task for this project" });
      }
      log.task_id = req.body.task_id;
      log.task_name = task.task_name;
    }

    if (req.body.description !== undefined) {
      if (!req.body.description.trim()) {
        return res.status(400).send({ success: false, message: "Description cannot be empty" });
      }
      if (req.body.description.length > 15000) {
        return res.status(400).send({ success: false, message: "Description cannot exceed 15000 characters" });
      }
      log.description = req.body.description.trim();
    }

    if (req.body.log_date) log.log_date = req.body.log_date;
    if (req.body.work_mode !== undefined) {
      const validModes = ["Office", "WFH", "Client Site", "Day Off"];
      if (validModes.includes(req.body.work_mode)) {
        log.work_mode = req.body.work_mode;
      }
    }
    if (req.body.work_item !== undefined) log.work_item = req.body.work_item;
    if (req.body.attachment_path !== undefined) log.attachment_path = req.body.attachment_path;
    if (req.body.is_billable !== undefined) log.is_billable = Boolean(req.body.is_billable);

    if (req.body.hours_mode) log.hours_mode = req.body.hours_mode;
    if (req.body.start_time !== undefined) log.start_time = req.body.start_time;
    if (req.body.end_time !== undefined) log.end_time = req.body.end_time;

    let computedHours = log.total_hours;
    if (log.hours_mode === "Start-End Time") {
      computedHours = parseHoursFromRange(log.start_time, log.end_time);
    } else if (req.body.total_hours !== undefined) {
      computedHours = parseFloat(req.body.total_hours) || 0;
    }

    if (log.work_mode === "Day Off") {
      if (computedHours < 0) {
        return res.status(400).send({ success: false, message: "Duration cannot be negative" });
      }
    } else {
      if (computedHours <= 0) {
        return res.status(400).send({ success: false, message: "Duration must be greater than 0 hours" });
      }
    }
    if (computedHours > 24) {
      return res.status(400).send({ success: false, message: "Duration cannot exceed 24 hours per day" });
    }

    log.total_hours = computedHours;
    await log.save();

    if (log.timesheet_submission_id) {
      const allActiveLogs = await TimesheetLog.findAll({
        where: {
          timesheet_submission_id: log.timesheet_submission_id,
          approval_status: { [Op.ne]: "Rejected" },
          is_deleted: false,
        },
      });
      const activeTotal = allActiveLogs.reduce((sum, l) => sum + (parseFloat(l.total_hours) || 0), 0);
      await TimesheetSubmission.update(
        { total_hours: Math.round(activeTotal * 100) / 100 },
        { where: { submission_id: log.timesheet_submission_id } }
      );
    }

    const reasonText = (req.body.rejection_reason || req.body.reason || "").trim();
    const activityMsg = req.body.approval_status === "Rejected"
      ? (reasonText
          ? `Rejected time log on "${log.task_name}" (${computedHours}h): ${reasonText}`
          : `Rejected time log on "${log.task_name}" (${computedHours}h)`)
      : `Updated time log on "${log.task_name}" to ${computedHours}h`;

    await recordActivity({
      submission_id: log.timesheet_submission_id || null,
      log_id: log.log_id,
      project_id: log.project_id,
      actor: authUser,
      activity_type: req.body.approval_status === "Rejected" ? "LOG_REJECTED" : "TIME_ENTRY_UPDATED",
      message: activityMsg,
      old_value: `${oldTotal}h`,
      new_value: `${computedHours}h`,
    });

    await syncTaskLoggedHours(log.task_id);
    if (oldTaskId && oldTaskId != log.task_id) {
      await syncTaskLoggedHours(oldTaskId);
    }

    if (wasApproved) {
      try {
        if (req.body.approval_status === "Rejected") {
          await projectCostService.reverseTimeLogCost(log.log_id, authUser, reasonText || "Rejected by Admin");
        } else if (computedHours !== parseFloat(oldTotal)) {
          await projectCostService.adjustTimeLogCost(log.log_id, computedHours, authUser, "Admin time log adjustment");
        }
      } catch (costErr) {
        console.error("Error adjusting ledger for modified time log:", costErr);
      }
    }

    return res.status(200).send({
      success: true,
      message: req.body.approval_status === "Rejected" ? "Time log rejected successfully" : "Time log updated successfully",
      data: log,
    });
  } catch (error) {
    console.error("Error updating timesheet log:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { id } = req.params;
    const log = await TimesheetLog.findOne({ where: { log_id: id, is_deleted: false } });
    if (!log) {
      return res.status(404).send({ success: false, message: "Time log not found" });
    }

    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && log.employee_id !== authUser.employee_id) {
      const role = await projectAuth.getProjectRole(log.project_id, authUser);
      if (role !== "head") {
        return res.status(403).send({ success: false, message: "Forbidden: You cannot delete another member's log" });
      }
    }

    if (log.submission_status === "Submitted") {
      return res.status(400).send({
        success: false,
        message: "This time log has already been submitted and cannot be deleted",
      });
    }

    if (log.approval_status === "Approved") {
      return res.status(400).send({
        success: false,
        message: "Approved time logs are locked and cannot be deleted",
      });
    }

    log.is_deleted = true;
    await log.save();

    await recordActivity({
      log_id: log.log_id,
      project_id: log.project_id,
      actor: authUser,
      activity_type: "TIME_ENTRY_DELETED",
      message: `Deleted time log of ${log.total_hours}h on "${log.task_name}"`,
    });

    await syncTaskLoggedHours(log.task_id);

    return res.status(200).send({ success: true, message: "Time log deleted successfully" });
  } catch (error) {
    console.error("Error deleting timesheet log:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getLogSummary = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { employee_id, start_date, end_date, project_id } = req.query;
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    let filterEmpId = null;
    if (employee_id && employee_id !== "all") {
      filterEmpId = parseInt(employee_id, 10);
    } else if (!employee_id) {
      filterEmpId = authUser.employee_id;
    }

    if (!isAdmin && filterEmpId && filterEmpId !== authUser.employee_id) {
      return res.status(403).send({ success: false, message: "Forbidden: Access denied" });
    }

    if (employee_id === "all" && !isAdmin) {
      filterEmpId = authUser.employee_id;
    }

    const whereClause = {
      is_deleted: false,
    };
    if (filterEmpId) whereClause.employee_id = filterEmpId;

    if (project_id) whereClause.project_id = project_id;
    if (start_date && end_date) {
      whereClause.log_date = { [Op.between]: [start_date, end_date] };
    }

    const logs = await TimesheetLog.findAll({ where: whereClause });

    let worked_hours = 0;
    let submitted_hours = 0;
    let not_submitted_hours = 0;
    let billable_hours = 0;
    let non_billable_hours = 0;

    logs.forEach((l) => {
      const hrs = parseFloat(l.total_hours) || 0;
      worked_hours += hrs;
      if (l.submission_status === "Submitted") {
        submitted_hours += hrs;
      } else {
        not_submitted_hours += hrs;
      }
      if (l.is_billable) {
        billable_hours += hrs;
      } else {
        non_billable_hours += hrs;
      }
    });

    let holiday_hours = 0;
    if (start_date && end_date) {
      try {
        const [holidayRows] = await db.sequelize.query(
          `SELECT COUNT(DISTINCT date) as count
           FROM MASTER_HOLIDAY
           WHERE isDeleted = 0 AND status = 'ACTIVE'
             AND date BETWEEN :startDate AND :endDate`,
          { replacements: { startDate: start_date, endDate: end_date } }
        );
        const count = holidayRows && holidayRows[0] ? parseInt(holidayRows[0].count, 10) || 0 : 0;
        holiday_hours = count * 8.0;
      } catch (err) {
        console.error("Error computing holiday summary:", err);
      }
    }

    let leave_hours = 0;
    if (start_date && end_date && filterEmpId) {
      try {
        const [leaveRows] = await db.sequelize.query(
          `SELECT L.id, L.start_date, L.end_date, L.leave_days
           FROM ESS_APPLIED_LEAVE_DETAIL L
           WHERE L.isDeleted = 0
             AND L.employee_id = :empId
             AND L.approval_status != 'REJECTED'
             AND L.start_date <= :endDate
             AND L.end_date >= :startDate`,
          { replacements: { empId: filterEmpId, startDate: start_date, endDate: end_date } }
        );
        const startBound = new Date(start_date);
        const endBound = new Date(end_date);
        (leaveRows || []).forEach((l) => {
          const s = new Date(l.start_date);
          const e = new Date(l.end_date);
          const totalDays = parseFloat(l.leave_days) || 1;
          const hoursPerDay = totalDays < 1 ? totalDays * 8.0 : 8.0;
          for (let cur = new Date(s); cur <= e; cur.setDate(cur.getDate() + 1)) {
            if (cur >= startBound && cur <= endBound) {
              leave_hours += hoursPerDay;
            }
          }
        });
      } catch (err) {
        console.error("Error computing leave summary:", err);
      }
    }

    const total_hours = worked_hours + holiday_hours + leave_hours;

    return res.status(200).send({
      success: true,
      data: {
        total_hours: Math.round(total_hours * 100) / 100,
        worked_hours: Math.round(worked_hours * 100) / 100,
        holiday_hours: Math.round(holiday_hours * 100) / 100,
        leave_hours: Math.round(leave_hours * 100) / 100,
        submitted_hours: Math.round(submitted_hours * 100) / 100,
        not_submitted_hours: Math.round(not_submitted_hours * 100) / 100,
        billable_hours: Math.round(billable_hours * 100) / 100,
        non_billable_hours: Math.round(non_billable_hours * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Error computing timesheet summary:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const targetEmpId = req.query.employee_id ? parseInt(req.query.employee_id, 10) : authUser.employee_id;
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && targetEmpId !== authUser.employee_id) {
      return res.status(403).send({ success: false, message: "Forbidden: Access denied" });
    }

    const [jobs] = await db.sequelize.query(
      `SELECT
        t.task_id,
        t.task_name,
        t.project_id,
        t.project_name,
        t.status,
        t.priority,
        t.start_date,
        t.due_date,
        t.estimated_hours,
        t.assigned_to_id,
        t.assigned_to_name,
        COALESCE(SUM(l.total_hours), 0) AS hours_logged,
        1 AS user_count
      FROM PROJECT_TASKS t
      LEFT JOIN TIMESHEET_LOGS l
        ON l.task_id = t.task_id AND l.employee_id = :employeeId AND l.is_deleted = 0
      WHERE t.assigned_to_id = :employeeId AND t.is_deleted = 0
      GROUP BY t.task_id
      ORDER BY t.task_id DESC`,
      { replacements: { employeeId: targetEmpId } }
    );

    return res.status(200).send({
      success: true,
      data: jobs || [],
      total: (jobs || []).length,
    });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getProjectsSummary = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const targetEmpId = req.query.employee_id ? parseInt(req.query.employee_id, 10) : authUser.employee_id;
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && targetEmpId !== authUser.employee_id) {
      return res.status(403).send({ success: false, message: "Forbidden: Access denied" });
    }

    const [projects] = await db.sequelize.query(
      `SELECT
        p.project_id,
        p.project_name,
        p.client_name,
        p.status,
        p.start_date,
        p.end_date,
        (
          SELECT COUNT(*)
          FROM PROJECT_TASKS t
          WHERE t.project_id = p.project_id AND t.assigned_to_id = :employeeId AND t.is_deleted = 0
        ) AS jobs_count,
        (
          SELECT COALESCE(SUM(l.total_hours), 0)
          FROM TIMESHEET_LOGS l
          WHERE l.project_id = p.project_id AND l.employee_id = :employeeId AND l.is_deleted = 0
        ) AS hours_logged
      FROM PROJECTS p
      LEFT JOIN PROJECT_MEMBERS pm
        ON pm.project_id = p.project_id AND pm.employee_id = :employeeId AND pm.is_active = 1
      WHERE p.is_deleted = 0 AND (
        pm.id IS NOT NULL
        OR p.project_id IN (SELECT project_id FROM PROJECT_TASKS WHERE assigned_to_id = :employeeId AND is_deleted = 0)
      )
      GROUP BY p.project_id
      ORDER BY p.project_id DESC`,
      { replacements: { employeeId: targetEmpId } }
    );

    return res.status(200).send({
      success: true,
      data: projects || [],
      total: (projects || []).length,
    });
  } catch (error) {
    console.error("Error retrieving projects summary:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getJobSchedule = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const targetEmpId = req.query.employee_id ? parseInt(req.query.employee_id, 10) : authUser.employee_id;
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && targetEmpId !== authUser.employee_id) {
      return res.status(403).send({ success: false, message: "Forbidden: Access denied" });
    }

    const tasks = await Task.findAll({
      where: { assigned_to_id: targetEmpId, is_deleted: false },
      order: [["start_date", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      data: tasks,
      total: tasks.length,
    });
  } catch (error) {
    console.error("Error retrieving job schedule:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getWeeklyMatrix = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { start_date, end_date, employee_id } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).send({ success: false, message: "start_date and end_date are required" });
    }

    const filterEmpId = employee_id ? parseInt(employee_id, 10) : authUser.employee_id;
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && filterEmpId !== authUser.employee_id) {
      return res.status(403).send({ success: false, message: "Forbidden: Access denied" });
    }

    const logs = await TimesheetLog.findAll({
      where: {
        employee_id: filterEmpId,
        log_date: { [Op.between]: [start_date, end_date] },
        is_deleted: false,
      },
      order: [["log_date", "ASC"]],
    });

    const matrixMap = {};
    const dailyTotals = {};

    logs.forEach((log) => {
      const key = `${log.project_id}_${log.task_id}`;
      if (!matrixMap[key]) {
        matrixMap[key] = {
          project_id: log.project_id,
          project_name: log.project_name,
          task_id: log.task_id,
          task_name: log.task_name,
          days: {},
          total_hours: 0,
        };
      }

      const hrs = parseFloat(log.total_hours) || 0;
      matrixMap[key].days[log.log_date] = (matrixMap[key].days[log.log_date] || 0) + hrs;
      matrixMap[key].total_hours += hrs;

      dailyTotals[log.log_date] = (dailyTotals[log.log_date] || 0) + hrs;
    });

    const rows = Object.values(matrixMap).map((item) => ({
      ...item,
      total_hours: Math.round(item.total_hours * 100) / 100,
    }));

    return res.status(200).send({
      success: true,
      data: {
        rows,
        daily_totals: dailyTotals,
        grand_total: Math.round(Object.values(dailyTotals).reduce((a, b) => a + b, 0) * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Error retrieving weekly matrix:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.submitTimesheet = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { employee_id, employee_name, submission_name, period_start_date, period_end_date, status: requestedStatus } = req.body;

    if (!period_start_date || !period_end_date) {
      return res.status(400).send({
        success: false,
        message: "period_start_date and period_end_date are required",
      });
    }

    const targetEmpId = employee_id ? parseInt(employee_id, 10) : authUser.employee_id;
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && targetEmpId !== authUser.employee_id) {
      return res.status(403).send({
        success: false,
        message: "Forbidden: You cannot submit timesheet for another member",
      });
    }

    const whereClause = {
      employee_id: targetEmpId,
      is_deleted: false,
      submission_status: "Not Submitted",
    };
    if (req.body.log_ids && Array.isArray(req.body.log_ids) && req.body.log_ids.length > 0) {
      whereClause.log_id = { [Op.in]: req.body.log_ids };
    } else {
      whereClause.log_date = { [Op.between]: [period_start_date, period_end_date] };
    }

    const logs = await TimesheetLog.findAll({ where: whereClause });

    if (logs.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No unsubmitted time logs found in the selected period",
      });
    }

    const total_hours = logs.reduce((sum, l) => sum + (parseFloat(l.total_hours) || 0), 0);
    const empName = employee_name || `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim();
    const subStatus = requestedStatus === "Draft" ? "Draft" : "Pending";

    const submission = await TimesheetSubmission.create({
      employee_id: targetEmpId,
      employee_name: empName,
      submission_name: submission_name || `Timesheet (${period_start_date} - ${period_end_date})`,
      period_start_date,
      period_end_date,
      total_hours: Math.round(total_hours * 100) / 100,
      status: subStatus,
      submitted_at: subStatus === "Pending" ? new Date() : null,
      is_deleted: false,
    });

    await Promise.all(
      logs.map((l) => {
        l.submission_status = "Submitted";
        l.approval_status = "Pending";
        l.timesheet_submission_id = submission.submission_id;
        return l.save();
      })
    );

    await recordActivity({
      submission_id: submission.submission_id,
      actor: authUser,
      activity_type: "TIMESHEET_SUBMITTED",
      message: `Submitted timesheet for period ${period_start_date} to ${period_end_date} (${submission.total_hours}h)`,
      new_value: `${submission.total_hours}h`,
    });

    if (req.body.comments && req.body.comments.trim()) {
      await recordActivity({
        submission_id: submission.submission_id,
        actor: authUser,
        activity_type: "COMMENT_ADDED",
        message: req.body.comments.trim(),
      });
    }

    return res.status(201).send({
      success: true,
      message: "Timesheet submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Error submitting timesheet:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while submitting timesheet",
      error: error.message,
    });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { employee_id, view, status } = req.query;
    const isAdmin = projectAuth.isProjectAdmin(authUser);

    if (view === "team" || view === "approvals") {
      if (isAdmin) {
        const whereClause = { is_deleted: false };
        if (status) whereClause.status = status;
        const submissions = await TimesheetSubmission.findAll({
          where: whereClause,
          order: [["submission_id", "DESC"]],
        });
        return res.status(200).send({ success: true, data: submissions, total: submissions.length });
      }

      const managedIds = await getManagedProjectIds(authUser);
      if (!managedIds || managedIds.length === 0) {
        return res.status(200).send({ success: true, data: [], total: 0 });
      }

      let queryStr = `
        SELECT DISTINCT s.*
        FROM TIMESHEET_SUBMISSIONS s
        INNER JOIN TIMESHEET_LOGS l ON l.timesheet_submission_id = s.submission_id
        WHERE s.is_deleted = 0 AND l.project_id IN (:managedIds)
      `;
      const replacements = { managedIds };

      if (status) {
        queryStr += ` AND s.status = :status`;
        replacements.status = status;
      }
      queryStr += ` ORDER BY s.submission_id DESC`;

      const [submissions] = await db.sequelize.query(queryStr, { replacements });
      return res.status(200).send({ success: true, data: submissions || [], total: (submissions || []).length });
    }

    const filterEmpId = employee_id ? parseInt(employee_id, 10) : authUser.employee_id;
    if (!isAdmin && filterEmpId !== authUser.employee_id) {
      return res.status(403).send({ success: false, message: "Forbidden: You can only view your own submissions" });
    }

    const whereClause = {
      employee_id: filterEmpId,
      is_deleted: false,
    };
    if (status && status !== "All") whereClause.status = status;

    const submissions = await TimesheetSubmission.findAll({
      where: whereClause,
      order: [["submission_id", "DESC"]],
    });

    return res.status(200).send({
      success: true,
      data: submissions,
      total: submissions.length,
    });
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { id } = req.params;
    const submission = await TimesheetSubmission.findOne({
      where: { submission_id: id, is_deleted: false },
    });

    if (!submission) {
      return res.status(404).send({ success: false, message: "Submission not found" });
    }

    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin && submission.employee_id !== authUser.employee_id) {
      const managedIds = await getManagedProjectIds(authUser);
      const [logs] = await db.sequelize.query(
        "SELECT DISTINCT project_id FROM TIMESHEET_LOGS WHERE timesheet_submission_id = :subId",
        { replacements: { subId: id } }
      );
      const hasManagedProject = logs.some((l) => managedIds.includes(l.project_id));
      if (!hasManagedProject) {
        return res.status(403).send({ success: false, message: "Forbidden: Access denied" });
      }
    }

    let logs = await TimesheetLog.findAll({
      where: { timesheet_submission_id: id, is_deleted: false },
      order: [["log_date", "ASC"]],
    });

    if (logs.length === 0 && submission.period_start_date && submission.period_end_date) {
      logs = await TimesheetLog.findAll({
        where: {
          employee_id: submission.employee_id,
          log_date: { [Op.between]: [submission.period_start_date, submission.period_end_date] },
          is_deleted: false,
        },
        order: [["log_date", "ASC"]],
      });
    }

    const activities = await TimesheetActivity.findAll({
      where: { submission_id: id },
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      data: {
        submission,
        logs,
        activities,
      },
    });
  } catch (error) {
    console.error("Error retrieving submission detail:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateSubmissionStatus = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      await t.rollback();
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { id } = req.params;
    const { status, approver_comments, rejection_reason } = req.body;

    const submission = await TimesheetSubmission.findOne({
      where: { submission_id: id, is_deleted: false },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!submission) {
      await t.rollback();
      return res.status(404).send({ success: false, message: "Submission not found" });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      await t.rollback();
      return res.status(400).send({ success: false, message: "Invalid status: Must be Approved or Rejected" });
    }

    if (submission.status === "Approved" && status === "Approved") {
      await t.rollback();
      return res.status(400).send({ success: false, message: "Timesheet submission is already approved" });
    }

    const totalHoursNum = parseFloat(submission.total_hours) || 0;
    if (totalHoursNum <= 0) {
      await t.rollback();
      return res.status(400).send({
        success: false,
        message: "Timesheet with 00:00 total hours cannot be approved or rejected",
      });
    }

    const isAdmin = projectAuth.isProjectAdmin(authUser);

    const logs = await TimesheetLog.findAll({
      where: { timesheet_submission_id: submission.submission_id, is_deleted: false },
      transaction: t,
    });
    const subProjectIds = [...new Set(logs.map((l) => l.project_id))];

    if (!isAdmin) {
      if (subProjectIds.length === 0) {
        await t.rollback();
        return res.status(403).send({ success: false, message: "Forbidden: No authorized logs in submission" });
      }

      for (const pid of subProjectIds) {
        const role = await projectAuth.getProjectRole(pid, authUser);
        if (role !== "head") {
          await t.rollback();
          return res.status(403).send({
            success: false,
            message: "Forbidden: You can only approve/reject timesheets for projects you manage as Project Head",
          });
        }
      }
    }

    const previousStatus = submission.status;

    if (status === "Rejected") {
      const reason = (rejection_reason || approver_comments || "").trim();
      if (!reason) {
        await t.rollback();
        return res.status(400).send({
          success: false,
          message: "Please enter a rejection reason in the comment section before rejecting",
        });
      }

      submission.status = "Rejected";
      submission.rejected_by = authUser.employee_id;
      submission.rejected_at = new Date();
      submission.rejection_reason = reason;
      submission.approver_comments = reason;
      await submission.save({ transaction: t });

      await TimesheetLog.update(
        {
          submission_status: "Not Submitted",
          approval_status: "Rejected",
        },
        { where: { timesheet_submission_id: submission.submission_id }, transaction: t }
      );

      await recordActivity({
        submission_id: submission.submission_id,
        actor: authUser,
        activity_type: "TIMESHEET_REJECTED",
        message: `Timesheet rejected: ${reason}`,
        old_value: previousStatus,
        new_value: "Rejected",
      });

      if (previousStatus === "Approved") {
        await projectCostService.reverseTimesheetCosts(submission.submission_id, authUser, reason, t);
      }

      await t.commit();

      return res.status(200).send({
        success: true,
        message: "Timesheet rejected successfully. Logs unlocked for employee correction.",
        data: submission,
      });
    }

    if (status === "Approved") {
      submission.status = "Approved";
      submission.approved_by = authUser.employee_id;
      submission.approved_at = new Date();
      submission.approver_comments = approver_comments || "Approved";
      await submission.save({ transaction: t });

      await TimesheetLog.update(
        { approval_status: "Approved" },
        {
          where: {
            timesheet_submission_id: submission.submission_id,
            approval_status: { [Op.ne]: "Rejected" },
          },
          transaction: t,
        }
      );

      await recordActivity({
        submission_id: submission.submission_id,
        actor: authUser,
        activity_type: "TIMESHEET_APPROVED",
        message: `Timesheet approved by ${authUser.first_name || ""} ${authUser.last_name || ""}`.trim(),
        old_value: previousStatus,
        new_value: "Approved",
      });

      await projectCostService.postTimesheetSubmissionCosts(submission.submission_id, authUser, t);

      await t.commit();

      return res.status(200).send({
        success: true,
        message: "Timesheet approved successfully. Costs posted to project budget.",
        data: submission,
      });
    }
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("Error updating submission status:", error);
    return res.status(400).send({
      success: false,
      message: error.message || "Failed to update submission status",
      error: error.message,
    });
  }
};

exports.getSubmissionActivities = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { id } = req.params;
    const activities = await TimesheetActivity.findAll({
      where: { submission_id: id },
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      data: activities,
      total: activities.length,
    });
  } catch (error) {
    console.error("Error retrieving activities:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addSubmissionComment = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized: Invalid or missing token" });
    }

    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).send({ success: false, message: "Comment cannot be empty" });
    }

    const submission = await TimesheetSubmission.findOne({
      where: { submission_id: id, is_deleted: false },
    });
    if (!submission) {
      return res.status(404).send({ success: false, message: "Submission not found" });
    }

    const act = await recordActivity({
      submission_id: id,
      actor: authUser,
      activity_type: "COMMENT",
      message: comment.trim(),
    });

    return res.status(201).send({
      success: true,
      message: "Comment added successfully",
      data: act,
    });
  } catch (error) {
    console.error("Error adding submission comment:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
