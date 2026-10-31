const jwt = require("jsonwebtoken");
const config = require("../../../config/auth.config.js");
const db = require("../../../models");
const Project = db.project;
const ProjectMember = db.projectMember;

const getAuthUser = async (req) => {
  if (req.user && (req.user.employee_id || req.user.id)) {
    return {
      employee_id: req.user.employee_id || req.user.id,
      first_name: req.user.first_name || "",
      last_name: req.user.last_name || "",
      role_master_id: req.user.role_master_id || req.user.role_id,
      role_master_name: req.user.role_master_name || req.user.role_name || "",
    };
  }

  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token && typeof token === "string") {
    if (token.startsWith("Bearer ")) token = token.slice(7).trim();
    try {
      const decoded = jwt.verify(token, config.secret);
      if (decoded && decoded.id) {
        const [users] = await db.sequelize.query(
          "SELECT employee_id, first_name, last_name, employee_official_email, role_master_id, role_master_name FROM HRMS_REGISTERED_USER WHERE employee_id = :empId AND isDeleted = 0",
          { replacements: { empId: decoded.id } }
        );
        if (users && users.length > 0) return users[0];
      }
    } catch (e) {}
  }

  const fallbackId = req.headers["x-user-id"];
  if (fallbackId) {
    const [users] = await db.sequelize.query(
      "SELECT employee_id, first_name, last_name, employee_official_email, role_master_id, role_master_name FROM HRMS_REGISTERED_USER WHERE employee_id = :empId AND isDeleted = 0",
      { replacements: { empId: fallbackId } }
    );
    if (users && users.length > 0) return users[0];
  }

  return null;
};

const isProjectAdmin = (user) => {
  if (!user) return false;
  return (
    user.role_master_id === 1 ||
    user.role_master_name?.toLowerCase().includes("admin") ||
    user.role_master_name?.toLowerCase().includes("super")
  );
};

const canCreateProject = async (user) => {
  if (!user) return false;
  if (isProjectAdmin(user)) return true;
  const roleName = (user.role_master_name || "").toLowerCase();
  if (roleName.includes("project head") || roleName.includes("head")) {
    return true;
  }
  try {
    const [existing] = await db.sequelize.query(
      "SELECT project_id FROM PROJECTS WHERE is_deleted = 0 AND (project_manager_id = :empId OR created_by = :empId) LIMIT 1",
      { replacements: { empId: user.employee_id } }
    );
    return existing && existing.length > 0;
  } catch (e) {
    return false;
  }
};

const getProjectRole = async (projectId, user) => {
  if (!user) return "unassigned";
  if (isProjectAdmin(user)) return "admin";

  const project = await Project.findOne({
    where: { project_id: projectId, is_deleted: false },
  });
  if (!project) return null;

  if (
    project.project_manager_id == user.employee_id ||
    project.supervisor_id == user.employee_id ||
    project.created_by == user.employee_id
  ) {
    return "head";
  }

  const roleName = (user.role_master_name || "").toLowerCase();
  if (roleName.includes("project head")) {
    return "head";
  }

  const member = await ProjectMember.findOne({
    where: {
      project_id: projectId,
      employee_id: user.employee_id,
      is_active: true,
    },
  });

  return member ? "member" : "unassigned";
};

const getUserProjectIds = async (user) => {
  if (!user) return [];
  if (isProjectAdmin(user)) return null;

  const [rows] = await db.sequelize.query(
    `SELECT DISTINCT p.project_id 
     FROM PROJECTS p 
     LEFT JOIN PROJECT_MEMBERS pm ON p.project_id = pm.project_id AND pm.is_active = 1 
     WHERE p.is_deleted = 0 AND (
       p.project_manager_id = :empId OR 
       p.supervisor_id = :empId OR
       p.created_by = :empId OR 
       pm.employee_id = :empId
     )`,
    { replacements: { empId: user.employee_id } }
  );

  return rows.map((r) => r.project_id);
};

const getManagedProjectIds = async (user) => {
  if (!user) return [];
  if (isProjectAdmin(user)) return null;
  const roleName = (user.role_master_name || "").toLowerCase();
  if (roleName.includes("project head") || roleName.includes("finance") || roleName.includes("account")) {
    return null;
  }
  const [rows] = await db.sequelize.query(
    `SELECT DISTINCT project_id FROM PROJECTS 
     WHERE is_deleted = 0 AND (project_manager_id = :empId OR supervisor_id = :empId OR created_by = :empId)`,
    { replacements: { empId: user.employee_id } }
  );
  return rows.map((r) => r.project_id);
};

module.exports = {
  getAuthUser,
  isProjectAdmin,
  canCreateProject,
  getProjectRole,
  getUserProjectIds,
  getManagedProjectIds,
};
