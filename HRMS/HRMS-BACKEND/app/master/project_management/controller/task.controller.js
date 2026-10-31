const db = require("../../../models");
const Task = db.task;
const Project = db.project;
const ProjectMember = db.projectMember;
const TaskComment = db.taskComment;
const ProjectMilestone = db.projectMilestone;
const { Op } = require("sequelize");
const projectAuth = require("../middleware/projectAuth");
const { recalculateProjectAndMilestones } = require("../services/milestoneProgressService");

const isOverdue = (dueDate, status) => {
  if (!dueDate) return false;
  if (status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const isProjectMember = async (projectId, employeeId, project = null) => {
  if (!employeeId) return true;
  if (!project) {
    project = await Project.findOne({
      where: { project_id: projectId, is_deleted: false },
    });
  }
  if (!project) return false;
  if (
    project.project_manager_id == employeeId ||
    project.supervisor_id == employeeId ||
    project.created_by == employeeId
  ) {
    return true;
  }
  const member = await ProjectMember.findOne({
    where: { project_id: projectId, employee_id: employeeId, is_active: true },
  });
  return !!member;
};

const computeTaskConsumedHours = (plain, logData) => {
  let consumedHours = 0;
  let firstLogDate = null;
  let lastLogDate = null;

  if (logData && logData.consumed_hours > 0) {
    consumedHours = logData.consumed_hours;
    firstLogDate = logData.first_log_date;
    lastLogDate = logData.last_log_date;
  } else if (parseFloat(plain.logged_hours || 0) > 0) {
    consumedHours = parseFloat(plain.logged_hours);
    firstLogDate = plain.start_date;
    lastLogDate = plain.completed_date || plain.due_date;
  } else if (parseFloat(plain.estimated_hours || 0) > 0) {
    const est = parseFloat(plain.estimated_hours);
    if (plain.status === "Completed") {
      consumedHours = est;
    } else if (plain.progress > 0) {
      consumedHours = parseFloat(((est * plain.progress) / 100).toFixed(2));
    }
    firstLogDate = plain.start_date;
    lastLogDate = plain.completed_date || plain.due_date;
  } else if (plain.status === "Completed") {
    if (plain.start_date && (plain.completed_date || plain.due_date)) {
      const s = new Date(plain.start_date);
      const e = new Date(plain.completed_date || plain.due_date);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      const diffDays = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)) + 1);
      consumedHours = Math.min(diffDays * 8, 40);
    } else {
      consumedHours = 8;
    }
    firstLogDate = plain.start_date;
    lastLogDate = plain.completed_date || plain.due_date;
  }

  return {
    consumed_hours: consumedHours,
    first_log_date: firstLogDate,
    last_log_date: lastLogDate,
  };
};

const logActivity = async ({
  task_id,
  user,
  message,
  activity_type = "COMMENT",
  action_type = "comment",
  old_value = null,
  new_value = null,
  role = null,
}) => {
  try {
    if (!TaskComment) return null;
    const senderName = user
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
      : "System";
    const senderEmail = user ? user.employee_official_email || null : null;
    const senderRole =
      role || (user ? user.role_master_name || "Member" : "System");

    return await TaskComment.create({
      task_id,
      sender_id: user ? user.employee_id : null,
      sender_name: senderName,
      sender_email: senderEmail,
      sender_role: senderRole,
      message,
      activity_type,
      action_type,
      old_value: old_value ? String(old_value) : null,
      new_value: new_value ? String(new_value) : null,
      is_edited: false,
      is_deleted: false,
    });
  } catch (err) {
    console.error("Error logging task activity:", err);
    return null;
  }
};

