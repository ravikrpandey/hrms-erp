const db = require("../../../models");
const ProjectExpense = db.projectExpense;
const ProjectExpenseHistory = db.projectExpenseHistory;
const Project = db.project;
const ProjectMember = db.projectMember;
const { Op } = require("sequelize");
const projectAuth = require("../../../master/project_management/middleware/projectAuth");
const projectCostService = require("../../../master/project_management/services/projectCostService");
const { saveNotification } = require("../../../notification/hrms_notification/controller/hrms_notification_controller");

const isUserAdmin = (user) => {
  if (!user) return false;
  return (
    user.role_master_id === 1 ||
    String(user.role_master_name || "").toLowerCase().includes("admin") ||
    String(user.role_master_name || "").toLowerCase().includes("super")
  );
};

const isUserFinance = (user) => {
  if (!user) return false;
  if (isUserAdmin(user)) return true;
  const role = String(user.role_master_name || "").toLowerCase();
  return role.includes("finance") || role.includes("project head") || role.includes("account");
};

const getManagedProjectsForUser = async (user) => {
  if (!user) return [];
  if (isUserAdmin(user)) return null;
  const [rows] = await db.sequelize.query(
    `SELECT DISTINCT project_id FROM PROJECTS 
     WHERE is_deleted = 0 AND (project_manager_id = :empId OR supervisor_id = :empId OR created_by = :empId)`,
    { replacements: { empId: user.employee_id } }
  );
  return rows.map((r) => r.project_id);
};

const recordHistory = async ({
  expense_id,
  action,
  actor,
  role,
  comments = null,
  previous_status = null,
  new_status,
  details = null,
  transaction = null,
}) => {
  try {
    return await ProjectExpenseHistory.create(
      {
        expense_id,
        action,
        actor_id: actor ? actor.employee_id : 0,
        actor_name: actor ? `${actor.first_name || ""} ${actor.last_name || ""}`.trim() : "System",
        actor_role: role || (actor ? actor.role_master_name || "Employee" : "System"),
        comments,
        previous_status,
        new_status,
        details,
      },
      transaction ? { transaction } : {}
    );
  } catch (err) {
    console.error("Error creating expense history record:", err);
    return null;
  }
};

const sendNotificationSafe = async (employee_id, message) => {
  if (!employee_id || !message) return;
  try {
    await saveNotification({
      employee_id,
      notification_type: "EXP_REQ",
      message,
    });
  } catch (err) {
    console.error("Error sending expense notification:", err.message);
  }
};

const notifyFinanceUsers = async (message) => {
  try {
    const [financeUsers] = await db.sequelize.query(
      `SELECT employee_id FROM HRMS_REGISTERED_USER 
       WHERE isDeleted = 0 AND (
         role_master_id = 1 
         OR LOWER(role_master_name) LIKE '%finance%' 
         OR LOWER(role_master_name) LIKE '%project head%'
       )`
    );
    for (const u of financeUsers) {
      await sendNotificationSafe(u.employee_id, message);
    }
  } catch (err) {
    console.error("Error notifying finance users:", err.message);
  }
};

const generateExpenseNumber = async (transaction = null) => {
  const currentYear = new Date().getFullYear();
  const [result] = await db.sequelize.query(
    `SELECT MAX(id) as maxId FROM PROJECT_EXPENSES`,
    transaction ? { transaction } : {}
  );
  const nextId = (result && result[0] && result[0].maxId ? Number(result[0].maxId) : 0) + 1;
  return `EXP-${currentYear}-${String(nextId).padStart(4, "0")}`;
};

