const db = require("../../../models");
const Project = db.project;
const ProjectMember = db.projectMember;
const Task = db.task;
const User = db.user;
const Department = db.Master_Department || db.department;
const { Op } = require("sequelize");

const isOverdue = (endDate, status) => {
  if (!endDate) return false;
  if (status === "Completed" || status === "Cancelled") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return end < today;
};

exports.createProject = async (req, res) => {
  try {
    const {
      project_name,
      project_code,
      client_name,
      billing_method,
      priority,
      description,
      department_id,
      department_name,
      project_manager_id,
      project_manager_name,
      project_manager_email,
      start_date,
      end_date,
      initial_progress,
      budget,
      created_by,
      members,
    } = req.body;

    if (!project_name) {
      return res.status(400).send({
        success: false,
        message: "Project name is required",
      });
    }

    const generatedCode =
      project_code ||
      `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProject = await Project.create({
      project_name,
      project_code: generatedCode,
      client_name: client_name || "",
      billing_method: billing_method || "Fixed Cost",
      priority: priority || "Medium",
      description: description || project_name,
      department_id: department_id || null,
      department_name: department_name || "",
      project_manager_id: project_manager_id || null,
      project_manager_name: project_manager_name || "",
      project_manager_email: project_manager_email || "",
      start_date: start_date || null,
      end_date: end_date || null,
      initial_progress: initial_progress || 0,
      progress: initial_progress || 0,
      budget: budget || 0.0,
      spent: 0.0,
      profit_loss: budget || 0.0,
      status: "Active",
      is_active: true,
      is_deleted: false,
      created_by: created_by || null,
    });

    if (Array.isArray(members) && members.length > 0) {
      const memberRecords = members.map((m) => {
        if (typeof m === "object") {
          return {
            project_id: newProject.project_id,
            employee_id: m.employee_id,
            employee_name: m.employee_name || m.name || "",
            employee_email: m.employee_email || m.email || "",
            role: m.role || "Member",
            is_active: true,
          };
        } else {
          return {
            project_id: newProject.project_id,
            employee_id: m,
            employee_name: "",
            employee_email: "",
            role: "Member",
            is_active: true,
          };
        }
      });
      await ProjectMember.bulkCreate(memberRecords);
    }

    return res.status(201).send({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while creating project",
      error: error.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { search, department, status } = req.query;

    const whereClause = {
      is_deleted: false,
    };

    if (status) {
      whereClause.status = status;
    }

    if (department) {
      whereClause.department_name = department;
    }

    if (search) {
      whereClause[Op.or] = [
        { project_name: { [Op.like]: `%${search}%` } },
        { department_name: { [Op.like]: `%${search}%` } },
        { project_manager_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const projects = await Project.findAll({
      where: whereClause,
      order: [["project_id", "DESC"]],
    });

    const formattedProjects = projects.map((p) => {
      const plain = p.get({ plain: true });
      plain.is_overdue = isOverdue(plain.end_date, plain.status);
      return plain;
    });

    return res.status(200).send({
      success: true,
      message: "Projects retrieved successfully",
      data: formattedProjects,
      total: formattedProjects.length,
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while fetching projects",
      error: error.message,
    });
  }
};

exports.getNextProjectCode = async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ["project_id", "project_code"],
      order: [["project_id", "DESC"]],
      limit: 100,
    });

    let maxNum = 1000;
    for (const p of projects) {
      if (p.project_code && typeof p.project_code === "string" && p.project_code.startsWith("PRJ-")) {
        const numPart = parseInt(p.project_code.replace("PRJ-", ""), 10);
        if (!isNaN(numPart) && numPart > maxNum && numPart < 99999) {
          maxNum = numPart;
        }
      }
    }

    const nextCode = `PRJ-${maxNum + 1}`;
    return res.status(200).send({
      success: true,
      data: { project_code: nextCode },
    });
  } catch (error) {
    console.error("Error generating next project code:", error);
    const fallbackCode = `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;
    return res.status(200).send({
      success: true,
      data: { project_code: fallbackCode },
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { project_id: id, is_deleted: false },
    });

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    const plainProject = project.get({ plain: true });
    plainProject.is_overdue = isOverdue(plainProject.end_date, plainProject.status);

    const members = await ProjectMember.findAll({
      where: { project_id: id, is_active: true },
      order: [["id", "ASC"]],
    });

    const tasks = await Task.findAll({
      where: { project_id: id, is_deleted: false },
      order: [["task_id", "DESC"]],
    });

    plainProject.members = members;
    plainProject.tasks = tasks;
    plainProject.task_count = tasks.length;
    plainProject.completed_task_count = tasks.filter((t) => t.status === "Completed").length;

    const budgetVal = parseFloat(plainProject.budget) || 0;
    const spentVal = parseFloat(plainProject.spent) || 0;
    plainProject.profit_loss = budgetVal - spentVal;

    return res.status(200).send({
      success: true,
      data: plainProject,
    });
  } catch (error) {
    console.error("Error retrieving project:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({
      where: { project_id: id, is_deleted: false },
    });

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    const fieldsToUpdate = [
      "project_name",
      "project_code",
      "client_name",
      "billing_method",
      "priority",
      "description",
      "department_id",
      "department_name",
      "project_manager_id",
      "project_manager_name",
      "project_manager_email",
      "start_date",
      "end_date",
      "initial_progress",
      "progress",
      "budget",
      "spent",
      "profit_loss",
      "status",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    return res.status(200).send({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({
      where: { project_id: id, is_deleted: false },
    });

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    project.is_deleted = true;
    await project.save();

    return res.status(200).send({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, employee_name, employee_email, department_name, role_in_project } = req.body;

    if (!employee_id) {
      return res.status(400).send({
        success: false,
        message: "Employee is required",
      });
    }

    const existing = await ProjectMember.findOne({
      where: {
        project_id: id,
        employee_id,
        is_active: true,
      },
    });

    if (existing) {
      return res.status(400).send({
        success: false,
        message: "This employee is already assigned to this project",
      });
    }

    const newMember = await ProjectMember.create({
      project_id: id,
      employee_id,
      employee_name: employee_name || "",
      employee_email: employee_email || "",
      department_name: department_name || "",
      role_in_project: role_in_project || "Member",
      assigned_date: new Date(),
      is_active: true,
    });

    return res.status(201).send({
      success: true,
      message: "Member added successfully",
      data: newMember,
    });
  } catch (error) {
    console.error("Error adding project member:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getProjectMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await ProjectMember.findAll({
      where: { project_id: id, is_active: true },
      order: [["id", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Error getting project members:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.removeProjectMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const member = await ProjectMember.findOne({
      where: { id: memberId, project_id: id },
    });

    if (!member) {
      return res.status(404).send({
        success: false,
        message: "Member not found",
      });
    }

    member.is_active = false;
    await member.save();

    return res.status(200).send({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error removing project member:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getEmployeesForDropdown = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
      attributes: [
        "employee_id",
        "employee_code",
        "first_name",
        "middle_name",
        "last_name",
        "employee_official_email",
        "emp_personal_email",
        "role_master_name",
      ],
      order: [["first_name", "ASC"]],
    });

    const cleanStr = (str) => {
      if (!str) return "";
      return str
        .replace(/ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ/g, " - ")
        .replace(/ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â/g, "")
        .replace(/ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œ/g, "'")
        .replace(/[^\x20-\x7E]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    };

    const formatted = users.map((u) => {
      const parts = [cleanStr(u.first_name), cleanStr(u.middle_name), cleanStr(u.last_name)].filter(Boolean);
      let fullName = parts.join(" ");
      if (!fullName) {
        fullName = u.employee_code ? `Employee (${u.employee_code})` : `Emp #${u.employee_id}`;
      }
      const roleName = cleanStr(u.role_master_name) || "Staff";
      const email = u.employee_official_email || u.emp_personal_email || "";

      return {
        employee_id: u.employee_id,
        employee_code: u.employee_code || "",
        first_name: cleanStr(u.first_name),
        middle_name: cleanStr(u.middle_name),
        last_name: cleanStr(u.last_name),
        name: fullName,
        fullName: fullName,
        employee_name: fullName,
        email: email,
        official_email: email,
        department: roleName,
        designation: roleName,
        role_name: roleName,
        displayText: `${fullName} (${roleName})`,
      };
    });

    return res.status(200).send({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching employees for dropdown:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getDepartmentsForDropdown = async (req, res) => {
  try {
    let rows = [];
    if (db.MASTER_DEPARTMENT) {
      rows = await db.MASTER_DEPARTMENT.findAll({
        where: { isDeleted: false, status: "ACTIVE" },
        attributes: ["dept_id", "department_name"],
        order: [["department_name", "ASC"]],
      });
    } else {
      const [results] = await db.sequelize.query(
        "SELECT dept_id, department_name FROM MASTER_DEPARTMENT WHERE isDeleted=0 AND status='ACTIVE' ORDER BY department_name ASC"
      );
      rows = results;
    }

    const map = new Map();
    for (const r of rows) {
      const name = (r.department_name || "")
        .replace(/[\t\r\n]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          dept_id: r.dept_id,
          department_name: name,
        });
      }
    }

    const uniqueDepartments = Array.from(map.values()).sort((a, b) =>
      a.department_name.localeCompare(b.department_name)
    );

    return res.status(200).send({
      success: true,
      data: uniqueDepartments,
      total: uniqueDepartments.length,
    });
  } catch (error) {
    console.error("Error fetching departments for dropdown:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