exports.createTask = async (req, res) => {
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      project_id,
      project_name,
      task_name,
      description,
      assigned_to_id,
      assigned_to_name,
      assigned_to_email,
      reviewer_id,
      reviewer_name,
      reviewer_email,
      priority,
      status,
      start_date,
      due_date,
      estimated_hours,
      milestone_id,
      milestone_name,
      created_by,
    } = req.body;

    if (!task_name || !task_name.trim()) {
      return res.status(400).send({
        success: false,
        message: "Task name is required",
      });
    }

    if (!project_id) {
      return res.status(400).send({
        success: false,
        message: "Project is required",
      });
    }

    const project = await Project.findOne({
      where: { project_id, is_deleted: false },
    });
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    if (project.status === "Completed" || project.status === "Cancelled") {
      return res.status(400).send({
        success: false,
        message: "Cannot create tasks under a completed or cancelled project",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];
    const finalStartDate = start_date || todayStr;

    if (start_date) {
      const sDate = new Date(start_date);
      sDate.setHours(0, 0, 0, 0);
      if (sDate < today) {
        return res.status(400).send({
          success: false,
          message: "Start date cannot be earlier than today",
        });
      }
    }

    if (due_date && new Date(due_date) < new Date(finalStartDate)) {
      return res.status(400).send({
        success: false,
        message: "Task Due Date cannot be earlier than Start Date",
      });
    }

    const projectRole = await projectAuth.getProjectRole(project_id, user);
    if (projectRole === "unassigned" || !projectRole) {
      return res.status(403).send({
        success: false,
        message: "You are not assigned to this project to create tasks",
      });
    }

    let pName = project_name || project.project_name;
    let rId = reviewer_id;
    let rName = reviewer_name;
    let rEmail = reviewer_email;

    if (assigned_to_id) {
      const validAssignee = await isProjectMember(
        project_id,
        assigned_to_id,
        project
      );
      if (!validAssignee) {
        return res.status(400).send({
          success: false,
          message: "Assigned employee must be an active member of this project",
        });
      }
    }

    if (!rId && project.project_manager_id) {
      rId = project.project_manager_id;
      rName = project.project_manager_name;
      rEmail = project.project_manager_email;
    }

    if (rId) {
      const validReviewer = await isProjectMember(project_id, rId, project);
      if (!validReviewer) {
        return res.status(400).send({
          success: false,
          message: "Reviewer must be an active member of this project",
        });
      }
    }

    let mName = milestone_name || null;
    let mId = milestone_id || null;
    if (mId) {
      const ms = await ProjectMilestone.findOne({
        where: {
          project_id,
          is_deleted: false,
          [Op.or]: [{ id: mId }, { milestone_id: mId }, { milestone_code: mId }],
        },
      });
      if (!ms) {
        return res.status(400).send({
          success: false,
          message: "Selected milestone does not belong to this project or does not exist",
        });
      }
      mId = ms.id;
      mName = ms.name;
    }

    const initialReviewStatus =
      status === "In Review"
        ? "Submitted"
        : status === "Completed"
        ? "Approved"
        : "Pending";

    const newTask = await Task.create({
      project_id,
      project_name: pName || "",
      task_name: task_name.trim(),
      task_type: req.body.task_type || "Task",
      description: description || "",
      assigned_to_id: assigned_to_id || null,
      assigned_to_name: assigned_to_name || "",
      assigned_to_email: assigned_to_email || "",
      reviewer_id: rId || null,
      reviewer_name: rName || "",
      reviewer_email: rEmail || "",
      priority: priority || "Medium",
      status: status || "To Do",
      review_status: initialReviewStatus,
      start_date: finalStartDate,
      due_date: due_date || null,
      estimated_hours: estimated_hours || 0,
      logged_hours: 0,
      progress: status === "Completed" ? 100 : 0,
      milestone_id: mId || null,
      milestone_name: mName || null,
      completed_date: status === "Completed" ? todayStr : null,
      is_active: true,
      is_deleted: false,
      created_by: created_by || user.employee_id,
    });

    const actorRole =
      projectRole === "admin"
        ? "Admin"
        : projectRole === "head"
        ? "Project Head"
        : "Team Member";

    await logActivity({
      task_id: newTask.task_id,
      user,
      message: `${user.first_name || "User"} created this task`,
      activity_type: "TASK_CREATED",
      action_type: "comment",
      role: actorRole,
    });

    if (assigned_to_id) {
      await logActivity({
        task_id: newTask.task_id,
        user,
        message: `${user.first_name || "User"} assigned task to ${
          assigned_to_name || "Employee #" + assigned_to_id
        }`,
        activity_type: "ASSIGNED",
        action_type: "comment",
        new_value: assigned_to_name || String(assigned_to_id),
        role: actorRole,
      });
    }

    await recalculateProjectAndMilestones(project_id);

    return res.status(201).send({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while creating task",
      error: error.message,
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { project_id, status, priority, assigned_to_id, search } = req.query;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    if (project_id) {
      const projectRole = await projectAuth.getProjectRole(project_id, user);
      if (projectRole === "unassigned") {
        return res.status(403).send({
          success: false,
          message: "You do not have permission to view tasks for this project",
        });
      }
    }

    const whereClause = {
      is_deleted: false,
    };

    if (project_id) {
      whereClause.project_id = project_id;
    } else if (!projectAuth.isProjectAdmin(user)) {
      const allowedIds = await projectAuth.getUserProjectIds(user);
      if (allowedIds !== null) {
        whereClause[Op.or] = [
          { project_id: { [Op.in]: allowedIds.length > 0 ? allowedIds : [-1] } },
          { assigned_to_id: user.employee_id },
          { reviewer_id: user.employee_id },
        ];
      }
    }

    if (status === "Overdue" || req.query.overdue === "true") {
      const today = new Date().toISOString().split("T")[0];
      whereClause.status = { [Op.ne]: "Completed" };
      whereClause.due_date = { [Op.lt]: today, [Op.ne]: null };
    } else if (status && status !== "All") {
      whereClause.status = status;
    }

    if (priority && priority !== "All") {
      whereClause.priority = priority;
    }

    if (assigned_to_id) {
      whereClause.assigned_to_id = assigned_to_id;
    }

    if (search) {
      whereClause[Op.or] = [
        { task_name: { [Op.like]: `%${search}%` } },
        { project_name: { [Op.like]: `%${search}%` } },
        { assigned_to_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const tasks = await Task.findAll({
      where: whereClause,
      order: [["task_id", "DESC"]],
    });

    let logMap = {};
    try {
      const [timeLogs] = await db.sequelize.query(
        "SELECT task_id, SUM(total_hours) AS consumed_hours, MIN(log_date) AS first_log_date, MAX(log_date) AS last_log_date FROM TIMESHEET_LOGS WHERE is_deleted = 0 GROUP BY task_id"
      );
      (timeLogs || []).forEach((l) => {
        logMap[l.task_id] = {
          consumed_hours: parseFloat(l.consumed_hours || 0),
          first_log_date: l.first_log_date,
          last_log_date: l.last_log_date,
        };
      });
    } catch (e) {
      console.error("Error fetching timesheet logs summary:", e);
    }

    const formattedTasks = tasks.map((t) => {
      const plain = t.get({ plain: true });
      plain.is_overdue = isOverdue(plain.due_date, plain.status);
      const hoursData = computeTaskConsumedHours(plain, logMap[plain.task_id]);
      plain.consumed_hours = hoursData.consumed_hours;
      plain.first_log_date = hoursData.first_log_date;
      plain.last_log_date = hoursData.last_log_date;
      return plain;
    });

    return res.status(200).send({
      success: true,
      data: formattedTasks,
      total: formattedTasks.length,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const user = await projectAuth.getAuthUser(req);
    if (user) {
      const projectRole = await projectAuth.getProjectRole(task.project_id, user);
      if (projectRole === "unassigned") {
        return res.status(403).send({
          success: false,
          message: "You do not have permission to view this task",
        });
      }
    }

    const plain = task.get({ plain: true });
    plain.is_overdue = isOverdue(plain.due_date, plain.status);
    let logData = null;
    try {
      const [logs] = await db.sequelize.query(
        "SELECT SUM(total_hours) AS consumed_hours, MIN(log_date) AS first_log_date, MAX(log_date) AS last_log_date FROM TIMESHEET_LOGS WHERE task_id = :taskId AND is_deleted = 0",
        { replacements: { taskId: id } }
      );
      if (logs && logs[0]) {
        logData = {
          consumed_hours: parseFloat(logs[0].consumed_hours || 0),
          first_log_date: logs[0].first_log_date,
          last_log_date: logs[0].last_log_date,
        };
      }
    } catch (e) {
      console.error("Error fetching task timesheet logs:", e);
    }

    const hoursData = computeTaskConsumedHours(plain, logData);
    plain.consumed_hours = hoursData.consumed_hours;
    plain.first_log_date = hoursData.first_log_date;
    plain.last_log_date = hoursData.last_log_date;

    return res.status(200).send({
      success: true,
      data: plain,
    });
  } catch (error) {
    console.error("Error retrieving task:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const projectRole = await projectAuth.getProjectRole(task.project_id, user);
    if (projectRole === "unassigned") {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to modify this task",
      });
    }

    if (projectRole === "member") {
      if (task.assigned_to_id != user.employee_id) {
        return res.status(403).send({
          success: false,
          message: "Team members can only update tasks assigned to them",
        });
      }

      if (
        (req.body.assigned_to_id !== undefined &&
          req.body.assigned_to_id != task.assigned_to_id) ||
        (req.body.priority !== undefined &&
          req.body.priority !== task.priority) ||
        (req.body.due_date !== undefined &&
          req.body.due_date != task.due_date) ||
        (req.body.start_date !== undefined &&
          req.body.start_date != task.start_date) ||
        (req.body.task_type !== undefined &&
          req.body.task_type !== task.task_type) ||
        (req.body.task_name !== undefined &&
          req.body.task_name !== task.task_name) ||
        (req.body.reviewer_id !== undefined &&
          req.body.reviewer_id != task.reviewer_id)
      ) {
        return res.status(403).send({
          success: false,
          message:
            "Team members are not allowed to edit task details. Only Project Head, Creator, or Admin can edit task details.",
        });
      }
    }

    const finalStartDate = req.body.start_date !== undefined ? req.body.start_date : task.start_date;
    const finalDueDate = req.body.due_date !== undefined ? req.body.due_date : task.due_date;
    if (finalStartDate && finalDueDate && new Date(finalDueDate) < new Date(finalStartDate)) {
      return res.status(400).send({
        success: false,
        message: "Task Due Date cannot be earlier than Start Date",
      });
    }

    const userName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "User";
    const actorRole =
      projectRole === "admin"
        ? "Admin"
        : projectRole === "head"
        ? "Project Head"
        : "Assignee";

    const changes = [];

    if (req.body.task_name && req.body.task_name.trim() !== task.task_name) {
      changes.push({
        message: `${userName} renamed task from "${task.task_name}" to "${req.body.task_name.trim()}"`,
        activity_type: "NAME_CHANGE",
        old_value: task.task_name,
        new_value: req.body.task_name.trim(),
      });
    }

    if (req.body.task_type && req.body.task_type !== task.task_type) {
      changes.push({
        message: `${userName} changed task type from "${task.task_type || "Task"}" to "${req.body.task_type}"`,
        activity_type: "TYPE_CHANGE",
        old_value: task.task_type || "Task",
        new_value: req.body.task_type,
      });
    }

    if (
      req.body.assigned_to_id !== undefined &&
      req.body.assigned_to_id != task.assigned_to_id
    ) {
      const newAssigneeId = req.body.assigned_to_id;
      if (newAssigneeId) {
        const valid = await isProjectMember(task.project_id, newAssigneeId);
        if (!valid) {
          return res.status(400).send({
            success: false,
            message:
              "Assigned employee must be an active member of this project",
          });
        }
      }
      const oldName = task.assigned_to_name || (task.assigned_to_id ? `Employee #${task.assigned_to_id}` : "Unassigned");
      const newName =
        req.body.assigned_to_name || (newAssigneeId ? `Employee #${newAssigneeId}` : "Unassigned");
      changes.push({
        message: `${userName} reassigned task from "${oldName}" to "${newName}"`,
        activity_type: "REASSIGNED",
        old_value: oldName,
        new_value: newName,
      });
    }

    if (
      req.body.reviewer_id !== undefined &&
      req.body.reviewer_id != task.reviewer_id
    ) {
      const oldReviewer = task.reviewer_name || (task.reviewer_id ? `Employee #${task.reviewer_id}` : "Not set");
      const newReviewer = req.body.reviewer_name || (req.body.reviewer_id ? `Employee #${req.body.reviewer_id}` : "Not set");
      changes.push({
        message: `${userName} changed reviewer from "${oldReviewer}" to "${newReviewer}"`,
        activity_type: "REVIEWER_CHANGE",
        old_value: oldReviewer,
        new_value: newReviewer,
      });
    }

    if (req.body.priority && req.body.priority !== task.priority) {
      changes.push({
        message: `${userName} changed priority from "${task.priority || "Medium"}" to "${req.body.priority}"`,
        activity_type: "PRIORITY_CHANGE",
        old_value: task.priority || "Medium",
        new_value: req.body.priority,
      });
    }

    if (req.body.status && req.body.status !== task.status) {
      if (task.status === "Completed") {
        if (projectRole !== "admin" && projectRole !== "head") {
          return res.status(403).send({
            success: false,
            message: "Reopening completed tasks is not allowed for team members. Only Project Head or Admin can reopen tasks.",
          });
        }
      }
      if (req.body.status === "Completed") {
        const currentReviewStatus =
          req.body.review_status || task.review_status;
        if (currentReviewStatus !== "Approved") {
          return res.status(400).send({
            success: false,
            message:
              "Task cannot be closed until it is approved by the reviewer",
          });
        }
      }
      changes.push({
        message: `${userName} changed status from "${task.status || "To Do"}" to "${req.body.status}"`,
        activity_type: "STATUS_CHANGE",
        old_value: task.status || "To Do",
        new_value: req.body.status,
      });
    }

    if (req.body.milestone_id !== undefined && req.body.milestone_id != task.milestone_id) {
      const oldMs = task.milestone_name || "None";
      const newMs = req.body.milestone_name || (req.body.milestone_id ? `Milestone #${req.body.milestone_id}` : "None");
      changes.push({
        message: `${userName} updated milestone from "${oldMs}" to "${newMs}"`,
        activity_type: "MILESTONE_CHANGE",
        old_value: oldMs,
        new_value: newMs,
      });
    }

    if (req.body.start_date !== undefined) {
      const oldStart = task.start_date ? String(task.start_date).split("T")[0] : "";
      const newStart = req.body.start_date ? String(req.body.start_date).split("T")[0] : "";
      if (oldStart !== newStart) {
        changes.push({
          message: `${userName} updated start date from ${oldStart || "None"} to ${newStart || "None"}`,
          activity_type: "START_DATE_CHANGE",
          old_value: oldStart || "None",
          new_value: newStart || "None",
        });
      }
    }

    if (req.body.due_date !== undefined) {
      const oldDue = task.due_date ? String(task.due_date).split("T")[0] : "";
      const newDue = req.body.due_date ? String(req.body.due_date).split("T")[0] : "";
      if (oldDue !== newDue) {
        changes.push({
          message: `${userName} updated due date from ${oldDue || "None"} to ${newDue || "None"}`,
          activity_type: "DUE_DATE_CHANGE",
          old_value: oldDue || "None",
          new_value: newDue || "None",
        });
      }
    }

    if (req.body.estimated_hours !== undefined) {
      const oldHrs = parseFloat(task.estimated_hours || 0);
      const newHrs = parseFloat(req.body.estimated_hours || 0);
      if (Math.abs(oldHrs - newHrs) > 0.001) {
        changes.push({
          message: `${userName} updated estimated hours from ${oldHrs} hrs to ${newHrs} hrs`,
          activity_type: "EST_HOURS_CHANGE",
          old_value: `${oldHrs} hrs`,
          new_value: `${newHrs} hrs`,
        });
      }
    }

    if (req.body.progress !== undefined) {
      const oldProg = parseInt(task.progress || 0, 10);
      const newProg = parseInt(req.body.progress || 0, 10);
      if (oldProg !== newProg) {
        changes.push({
          message: `${userName} updated progress from ${oldProg}% to ${newProg}%`,
          activity_type: "PROGRESS_CHANGE",
          old_value: `${oldProg}%`,
          new_value: `${newProg}%`,
        });
      }
    }

    if (
      req.body.description !== undefined &&
      (req.body.description || "").trim() !== (task.description || "").trim()
    ) {
      changes.push({
        message: `${userName} updated task description`,
        activity_type: "DESCRIPTION_CHANGE",
        old_value: task.description || "",
        new_value: req.body.description || "",
      });
    }

    for (const ch of changes) {
      await logActivity({
        task_id: task.task_id,
        user,
        message: ch.message,
        activity_type: ch.activity_type,
        action_type: "UPDATED",
        old_value: ch.old_value,
        new_value: ch.new_value,
        role: actorRole,
      });
    }

    const fieldsToUpdate = [
      "task_name",
      "task_type",
      "description",
      "project_id",
      "project_name",
      "assigned_to_id",
      "assigned_to_name",
      "assigned_to_email",
      "reviewer_id",
      "reviewer_name",
      "reviewer_email",
      "priority",
      "status",
      "review_status",
      "start_date",
      "due_date",
      "estimated_hours",
      "logged_hours",
      "progress",
      "milestone_id",
      "milestone_name",
      "completed_date",
    ];

    if (req.body.status === "Completed") {
      const currentReviewStatus = req.body.review_status || task.review_status;
      if (currentReviewStatus !== "Approved") {
        return res.status(400).send({
          success: false,
          message: "Task cannot be closed until it is approved by the reviewer",
        });
      }
    }

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const oldProjectId = task.project_id;

    if (req.body.milestone_id !== undefined) {
      if (req.body.milestone_id) {
        const targetProjectId = req.body.project_id || task.project_id;
        const ms = await ProjectMilestone.findOne({
          where: {
            project_id: targetProjectId,
            is_deleted: false,
            [Op.or]: [
              { id: req.body.milestone_id },
              { milestone_id: req.body.milestone_id },
              { milestone_code: req.body.milestone_id },
            ],
          },
        });
        if (!ms) {
          return res.status(400).send({
            success: false,
            message: "Selected milestone does not belong to this project or does not exist",
          });
        }
        task.milestone_id = ms.id;
        task.milestone_name = ms.name;
      } else {
        task.milestone_id = null;
        task.milestone_name = null;
      }
    } else if (req.body.project_id && req.body.project_id != task.project_id && task.milestone_id) {
      // Task moved to another project, clear incompatible milestone
      const ms = await ProjectMilestone.findOne({
        where: { id: task.milestone_id, project_id: req.body.project_id, is_deleted: false },
      });
      if (!ms) {
        task.milestone_id = null;
        task.milestone_name = null;
      }
    }

    if (task.status === "In Review" && task.review_status === "Pending") {
      task.review_status = "Submitted";
    }

    if (
      req.body.status &&
      req.body.status !== "Completed" &&
      task.status === "Completed"
    ) {
      task.review_status = "Pending";
      task.completed_date = null;
    }

    if (task.status === "Completed") {
      task.progress = 100;
      if (!task.completed_date) {
        task.completed_date = req.body.completed_date || new Date().toISOString().split("T")[0];
      }
    } else {
      task.completed_date = null;
    }

    await task.save();

    await recalculateProjectAndMilestones(task.project_id);
    if (oldProjectId && oldProjectId != task.project_id) {
      await recalculateProjectAndMilestones(oldProjectId);
    }

    return res.status(200).send({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.reviewTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments, reviewed_by } = req.body;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const projectRole = await projectAuth.getProjectRole(task.project_id, user);
    if (projectRole === "unassigned") {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to review tasks for this project",
      });
    }

    if (
      (action === "approve" || action === "reject" || action === "request_changes") &&
      projectRole === "member" &&
      task.reviewer_id != user.employee_id
    ) {
      return res.status(403).send({
        success: false,
        message: "Only the designated reviewer, Project Head, or Admin can review/approve tasks",
      });
    }

    if (!action) {
      return res.status(400).send({
        success: false,
        message: "Action ('submit', 'approve', or 'request_changes') is required",
      });
    }

    let activityMessage = "";
    if (action === "submit") {
      task.status = "In Review";
      task.review_status = "Submitted";
      if (comments) task.review_comments = comments;
      activityMessage = `${user.first_name || "User"} submitted task for review${
        comments ? ': "' + comments + '"' : ""
      }`;
    } else if (action === "approve") {
      task.review_status = "Approved";
      task.status = "Completed";
      task.progress = 100;
      task.reviewed_at = new Date();
      if (reviewed_by) task.reviewed_by = reviewed_by;
      if (comments) task.review_comments = comments;
      activityMessage = `${user.first_name || "Reviewer"} approved this task${
        comments ? ': "' + comments + '"' : ""
      }`;
    } else if (action === "reject" || action === "request_changes") {
      task.review_status = "Changes Requested";
      task.status = "In Progress";
      task.reviewed_at = new Date();
      if (reviewed_by) task.reviewed_by = reviewed_by;
      if (comments) task.review_comments = comments;
      activityMessage = `${user.first_name || "Reviewer"} requested changes${
        comments ? ': "' + comments + '"' : ""
      }`;
    } else {
      return res.status(400).send({
        success: false,
        message: `Invalid action '${action}'. Valid actions are submit, approve, request_changes`,
      });
    }

    await task.save();
    await recalculateProjectAndMilestones(task.project_id);

    await logActivity({
      task_id: task.task_id,
      user,
      message: activityMessage,
      activity_type: "REVIEW_ACTION",
      action_type: action,
      role:
        projectRole === "admin"
          ? "Admin"
          : projectRole === "head"
          ? "Project Head"
          : task.reviewer_id == user.employee_id
          ? "Reviewer"
          : "Assignee",
    });

    return res.status(200).send({
      success: true,
      message:
        action === "approve"
          ? "Task approved and closed successfully"
          : action === "submit"
          ? "Task submitted for reviewer approval"
          : "Changes requested from assignee",
      data: task,
    });
  } catch (error) {
    console.error("Error reviewing task:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while reviewing task",
      error: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const projectRole = await projectAuth.getProjectRole(task.project_id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({
        success: false,
        message: "Only the Project Head or Admin can delete tasks",
      });
    }

    task.is_deleted = true;
    await task.save();
    await recalculateProjectAndMilestones(task.project_id);

    return res.status(200).send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const projectRole = await projectAuth.getProjectRole(task.project_id, user);
    if (projectRole === "unassigned") {
      return res.status(403).send({
        success: false,
        message:
          "You do not have permission to view activity for this task",
      });
    }

    const activities = await TaskComment.findAll({
      where: { task_id: id, is_deleted: false },
      order: [["comment_id", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      data: activities,
      total: activities.length,
    });
  } catch (error) {
    console.error("Error retrieving task activity:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const message = req.body.message || req.body.comment;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).send({
        success: false,
        message: "Comment message cannot be empty",
      });
    }

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const projectRole = await projectAuth.getProjectRole(task.project_id, user);
    if (projectRole === "unassigned") {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to comment on this task",
      });
    }

    const senderRole =
      projectRole === "admin"
        ? "Admin"
        : projectRole === "head"
        ? "Project Head"
        : task.assigned_to_id == user.employee_id
        ? "Assignee"
        : task.reviewer_id == user.employee_id
        ? "Reviewer"
        : "Team Member";

    const comment = await TaskComment.create({
      task_id: id,
      sender_id: user.employee_id,
      sender_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      sender_email: user.employee_official_email || null,
      sender_role: senderRole,
      message: message.trim(),
      action_type: "comment",
      activity_type: "COMMENT",
      is_edited: false,
      is_deleted: false,
    });

    return res.status(201).send({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const message = req.body.message || req.body.comment;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).send({
        success: false,
        message: "Comment message cannot be empty",
      });
    }

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });
    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const projectRole = await projectAuth.getProjectRole(task.project_id, user);
    if (projectRole === "unassigned") {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to access this task",
      });
    }

    const comment = await TaskComment.findOne({
      where: { comment_id: commentId, task_id: id, is_deleted: false },
    });

    if (!comment) {
      return res.status(404).send({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.activity_type !== "COMMENT") {
      return res.status(400).send({
        success: false,
        message: "System activity entries cannot be edited",
      });
    }

    if (
      comment.sender_id != user.employee_id &&
      projectRole !== "admin"
    ) {
      return res.status(403).send({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    comment.message = message.trim();
    comment.is_edited = true;
    await comment.save();

    return res.status(200).send({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });
    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const projectRole = await projectAuth.getProjectRole(task.project_id, user);
    if (projectRole === "unassigned") {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to access this task",
      });
    }

    const comment = await TaskComment.findOne({
      where: { comment_id: commentId, task_id: id, is_deleted: false },
    });

    if (!comment) {
      return res.status(404).send({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.activity_type !== "COMMENT") {
      return res.status(400).send({
        success: false,
        message: "System activity entries cannot be deleted",
      });
    }

    if (
      comment.sender_id != user.employee_id &&
      projectRole !== "admin" &&
      projectRole !== "head"
    ) {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to delete this comment",
      });
    }

    comment.is_deleted = true;
    await comment.save();

    return res.status(200).send({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
