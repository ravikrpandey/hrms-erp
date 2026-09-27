const db = require("../../../models");
const Task = db.task;
const Project = db.project;
const { Op } = require("sequelize");

const isOverdue = (dueDate, status) => {
  if (!dueDate) return false;
  if (status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

exports.createTask = async (req, res) => {
  try {
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
      progress,
      created_by,
    } = req.body;

    if (!task_name) {
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

    let pName = project_name;
    let rId = reviewer_id;
    let rName = reviewer_name;
    let rEmail = reviewer_email;

    const project = await Project.findOne({ where: { project_id } });
    if (project) {
      if (!pName) pName = project.project_name;
      if (!rId && project.project_manager_id) {
        rId = project.project_manager_id;
        rName = project.project_manager_name;
        rEmail = project.project_manager_email;
      }
    }

    const initialReviewStatus = (status === "In Review") ? "Submitted" : (status === "Completed") ? "Approved" : "Pending";

    const newTask = await Task.create({
      project_id,
      project_name: pName || "",
      task_name,
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
      start_date: start_date || null,
      due_date: due_date || null,
      estimated_hours: estimated_hours || 0,
      logged_hours: 0,
      progress: progress || 0,
      is_active: true,
      is_deleted: false,
      created_by: created_by || null,
    });

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

    const whereClause = {
      is_deleted: false,
    };

    if (project_id) {
      whereClause.project_id = project_id;
    }

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
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

    const formattedTasks = tasks.map((t) => {
      const plain = t.get({ plain: true });
      plain.is_overdue = isOverdue(plain.due_date, plain.status);
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

    const plain = task.get({ plain: true });
    plain.is_overdue = isOverdue(plain.due_date, plain.status);

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
    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const fieldsToUpdate = [
      "task_name",
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

    if (task.status === "In Review" && task.review_status === "Pending") {
      task.review_status = "Submitted";
    }

    if (req.body.status && req.body.status !== "Completed" && task.status === "Completed") {
      task.review_status = "Pending";
    }

    if (task.status === "Completed") {
      task.progress = 100;
    }

    await task.save();

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

    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    if (!action) {
      return res.status(400).send({
        success: false,
        message: "Action ('submit', 'approve', or 'request_changes') is required",
      });
    }

    if (action === "submit") {
      task.status = "In Review";
      task.review_status = "Submitted";
      if (comments) task.review_comments = comments;
    } else if (action === "approve") {
      task.review_status = "Approved";
      task.status = "Completed";
      task.progress = 100;
      task.reviewed_at = new Date();
      if (reviewed_by) task.reviewed_by = reviewed_by;
      if (comments) task.review_comments = comments;
    } else if (action === "reject" || action === "request_changes") {
      task.review_status = "Changes Requested";
      task.status = "In Progress";
      task.reviewed_at = new Date();
      if (reviewed_by) task.reviewed_by = reviewed_by;
      if (comments) task.review_comments = comments;
    } else {
      return res.status(400).send({
        success: false,
        message: `Invalid action '${action}'. Valid actions are submit, approve, request_changes`,
      });
    }

    await task.save();

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
    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    task.is_deleted = true;
    await task.save();

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

