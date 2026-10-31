const db = require("../../../models");
const Project = db.project;
const ProjectMember = db.projectMember;
const Task = db.task;
const ProjectMilestone = db.projectMilestone;
const User = db.user;
const Department = db.Master_Department || db.department;
const { Op } = require("sequelize");
const projectAuth = require("../middleware/projectAuth");
const { recalculateProjectAndMilestones } = require("../services/milestoneProgressService");

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
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    if (!(await projectAuth.canCreateProject(user))) {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to create projects",
      });
    }

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
      supervisor_id,
      supervisor_name,
      supervisor_email,
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

    if (budget !== undefined && parseFloat(budget) < 0) {
      return res.status(400).send({
        success: false,
        message: "Budget cannot be negative",
      });
    }

    if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
      return res.status(400).send({
        success: false,
        message: "Project End Date cannot be earlier than Start Date",
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
      project_type: req.body.project_type || "Client Project",
      priority: priority || "Medium",
      description: description || project_name,
      department_id: department_id || null,
      department_name: department_name || "",
      project_manager_id: project_manager_id || null,
      project_manager_name: project_manager_name || "",
      project_manager_email: project_manager_email || "",
      supervisor_id: supervisor_id || null,
      supervisor_name: supervisor_name || "",
      supervisor_email: supervisor_email || "",
      start_date: start_date || null,
      end_date: end_date || null,
      initial_progress: initial_progress || 0,
      progress: initial_progress || 0,
      budget: budget !== undefined ? parseFloat(budget) : 0.0,
      recognized_revenue: req.body.recognized_revenue !== undefined ? parseFloat(req.body.recognized_revenue) : 0.0,
      currency: req.body.currency || "INR",
      spent: 0.0,
      profit_loss: req.body.recognized_revenue !== undefined ? parseFloat(req.body.recognized_revenue) : 0.0,
      status: "Active",
      is_active: true,
      is_deleted: false,
      created_by: created_by || user.employee_id,
    });

    if (Array.isArray(members) && members.length > 0) {
      const memberRecords = members.map((m) => {
        if (typeof m === "object" && m !== null) {
          return {
            project_id: newProject.project_id,
            employee_id: m.employee_id,
            employee_name: m.employee_name || m.name || "",
            employee_email: m.employee_email || m.email || "",
            department_name: m.department_name || m.department || "",
            role_in_project: m.role_in_project || m.role || "Member",
            hourly_rate: m.hourly_rate !== undefined && m.hourly_rate !== null ? parseFloat(m.hourly_rate) : null,
            is_active: true,
          };
        } else {
          return {
            project_id: newProject.project_id,
            employee_id: m,
            employee_name: "",
            employee_email: "",
            department_name: "",
            role_in_project: "Member",
            hourly_rate: null,
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

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const whereClause = {
      is_deleted: false,
    };

    if (user) {
      const allowedIds = await projectAuth.getUserProjectIds(user);
      if (allowedIds !== null) {
        if (allowedIds.length === 0) {
          return res.status(200).send({
            success: true,
            message: "Projects retrieved successfully",
            data: [],
            total: 0,
          });
        }
        whereClause.project_id = { [Op.in]: allowedIds };
      }
    }

    if (req.query.status_type === "open" || req.query.open_only === "true") {
      whereClause.status = { [Op.notIn]: ["Completed", "Cancelled"] };
    } else if (status) {
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
        { supervisor_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const projects = await Project.findAll({
      where: whereClause,
      order: [["project_id", "DESC"]],
    });

    let costMap = {};
    try {
      const [costRows] = await db.sequelize.query(
        `SELECT project_id,
          COALESCE(SUM(amount), 0) AS total_spent,
          COALESCE(SUM(CASE WHEN source_type = 'TIMESHEET_LABOR' THEN amount ELSE 0 END), 0) AS labor_cost,
          COALESCE(SUM(CASE WHEN source_type = 'PROJECT_EXPENSE' THEN amount ELSE 0 END), 0) AS expense_cost
         FROM PROJECT_COST_TRANSACTIONS
         WHERE posting_status = 'POSTED'
         GROUP BY project_id`
      );
      if (costRows) {
        costRows.forEach((r) => {
          costMap[r.project_id] = {
            spent: parseFloat(r.total_spent) || 0,
            labor_cost: parseFloat(r.labor_cost) || 0,
            expense_cost: parseFloat(r.expense_cost) || 0,
          };
        });
      }
    } catch (costErr) {
      console.error("Error fetching cost transactions map in getAllProjects:", costErr);
    }

    const isUserAdmin = projectAuth.isProjectAdmin(user);
    const userEmpId = user ? user.employee_id : null;
    const userRoleName = (user?.role_master_name || "").toLowerCase();
    const isProjectHeadRole = userRoleName.includes("project head") || userRoleName.includes("head");

    const formattedProjects = projects.map((p) => {
      const plain = p.get({ plain: true });
      plain.is_overdue = isOverdue(plain.end_date, plain.status);

      const costs = costMap[plain.project_id] || { spent: 0, labor_cost: 0, expense_cost: 0 };
      const actualSpent = Math.max(parseFloat(plain.spent) || 0, costs.spent);
      const budgetVal = parseFloat(plain.budget) || 0;
      const revVal = parseFloat(plain.recognized_revenue) || 0;
      const financialBalance = Math.round((budgetVal - actualSpent) * 100) / 100;
      plain.spent = actualSpent;
      plain.burned_amount = actualSpent;
      plain.labor_cost = costs.labor_cost;
      plain.expense_cost = costs.expense_cost;
      plain.financial_balance = financialBalance;
      plain.available_budget = Math.max(0, financialBalance);
      plain.overspending_amount = Math.max(0, Math.round((actualSpent - budgetVal) * 100) / 100);
      plain.is_over_budget = actualSpent > budgetVal;
      plain.recognized_revenue = revVal;
      plain.profit_loss = revVal > 0 ? Math.round((revVal - actualSpent) * 100) / 100 : null;
      plain.profit_loss_status = revVal > 0 ? "RECOGNIZED" : "UNVERIFIED";
      plain.budget_utilization_pct = budgetVal > 0 ? Math.round((actualSpent / budgetVal) * 1000) / 10 : 0;

      const isHeadOrAdmin =
        isUserAdmin ||
        isProjectHeadRole ||
        plain.project_manager_id == userEmpId ||
        plain.supervisor_id == userEmpId ||
        plain.created_by == userEmpId;
      if (!isHeadOrAdmin) {
        plain.budget = null;
        plain.spent = null;
        plain.available_budget = null;
        plain.labor_cost = null;
        plain.expense_cost = null;
        plain.profit_loss = null;
        plain.budget_utilization_pct = null;
      }
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

    const user = await projectAuth.getAuthUser(req);
    const userEmpId = user ? user.employee_id : null;
    const projectRole = await projectAuth.getProjectRole(id, user);

    if (projectRole === null) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    const userRoleName = (user?.role_master_name || "").toLowerCase();
    const isFinanceRole = userRoleName.includes("finance") || userRoleName.includes("account");

    if (projectRole === "unassigned" && !isFinanceRole) {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to access this project",
      });
    }

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
    plainProject.user_role = projectRole;
    plainProject.is_overdue = isOverdue(plainProject.end_date, plainProject.status);

    const [members] = await db.sequelize.query(
      `SELECT 
        pm.id,
        pm.project_id,
        pm.employee_id,
        pm.employee_name,
        pm.employee_email,
        COALESCE(NULLIF(pm.department_name, ''), d.department_name, '') AS department_name,
        pm.role_in_project,
        pm.hourly_rate,
        pm.assigned_date,
        pm.is_active,
        pm.createdAt,
        pm.updatedAt
      FROM PROJECT_MEMBERS pm
      LEFT JOIN HRMS_REGISTERED_USER u ON pm.employee_id = u.employee_id
      LEFT JOIN MASTER_DEPARTMENT d ON u.department_id = d.dept_id
      WHERE pm.project_id = :projectId AND pm.is_active = 1
      ORDER BY pm.id ASC`,
      { replacements: { projectId: id } }
    );

    const isHeadOrAdminRole = projectRole === "admin" || projectRole === "head";
    const canViewMemberRates = isHeadOrAdminRole || isFinanceRole;

    plainProject.members = (members || []).map((m) => {
      if (!canViewMemberRates && m.employee_id !== userEmpId) {
        return { ...m, hourly_rate: null };
      }
      return m;
    });

    const tasks = await Task.findAll({
      where: { project_id: id, is_deleted: false },
      order: [["task_id", "DESC"]],
    });

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    let progressSummary = null;
    try {
      progressSummary = await recalculateProjectAndMilestones(id);
    } catch (e) {
      console.error("Error calculating milestone progress in getProjectById:", e);
    }

    plainProject.tasks = tasks;
    plainProject.milestones = progressSummary ? progressSummary.milestones : [];
    plainProject.progress = progressSummary ? progressSummary.projectProgress : (plainProject.progress || 0);
    plainProject.task_count = tasks.length;
    plainProject.completed_task_count = tasks.filter((t) => t.status === "Completed").length;
    plainProject.total_milestone_count = plainProject.milestones.length;
    plainProject.completed_milestone_count = plainProject.milestones.filter((m) => m.status === "Completed").length;
    plainProject.overdue_task_count = tasks.filter(
      (t) => t.status !== "Completed" && t.due_date && new Date(t.due_date) < todayDate
    ).length;

    const budgetVal = parseFloat(plainProject.budget) || 0;
    let spentVal = parseFloat(plainProject.spent) || 0;
    let laborCost = 0;
    let expenseCost = 0;
    try {
      const [costRows] = await db.sequelize.query(
        `SELECT 
          COALESCE(SUM(amount), 0) AS total_spent,
          COALESCE(SUM(CASE WHEN source_type = 'TIMESHEET_LABOR' THEN amount ELSE 0 END), 0) AS labor_cost,
          COALESCE(SUM(CASE WHEN source_type = 'PROJECT_EXPENSE' THEN amount ELSE 0 END), 0) AS expense_cost
         FROM PROJECT_COST_TRANSACTIONS 
         WHERE project_id = :projectId AND posting_status = 'POSTED'`,
        { replacements: { projectId: id } }
      );
      if (costRows && costRows.length > 0) {
        const totalFromLedger = parseFloat(costRows[0].total_spent) || 0;
        spentVal = Math.max(spentVal, totalFromLedger);
        laborCost = parseFloat(costRows[0].labor_cost) || 0;
        expenseCost = parseFloat(costRows[0].expense_cost) || 0;
      }
    } catch (e) {
      console.error("Error retrieving ledger costs in getProjectById:", e);
    }

    const financialBalance = Math.round((budgetVal - spentVal) * 100) / 100;
    const revVal = parseFloat(plainProject.recognized_revenue) || 0;
    plainProject.budget = budgetVal;
    plainProject.currency = plainProject.currency || "INR";
    plainProject.recognized_revenue = revVal;
    plainProject.spent = spentVal;
    plainProject.burned_amount = spentVal;
    plainProject.labor_cost = laborCost;
    plainProject.expense_cost = expenseCost;
    plainProject.financial_balance = financialBalance;
    plainProject.available_budget = Math.max(0, financialBalance);
    plainProject.overspending_amount = Math.max(0, Math.round((spentVal - budgetVal) * 100) / 100);
    plainProject.is_over_budget = spentVal > budgetVal;
    plainProject.profit_loss = revVal > 0 ? Math.round((revVal - spentVal) * 100) / 100 : null;
    plainProject.profit_loss_status = revVal > 0 ? "RECOGNIZED" : "UNVERIFIED";
    plainProject.budget_utilization_pct = budgetVal > 0 ? Math.round((spentVal / budgetVal) * 1000) / 10 : 0;
    plainProject.user_role = projectRole;

    const isHeadOrAdmin = projectRole === "admin" || projectRole === "head";
    const canViewFinancials = isHeadOrAdmin || isFinanceRole;
    if (!canViewFinancials) {
      plainProject.budget = null;
      plainProject.spent = null;
      plainProject.burned_amount = null;
      plainProject.available_budget = null;
      plainProject.labor_cost = null;
      plainProject.expense_cost = null;
      plainProject.recognized_revenue = null;
      plainProject.profit_loss = null;
      plainProject.budget_utilization_pct = null;
    }

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

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole === null) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({
        success: false,
        message: "Only the Project Head or Admin can update project details",
      });
    }

    const project = await Project.findOne({
      where: { project_id: id, is_deleted: false },
    });

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    const finalStartDate = req.body.start_date !== undefined ? req.body.start_date : project.start_date;
    const finalEndDate = req.body.end_date !== undefined ? req.body.end_date : project.end_date;
    if (finalStartDate && finalEndDate && new Date(finalEndDate) < new Date(finalStartDate)) {
      return res.status(400).send({
        success: false,
        message: "Project End Date cannot be earlier than Start Date",
      });
    }

    if (req.body.budget !== undefined && parseFloat(req.body.budget) < 0) {
      return res.status(400).send({
        success: false,
        message: "Budget cannot be negative",
      });
    }

    const fieldsToUpdate = [
      "project_name",
      "project_code",
      "client_name",
      "billing_method",
      "project_type",
      "priority",
      "description",
      "department_id",
      "department_name",
      "project_manager_id",
      "project_manager_name",
      "project_manager_email",
      "supervisor_id",
      "supervisor_name",
      "supervisor_email",
      "start_date",
      "end_date",
      "initial_progress",
      "progress",
      "budget",
      "recognized_revenue",
      "currency",
      "status",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    const currentRevenue = parseFloat(project.recognized_revenue) || 0;
    const currentSpent = parseFloat(project.spent) || 0;
    project.profit_loss = Math.round((currentRevenue - currentSpent) * 100) / 100;

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

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    if (!projectAuth.isProjectAdmin(user)) {
      return res.status(403).send({
        success: false,
        message: "Only an Admin can delete projects",
      });
    }

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

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({
        success: false,
        message: "Only the Project Head or Admin can manage project members",
      });
    }

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

    let resolvedDept = department_name || "";
    if (!resolvedDept) {
      const [uRows] = await db.sequelize.query(
        `SELECT d.department_name 
         FROM HRMS_REGISTERED_USER u 
         LEFT JOIN MASTER_DEPARTMENT d ON u.department_id = d.dept_id 
         WHERE u.employee_id = :empId LIMIT 1`,
        { replacements: { empId: employee_id } }
      );
      if (uRows && uRows.length > 0 && uRows[0].department_name) {
        resolvedDept = uRows[0].department_name;
      }
    }

    const newMember = await ProjectMember.create({
      project_id: id,
      employee_id,
      employee_name: employee_name || "",
      employee_email: employee_email || "",
      department_name: resolvedDept,
      role_in_project: role_in_project || "Member",
      hourly_rate: req.body.hourly_rate !== undefined && req.body.hourly_rate !== null ? parseFloat(req.body.hourly_rate) : null,
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

    const user = await projectAuth.getAuthUser(req);
    const projectRole = await projectAuth.getProjectRole(id, user);

    if (projectRole === null) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    const userRoleName = (user?.role_master_name || "").toLowerCase();
    const isFinanceRole = userRoleName.includes("finance") || userRoleName.includes("account");

    if (projectRole === "unassigned" && !isFinanceRole) {
      return res.status(403).send({
        success: false,
        message: "You do not have permission to view members of this project",
      });
    }

    const [members] = await db.sequelize.query(
      `SELECT 
        pm.id,
        pm.project_id,
        pm.employee_id,
        pm.employee_name,
        pm.employee_email,
        COALESCE(NULLIF(pm.department_name, ''), d.department_name, '') AS department_name,
        pm.role_in_project,
        pm.hourly_rate,
        pm.assigned_date,
        pm.is_active,
        pm.createdAt,
        pm.updatedAt
      FROM PROJECT_MEMBERS pm
      LEFT JOIN HRMS_REGISTERED_USER u ON pm.employee_id = u.employee_id
      LEFT JOIN MASTER_DEPARTMENT d ON u.department_id = d.dept_id
      WHERE pm.project_id = :projectId AND pm.is_active = 1
      ORDER BY pm.id ASC`,
      { replacements: { projectId: id } }
    );

    const isHeadOrAdminRole = projectRole === "admin" || projectRole === "head";
    const canViewMemberRates = isHeadOrAdminRole || isFinanceRole;

    const sanitizedMembers = (members || []).map((m) => {
      if (!canViewMemberRates && m.employee_id !== user.employee_id) {
        return { ...m, hourly_rate: null };
      }
      return m;
    });

    return res.status(200).send({
      success: true,
      data: sanitizedMembers,
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

exports.updateProjectMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({
        success: false,
        message: "Only the Project Head or Admin can update project member configuration",
      });
    }

    const member = await ProjectMember.findOne({
      where: {
        [Op.or]: [{ id: memberId }, { employee_id: memberId }],
        project_id: id,
        is_active: true,
      },
    });

    if (!member) {
      return res.status(404).send({
        success: false,
        message: "Member not found",
      });
    }

    if (req.body.hourly_rate !== undefined) {
      if (req.body.hourly_rate === null || req.body.hourly_rate === "") {
        member.hourly_rate = null;
      } else {
        const rateVal = parseFloat(req.body.hourly_rate);
        if (isNaN(rateVal) || rateVal < 0) {
          return res.status(400).send({
            success: false,
            message: "Hourly cost rate must be a valid non-negative number",
          });
        }
        member.hourly_rate = Math.round(rateVal * 100) / 100;
      }
    }

    if (req.body.role_in_project) {
      member.role_in_project = req.body.role_in_project;
    }

    await member.save();

    return res.status(200).send({
      success: true,
      message: "Project member updated successfully",
      data: member,
    });
  } catch (error) {
    console.error("Error updating project member:", error);
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

    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Authentication required",
      });
    }

    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({
        success: false,
        message: "Only the Project Head or Admin can remove project members",
      });
    }

    const member = await ProjectMember.findOne({
      where: {
        [Op.or]: [{ id: memberId }, { employee_id: memberId }],
        project_id: id,
        is_active: true,
      },
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
    const [users] = await db.sequelize.query(
      `SELECT 
        u.employee_id,
        u.employee_code,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.employee_official_email,
        u.emp_personal_email,
        u.role_master_name,
        u.department_id,
        d.department_name
      FROM HRMS_REGISTERED_USER u
      LEFT JOIN MASTER_DEPARTMENT d ON u.department_id = d.dept_id
      WHERE u.isDeleted = 0 AND u.status = 'ACTIVE'
      ORDER BY u.first_name ASC`
    );

    const cleanStr = (str) => {
      if (!str) return "";
      return str
        .replace(/â/g, " - ")
        .replace(/â/g, "'")
        .replace(/[^\x20-\x7E]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    };

    const formatted = (users || []).map((u) => {
      const parts = [cleanStr(u.first_name), cleanStr(u.middle_name), cleanStr(u.last_name)].filter(Boolean);
      let fullName = parts.join(" ");
      if (!fullName) {
        fullName = u.employee_code ? `Employee (${u.employee_code})` : `Emp #${u.employee_id}`;
      }
      const roleName = cleanStr(u.role_master_name) || "Staff";
      const deptName = cleanStr(u.department_name) || "";
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
        department: deptName || roleName,
        department_name: deptName,
        designation: roleName,
        role_name: roleName,
        displayText: u.employee_code ? `[${u.employee_code}] ${fullName}${deptName ? ' (' + deptName + ')' : ''}` : `${fullName}${deptName ? ' (' + deptName + ')' : ''}`,
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

exports.getProjectMilestones = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({ success: false, message: "Authentication required" });
    }
    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole === "unassigned") {
      return res.status(403).send({ success: false, message: "You do not have permission to access this project" });
    }

    const progressSummary = await recalculateProjectAndMilestones(id);

    const allTasks = await Task.findAll({
      where: { project_id: id, is_deleted: false },
      order: [["task_id", "DESC"]],
    });

    const milestonesWithTasks = (progressSummary ? progressSummary.milestones : []).map((m) => {
      const mTasks = allTasks.filter(
        (t) =>
          t.milestone_id &&
          (t.milestone_id == m.id ||
            t.milestone_id == m.milestone_id ||
            t.milestone_id == m.milestone_code)
      );
      return {
        ...m,
        tasks: mTasks,
      };
    });

    return res.status(200).send({
      success: true,
      data: milestonesWithTasks,
      summary: progressSummary
        ? {
            projectProgress: progressSummary.projectProgress,
            totalTasks: progressSummary.totalProjectTasks,
            completedTasks: progressSummary.completedProjectTasks,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.createProjectMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({ success: false, message: "Authentication required" });
    }
    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({ success: false, message: "Only Project Head or Admin can create milestones" });
    }

    const {
      milestone_code,
      milestone_id,
      name,
      description,
      start_date,
      due_date,
      status,
      display_order,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).send({ success: false, message: "Milestone Name is required" });
    }

    let mCode = (milestone_code || milestone_id || "").trim();
    if (!mCode) {
      const count = await ProjectMilestone.count({ where: { project_id: id, is_deleted: false } });
      mCode = `MS-${String(count + 1).padStart(3, "0")}`;
    }

    const existing = await ProjectMilestone.findOne({
      where: {
        project_id: id,
        is_deleted: false,
        [Op.or]: [{ milestone_id: mCode }, { milestone_code: mCode }],
      },
    });

    if (existing) {
      return res.status(400).send({
        success: false,
        message: `Milestone Code "${mCode}" already exists in this project`,
      });
    }

    let orderNum = 0;
    if (display_order !== undefined && display_order !== null && !isNaN(parseInt(display_order, 10))) {
      orderNum = parseInt(display_order, 10);
    } else {
      const maxOrder = await ProjectMilestone.max("display_order", {
        where: { project_id: id, is_deleted: false },
      });
      orderNum = (maxOrder || 0) + 1;
    }

    const milestone = await ProjectMilestone.create({
      project_id: id,
      milestone_id: mCode,
      milestone_code: mCode,
      name: name.trim(),
      description: description ? description.trim() : "",
      start_date: start_date || null,
      due_date: due_date || null,
      status: status || "Not Started",
      display_order: orderNum,
      progress: 0,
      created_by: user.employee_id,
      is_deleted: false,
    });

    await recalculateProjectAndMilestones(id);

    return res.status(201).send({
      success: true,
      message: "Milestone created successfully",
      data: milestone,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateProjectMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({ success: false, message: "Authentication required" });
    }
    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({ success: false, message: "Only Project Head or Admin can update milestones" });
    }

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, project_id: id, is_deleted: false },
    });
    if (!milestone) {
      return res.status(404).send({ success: false, message: "Milestone not found" });
    }

    const {
      milestone_code,
      milestone_id,
      name,
      description,
      start_date,
      due_date,
      status,
      display_order,
    } = req.body;

    const newCode = (milestone_code !== undefined ? milestone_code : milestone_id !== undefined ? milestone_id : "").trim();
    if (newCode && newCode !== milestone.milestone_code && newCode !== milestone.milestone_id) {
      const existing = await ProjectMilestone.findOne({
        where: {
          project_id: id,
          id: { [Op.ne]: milestoneId },
          is_deleted: false,
          [Op.or]: [{ milestone_id: newCode }, { milestone_code: newCode }],
        },
      });
      if (existing) {
        return res.status(400).send({
          success: false,
          message: `Milestone Code "${newCode}" already exists in this project`,
        });
      }
      milestone.milestone_code = newCode;
      milestone.milestone_id = newCode;
    }

    if (name !== undefined) milestone.name = name.trim();
    if (description !== undefined) milestone.description = description ? description.trim() : "";
    if (start_date !== undefined) milestone.start_date = start_date || null;
    if (due_date !== undefined) milestone.due_date = due_date || null;
    if (status !== undefined) milestone.status = status;
    if (display_order !== undefined) milestone.display_order = parseInt(display_order, 10);

    await milestone.save();

    if (name !== undefined) {
      await Task.update(
        { milestone_name: milestone.name },
        { where: { milestone_id: milestone.id, project_id: id, is_deleted: false } }
      );
    }

    await recalculateProjectAndMilestones(id);

    return res.status(200).send({
      success: true,
      message: "Milestone updated successfully",
      data: milestone,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.deleteProjectMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({ success: false, message: "Authentication required" });
    }
    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({ success: false, message: "Only Project Head or Admin can delete milestones" });
    }

    const milestone = await ProjectMilestone.findOne({
      where: { id: milestoneId, project_id: id, is_deleted: false },
    });
    if (!milestone) {
      return res.status(404).send({ success: false, message: "Milestone not found" });
    }

    milestone.is_deleted = true;
    await milestone.save();

    await Task.update(
      { milestone_id: null, milestone_name: null },
      { where: { milestone_id: milestone.id, project_id: id } }
    );

    await recalculateProjectAndMilestones(id);

    return res.status(200).send({ success: true, message: "Milestone deleted successfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.reorderProjectMilestones = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).send({ success: false, message: "Authentication required" });
    }
    const projectRole = await projectAuth.getProjectRole(id, user);
    if (projectRole !== "admin" && projectRole !== "head") {
      return res.status(403).send({ success: false, message: "Only Project Head or Admin can reorder milestones" });
    }

    const { orders } = req.body;
    if (Array.isArray(orders)) {
      for (const item of orders) {
        if (item.id && item.display_order !== undefined) {
          await ProjectMilestone.update(
            { display_order: parseInt(item.display_order, 10) },
            { where: { id: item.id, project_id: id } }
          );
        }
      }
    }

    await recalculateProjectAndMilestones(id);

    return res.status(200).send({ success: true, message: "Milestones reordered successfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