// 1. Get current user role and capabilities
exports.getUserRoleInfo = async (req, res) => {
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const isAdmin = isUserAdmin(user);
    const isFinance = isUserFinance(user);
    const managedProjectIds = await getManagedProjectsForUser(user);
    const isPM = isAdmin || (managedProjectIds && managedProjectIds.length > 0) || String(user.role_master_name || "").toLowerCase().includes("project manager");

    return res.status(200).json({
      code: 200,
      data: {
        employee_id: user.employee_id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.employee_official_email,
        role_master_id: user.role_master_id,
        role_master_name: user.role_master_name,
        isEmployee: true,
        isProjectManager: !!isPM,
        isFinanceApprover: !!isFinance,
        isAdmin: !!isAdmin,
        managedProjectIds: managedProjectIds || [],
      },
    });
  } catch (error) {
    console.error("getUserRoleInfo error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 2. Get projects available for the user
exports.getProjects = async (req, res) => {
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    let projects = [];
    if (isUserAdmin(user)) {
      projects = await Project.findAll({
        where: { is_deleted: false, is_active: true },
        attributes: [
          "project_id",
          "project_name",
          "project_code",
          "project_manager_id",
          "project_manager_name",
          "supervisor_id",
          "supervisor_name",
        ],
        order: [["project_name", "ASC"]],
      });
    } else {
      // Find projects where user is member or manager or creator
      const [assigned] = await db.sequelize.query(
        `SELECT DISTINCT p.project_id, p.project_name, p.project_code, 
                p.project_manager_id, p.project_manager_name, p.supervisor_id, p.supervisor_name 
         FROM PROJECTS p 
         LEFT JOIN PROJECT_MEMBERS pm ON p.project_id = pm.project_id AND pm.is_active = 1 
         WHERE p.is_deleted = 0 AND p.is_active = 1 AND (
           p.project_manager_id = :empId OR 
           p.supervisor_id = :empId OR 
           p.created_by = :empId OR 
           pm.employee_id = :empId
         )
         ORDER BY p.project_name ASC`,
        { replacements: { empId: user.employee_id } }
      );

      if (assigned && assigned.length > 0) {
        projects = assigned;
      } else {
        // Fallback to all active projects so employees are not blocked if assignments aren't populated
        projects = await Project.findAll({
          where: { is_deleted: false, is_active: true },
          attributes: [
            "project_id",
            "project_name",
            "project_code",
            "project_manager_id",
            "project_manager_name",
            "supervisor_id",
            "supervisor_name",
          ],
          order: [["project_name", "ASC"]],
        });
      }
    }

    return res.status(200).json({ code: 200, data: projects });
  } catch (error) {
    console.error("getProjects error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 3. Get expense categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.sequelize.query(
      `SELECT id, expense_type FROM MASTER_EXPENSE WHERE isDeleted = 0 AND status = 'ACTIVE' ORDER BY expense_type ASC`
    );

    return res.status(200).json({ code: 200, data: categories });
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 4. Create new expense (Save as Draft or Submit for Approval)
exports.createExpense = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      await t.rollback();
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const {
      project_id,
      expense_type,
      expense_type_id,
      expense_date,
      amount,
      comments,
      action = "Draft", // 'Draft' or 'Submit'
    } = req.body;

    if (!project_id) {
      await t.rollback();
      return res.status(400).json({ code: 400, message: "Project is required." });
    }
    if (!expense_type) {
      await t.rollback();
      return res.status(400).json({ code: 400, message: "Expense category is required." });
    }
    if (!expense_date) {
      await t.rollback();
      return res.status(400).json({ code: 400, message: "Expense date is required." });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      await t.rollback();
      return res.status(400).json({ code: 400, message: "Amount must be a positive monetary value." });
    }

    const project = await Project.findOne({
      where: { project_id: parseInt(project_id, 10), is_deleted: false },
      transaction: t,
    });
    if (!project) {
      await t.rollback();
      return res.status(404).json({ code: 404, message: "Selected project not found." });
    }

    const expenseNumber = await generateExpenseNumber(t);
    const isSubmit = action === "Submit";
    const status = isSubmit ? "Submitted" : "Draft";

    let attachment_path = null;
    let attachment_name = null;
    let attachment_size = null;
    let attachment_type = null;

    if (req.file) {
      attachment_path = req.file.path;
      attachment_name = req.file.originalname;
      attachment_size = req.file.size;
      attachment_type = req.file.mimetype;
    }

    const pmId = project.project_manager_id || project.supervisor_id || project.created_by;
    const pmName = project.project_manager_name || project.supervisor_name || "Assigned Manager";

    const userName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    const expense = await ProjectExpense.create(
      {
        expense_number: expenseNumber,
        employee_id: user.employee_id,
        employee_name: userName,
        employee_email: user.employee_official_email,
        department_id: project.department_id,
        department_name: project.department_name,
        project_id: project.project_id,
        project_name: project.project_name,
        project_code: project.project_code,
        project_manager_id: pmId,
        project_manager_name: pmName,
        expense_type_id: expense_type_id ? parseInt(expense_type_id, 10) : null,
        expense_type,
        expense_date,
        amount: parsedAmount,
        comments: comments || null,
        attachment_path,
        attachment_name,
        attachment_size,
        attachment_type,
        status,
        submitted_at: isSubmit ? new Date() : null,
      },
      { transaction: t }
    );

    // Record History
    await recordHistory({
      expense_id: expense.id,
      action: isSubmit ? "Submitted" : "Created Draft",
      actor: user,
      role: user.role_master_name || "Employee",
      comments: comments || (isSubmit ? "Expense submitted for Project Manager approval" : "Saved as draft"),
      previous_status: null,
      new_status: status,
      details: { amount: parsedAmount, expense_type, project_name: project.project_name, attachment: attachment_name },
      transaction: t,
    });

    await t.commit();

    // Notify Project Manager if submitted
    if (isSubmit && pmId) {
      sendNotificationSafe(
        pmId,
        `Expense ${expenseNumber} of ₹${parsedAmount.toFixed(2)} for project "${project.project_name}" submitted by ${userName} is awaiting your approval.`
      );
    }

    return res.status(201).json({
      code: 201,
      message: isSubmit ? "Expense submitted for approval successfully" : "Expense saved as draft successfully",
      data: expense,
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("createExpense error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 5. Get Expenses (filtered by tabs, permissions, and search)
exports.getAllExpenses = async (req, res) => {
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const {
      tab = "my_expenses",
      search = "",
      project_id,
      expense_type,
      page = 1,
      limit = 100,
    } = req.query;

    const isAdmin = isUserAdmin(user);
    const isFinance = isUserFinance(user);
    const managedProjectIds = (await getManagedProjectsForUser(user)) || [];
    const isPM = isAdmin || managedProjectIds.length > 0;

    let baseWhere = { is_deleted: false };

    if (project_id && project_id !== "All") {
      baseWhere.project_id = parseInt(project_id, 10);
    }
    if (expense_type && expense_type !== "All") {
      baseWhere.expense_type = expense_type;
    }

    if (search && search.trim() !== "") {
      const q = `%${search.trim()}%`;
      baseWhere[Op.or] = [
        { expense_number: { [Op.like]: q } },
        { employee_name: { [Op.like]: q } },
        { project_name: { [Op.like]: q } },
        { expense_type: { [Op.like]: q } },
      ];
    }

    let tabWhere = {};

    switch (tab) {
      case "my_expenses":
        tabWhere = { employee_id: user.employee_id };
        break;

      case "pending":
        if (isAdmin) {
          tabWhere = { status: { [Op.in]: ["Submitted", "Finance Pending"] } };
        } else if (isPM && isFinance) {
          tabWhere = {
            [Op.or]: [
              { status: "Submitted", project_id: { [Op.in]: managedProjectIds } },
              { status: "Finance Pending" },
            ],
          };
        } else if (isPM) {
          tabWhere = {
            status: "Submitted",
            project_id: { [Op.in]: managedProjectIds },
          };
        } else if (isFinance) {
          tabWhere = { status: "Finance Pending" };
        } else {
          return res.status(200).json({ code: 200, data: [], counts: { my_expenses: 0, pending: 0, approved: 0, rejected: 0 } });
        }
        break;

      case "approved":
        if (isAdmin || isFinance) {
          tabWhere = { status: "Approved" };
        } else if (isPM) {
          tabWhere = {
            status: "Approved",
            project_id: { [Op.in]: managedProjectIds },
          };
        } else {
          return res.status(200).json({ code: 200, data: [], counts: { my_expenses: 0, pending: 0, approved: 0, rejected: 0 } });
        }
        break;

      case "rejected":
        if (isAdmin || isFinance) {
          tabWhere = { status: "Rejected" };
        } else if (isPM) {
          tabWhere = {
            status: "Rejected",
            project_id: { [Op.in]: managedProjectIds },
          };
        } else {
          return res.status(200).json({ code: 200, data: [], counts: { my_expenses: 0, pending: 0, approved: 0, rejected: 0 } });
        }
        break;

      default:
        tabWhere = { employee_id: user.employee_id };
    }

    const where = { ...baseWhere, ...tabWhere };

    const expenses = await ProjectExpense.findAll({
      where,
      order: [["id", "DESC"]],
      limit: parseInt(limit, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
    });

    // Calculate counts for badges
    const myCount = await ProjectExpense.count({
      where: { is_deleted: false, employee_id: user.employee_id },
    });

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    if (isAdmin) {
      pendingCount = await ProjectExpense.count({
        where: { is_deleted: false, status: { [Op.in]: ["Submitted", "Finance Pending"] } },
      });
      approvedCount = await ProjectExpense.count({
        where: { is_deleted: false, status: "Approved" },
      });
      rejectedCount = await ProjectExpense.count({
        where: { is_deleted: false, status: "Rejected" },
      });
    } else {
      if (isPM && isFinance) {
        pendingCount = await ProjectExpense.count({
          where: {
            is_deleted: false,
            [Op.or]: [
              { status: "Submitted", project_id: { [Op.in]: managedProjectIds } },
              { status: "Finance Pending" },
            ],
          },
        });
        approvedCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Approved" },
        });
        rejectedCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Rejected" },
        });
      } else if (isPM) {
        pendingCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Submitted", project_id: { [Op.in]: managedProjectIds } },
        });
        approvedCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Approved", project_id: { [Op.in]: managedProjectIds } },
        });
        rejectedCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Rejected", project_id: { [Op.in]: managedProjectIds } },
        });
      } else if (isFinance) {
        pendingCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Finance Pending" },
        });
        approvedCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Approved" },
        });
        rejectedCount = await ProjectExpense.count({
          where: { is_deleted: false, status: "Rejected" },
        });
      }
    }

    return res.status(200).json({
      code: 200,
      data: expenses,
      counts: {
        my_expenses: myCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    console.error("getAllExpenses error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 6. Get single expense details with chronological history
exports.getExpenseById = async (req, res) => {
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const { id } = req.params;
    const expense = await ProjectExpense.findOne({
      where: { id: parseInt(id, 10), is_deleted: false },
      include: [
        {
          model: ProjectExpenseHistory,
          as: "history",
          required: false,
        },
      ],
      order: [[{ model: ProjectExpenseHistory, as: "history" }, "createdAt", "ASC"]],
    });

    if (!expense) {
      return res.status(404).json({ code: 404, message: "Expense record not found." });
    }

    // Authorization check: Submitter, PM of the project, Finance, or Admin
    const isAdmin = isUserAdmin(user);
    const isFinance = isUserFinance(user);
    const isSubmitter = expense.employee_id === user.employee_id;
    const managedProjectIds = (await getManagedProjectsForUser(user)) || [];
    const isPM = isAdmin || managedProjectIds.includes(expense.project_id);

    if (!isSubmitter && !isPM && !isFinance && !isAdmin) {
      return res.status(403).json({ code: 403, message: "Access denied to this expense record." });
    }

    return res.status(200).json({
      code: 200,
      data: expense,
      permissions: {
        canEdit: (expense.status === "Draft" || expense.status === "Rejected") && isSubmitter,
        canApprovePM: expense.status === "Submitted" && (isPM || isAdmin),
        canApproveFinance: expense.status === "Finance Pending" && (isFinance || isAdmin),
        canRejectPM: expense.status === "Submitted" && (isPM || isAdmin),
        canRejectFinance: expense.status === "Finance Pending" && (isFinance || isAdmin),
        canDelete: expense.status === "Draft" && (isSubmitter || isAdmin),
      },
    });
  } catch (error) {
    console.error("getExpenseById error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 7. Update Expense (Draft edit or Rejected resubmission)
exports.updateExpense = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      await t.rollback();
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const { id } = req.params;
    const expense = await ProjectExpense.findOne({
      where: { id: parseInt(id, 10), is_deleted: false },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ code: 404, message: "Expense not found." });
    }

    const isSubmitter = expense.employee_id === user.employee_id;
    if (!isSubmitter && !isUserAdmin(user)) {
      await t.rollback();
      return res.status(403).json({ code: 403, message: "Only the submitter or admin can modify this expense." });
    }

    if (expense.status !== "Draft" && expense.status !== "Rejected") {
      await t.rollback();
      return res.status(400).json({
        code: 400,
        message: `Expense in '${expense.status}' status cannot be modified.`,
      });
    }

    const {
      project_id,
      expense_type,
      expense_type_id,
      expense_date,
      amount,
      comments,
      action = "Draft", // 'Draft', 'Submit', 'Resubmit'
    } = req.body;

    const previousStatus = expense.status;
    let newStatus = expense.status;
    let isResubmission = false;

    if (previousStatus === "Draft") {
      if (action === "Submit") {
        newStatus = "Submitted";
      } else {
        newStatus = "Draft";
      }
    } else if (previousStatus === "Rejected") {
      if (action === "Resubmit" || action === "Submit") {
        newStatus = "Submitted";
        isResubmission = true;
      } else {
        // Can keep editing draft state of rejected
        newStatus = "Rejected";
      }
    }

    const updateData = {};
    if (project_id) {
      const proj = await Project.findOne({
        where: { project_id: parseInt(project_id, 10), is_deleted: false },
        transaction: t,
      });
      if (proj) {
        updateData.project_id = proj.project_id;
        updateData.project_name = proj.project_name;
        updateData.project_code = proj.project_code;
        updateData.project_manager_id = proj.project_manager_id || proj.supervisor_id || proj.created_by;
        updateData.project_manager_name = proj.project_manager_name || proj.supervisor_name || "Assigned Manager";
        updateData.department_id = proj.department_id;
        updateData.department_name = proj.department_name;
      }
    }

    if (expense_type) updateData.expense_type = expense_type;
    if (expense_type_id) updateData.expense_type_id = parseInt(expense_type_id, 10);
    if (expense_date) updateData.expense_date = expense_date;
    if (amount !== undefined) {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        await t.rollback();
        return res.status(400).json({ code: 400, message: "Amount must be a positive number." });
      }
      updateData.amount = parsed;
    }
    if (comments !== undefined) updateData.comments = comments;

    if (req.file) {
      updateData.attachment_path = req.file.path;
      updateData.attachment_name = req.file.originalname;
      updateData.attachment_size = req.file.size;
      updateData.attachment_type = req.file.mimetype;
    }

    updateData.status = newStatus;

    if (isResubmission) {
      updateData.is_resubmitted = true;
      updateData.resubmitted_at = new Date();
      updateData.rejection_stage = null;
      updateData.rejection_reason = null;
      updateData.submitted_at = new Date();
    } else if (newStatus === "Submitted" && previousStatus === "Draft") {
      updateData.submitted_at = new Date();
    }

    await expense.update(updateData, { transaction: t });

    // Record History
    let historyAction = "Updated Draft";
    if (isResubmission) {
      historyAction = "Resubmitted";
    } else if (newStatus === "Submitted" && previousStatus === "Draft") {
      historyAction = "Submitted";
    }

    await recordHistory({
      expense_id: expense.id,
      action: historyAction,
      actor: user,
      role: user.role_master_name || "Employee",
      comments: comments || (isResubmission ? "Expense corrected and resubmitted" : "Expense updated"),
      previous_status: previousStatus,
      new_status: newStatus,
      details: {
        amount: updateData.amount || expense.amount,
        attachment_changed: !!req.file,
      },
      transaction: t,
    });

    await t.commit();

    const pmTargetId = updateData.project_manager_id || expense.project_manager_id;
    const userName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    const projName = updateData.project_name || expense.project_name;
    const formattedAmount = Number(updateData.amount != null ? updateData.amount : expense.amount).toFixed(2);

    if (isResubmission && pmTargetId) {
      sendNotificationSafe(
        pmTargetId,
        `Expense ${expense.expense_number} for project "${projName}" has been resubmitted by ${userName} and is awaiting your review.`
      );
    } else if (newStatus === "Submitted" && previousStatus === "Draft" && pmTargetId) {
      sendNotificationSafe(
        pmTargetId,
        `Expense ${expense.expense_number} of ₹${formattedAmount} for project "${projName}" submitted by ${userName} is awaiting your approval.`
      );
    }

    return res.status(200).json({
      code: 200,
      message: isResubmission
        ? "Expense resubmitted successfully for Project Manager approval"
        : newStatus === "Submitted"
        ? "Expense submitted for approval successfully"
        : "Expense draft updated successfully",
      data: expense,
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("updateExpense error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 8. Level 1 or Level 2 Approval
exports.approveExpense = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      await t.rollback();
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const { id } = req.params;
    const { comments = "" } = req.body;

    const expense = await ProjectExpense.findOne({
      where: { id: parseInt(id, 10), is_deleted: false },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ code: 404, message: "Expense record not found." });
    }

    const isAdmin = isUserAdmin(user);
    const isFinance = isUserFinance(user);
    const managedProjectIds = (await getManagedProjectsForUser(user)) || [];
    const isPM = isAdmin || managedProjectIds.includes(expense.project_id) || expense.project_manager_id === user.employee_id;

    const userName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    // Stage 1: Project Manager Approval
    if (expense.status === "Submitted") {
      if (!isPM && !isAdmin) {
        await t.rollback();
        return res.status(403).json({
          code: 403,
          message: "You are not authorized to approve this expense as Project Manager for this project.",
        });
      }

      await expense.update(
        {
          status: "Finance Pending",
          pm_approver_id: user.employee_id,
          pm_approver_name: userName,
          pm_approval_date: new Date(),
          pm_comments: comments || "Approved by Project Manager",
        },
        { transaction: t }
      );

      await recordHistory({
        expense_id: expense.id,
        action: "PM Approved",
        actor: user,
        role: "Project Manager",
        comments: comments || "Approved by Project Manager",
        previous_status: "Submitted",
        new_status: "Finance Pending",
        transaction: t,
      });

      await t.commit();

      // Notify Finance Team
      notifyFinanceUsers(
        `Expense ${expense.expense_number} of ₹${expense.amount} for project "${expense.project_name}" approved by Project Manager ${userName} is pending Finance approval.`
      );

      return res.status(200).json({
        code: 200,
        message: "Expense approved successfully and routed to Finance Approver.",
        data: expense,
      });
    }

    // Stage 2: Finance Approval
    if (expense.status === "Finance Pending") {
      if (!isFinance && !isAdmin) {
        await t.rollback();
        return res.status(403).json({
          code: 403,
          message: "You are not authorized as a Finance Approver / Project Head.",
        });
      }

      await expense.update(
        {
          status: "Approved",
          finance_approver_id: user.employee_id,
          finance_approver_name: userName,
          finance_approval_date: new Date(),
          finance_comments: comments || "Final approval granted by Finance",
        },
        { transaction: t }
      );

      await recordHistory({
        expense_id: expense.id,
        action: "Finance Approved",
        actor: user,
        role: "Finance Approver",
        comments: comments || "Final approval granted by Finance",
        previous_status: "Finance Pending",
        new_status: "Approved",
        transaction: t,
      });

      await projectCostService.postProjectExpenseCost(expense.id, user, t);

      await t.commit();

      // Notify Submitter
      sendNotificationSafe(
        expense.employee_id,
        `Your expense ${expense.expense_number} of ₹${expense.amount} for project "${expense.project_name}" has received final Finance Approval.`
      );

      return res.status(200).json({
        code: 200,
        message: "Expense finally approved successfully.",
        data: expense,
      });
    }

    if (expense.status === "Approved") {
      await t.rollback();
      return res.status(400).json({ code: 400, message: "Expense is already approved." });
    }

    await t.rollback();
    return res.status(400).json({
      code: 400,
      message: `Cannot approve expense in status '${expense.status}'. Valid stages are 'Submitted' (PM) and 'Finance Pending' (Finance).`,
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("approveExpense error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 9. Rejection (Stage 1 by PM or Stage 2 by Finance)
exports.rejectExpense = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      await t.rollback();
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const { id } = req.params;
    const { rejection_reason } = req.body;

    if (!rejection_reason || rejection_reason.trim() === "") {
      await t.rollback();
      return res.status(400).json({ code: 400, message: "Rejection reason is mandatory." });
    }

    const expense = await ProjectExpense.findOne({
      where: { id: parseInt(id, 10), is_deleted: false },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ code: 404, message: "Expense record not found." });
    }

    const isAdmin = isUserAdmin(user);
    const isFinance = isUserFinance(user);
    const managedProjectIds = (await getManagedProjectsForUser(user)) || [];
    const isPM = isAdmin || managedProjectIds.includes(expense.project_id) || expense.project_manager_id === user.employee_id;

    const userName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    // Stage 1: Project Manager Rejection
    if (expense.status === "Submitted") {
      if (!isPM && !isAdmin) {
        await t.rollback();
        return res.status(403).json({
          code: 403,
          message: "You are not authorized to reject this expense as Project Manager for this project.",
        });
      }

      await expense.update(
        {
          status: "Rejected",
          rejection_stage: "Project Manager",
          rejected_by_id: user.employee_id,
          rejected_by_name: userName,
          rejected_by_role: "Project Manager",
          rejection_reason: rejection_reason.trim(),
          rejection_date: new Date(),
        },
        { transaction: t }
      );

      await recordHistory({
        expense_id: expense.id,
        action: "PM Rejected",
        actor: user,
        role: "Project Manager",
        comments: rejection_reason.trim(),
        previous_status: "Submitted",
        new_status: "Rejected",
        transaction: t,
      });

      await t.commit();

      // Notify Submitter
      sendNotificationSafe(
        expense.employee_id,
        `Expense ${expense.expense_number} for project "${expense.project_name}" was rejected by Project Manager. Reason: ${rejection_reason.trim()}`
      );

      return res.status(200).json({
        code: 200,
        message: "Expense rejected at Project Manager stage.",
        data: expense,
      });
    }

    // Stage 2: Finance Rejection
    if (expense.status === "Finance Pending") {
      if (!isFinance && !isAdmin) {
        await t.rollback();
        return res.status(403).json({
          code: 403,
          message: "You are not authorized as a Finance Approver / Project Head.",
        });
      }

      await expense.update(
        {
          status: "Rejected",
          rejection_stage: "Finance",
          rejected_by_id: user.employee_id,
          rejected_by_name: userName,
          rejected_by_role: "Finance Approver",
          rejection_reason: rejection_reason.trim(),
          rejection_date: new Date(),
        },
        { transaction: t }
      );

      await recordHistory({
        expense_id: expense.id,
        action: "Finance Rejected",
        actor: user,
        role: "Finance Approver",
        comments: rejection_reason.trim(),
        previous_status: "Finance Pending",
        new_status: "Rejected",
        transaction: t,
      });

      await t.commit();

      // Notify Submitter
      sendNotificationSafe(
        expense.employee_id,
        `Expense ${expense.expense_number} for project "${expense.project_name}" was rejected by Finance. Reason: ${rejection_reason.trim()}`
      );

      return res.status(200).json({
        code: 200,
        message: "Expense rejected at Finance stage.",
        data: expense,
      });
    }

    // Stage 3: Void/Reversal of Approved Expense by Finance or Admin
    if (expense.status === "Approved") {
      if (!isFinance && !isAdmin) {
        await t.rollback();
        return res.status(403).json({
          code: 403,
          message: "You are not authorized to cancel an approved expense. Only Finance or Admin can cancel.",
        });
      }

      await expense.update(
        {
          status: "Rejected",
          rejection_stage: "Finance Reversal",
          rejected_by_id: user.employee_id,
          rejected_by_name: userName,
          rejected_by_role: isAdmin ? "Admin" : "Finance Approver",
          rejection_reason: rejection_reason.trim(),
          rejection_date: new Date(),
        },
        { transaction: t }
      );

      await recordHistory({
        expense_id: expense.id,
        action: "Finance Reversed",
        actor: user,
        role: isAdmin ? "Admin" : "Finance Approver",
        comments: rejection_reason.trim(),
        previous_status: "Approved",
        new_status: "Rejected",
        transaction: t,
      });

      await projectCostService.reverseProjectExpenseCost(expense.id, user, rejection_reason.trim(), t);

      await t.commit();

      sendNotificationSafe(
        expense.employee_id,
        `Approved expense ${expense.expense_number} for project "${expense.project_name}" was cancelled/reversed. Reason: ${rejection_reason.trim()}`
      );

      return res.status(200).json({
        code: 200,
        message: "Approved expense successfully cancelled and cost reversed in ledger.",
        data: expense,
      });
    }

    await t.rollback();
    return res.status(400).json({
      code: 400,
      message: `Cannot reject expense in status '${expense.status}'.`,
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("rejectExpense error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};

// 10. Delete Draft Expense
exports.deleteExpense = async (req, res) => {
  try {
    const user = await projectAuth.getAuthUser(req);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const { id } = req.params;
    const expense = await ProjectExpense.findOne({
      where: { id: parseInt(id, 10), is_deleted: false },
    });

    if (!expense) {
      return res.status(404).json({ code: 404, message: "Expense record not found." });
    }

    if (expense.status !== "Draft") {
      return res.status(400).json({ code: 400, message: "Only draft expenses can be deleted." });
    }

    if (expense.employee_id !== user.employee_id && !isUserAdmin(user)) {
      return res.status(403).json({ code: 403, message: "Unauthorized to delete this draft." });
    }

    await expense.update({ is_deleted: true });

    return res.status(200).json({ code: 200, message: "Draft expense deleted successfully." });
  } catch (error) {
    console.error("deleteExpense error:", error);
    return res.status(500).json({ code: 500, message: error.message || "Server Error" });
  }
};
