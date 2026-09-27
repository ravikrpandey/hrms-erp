const rbacController = require("./controller");
const rbacPermission = require("./rbacPermission.controller");

module.exports = (app) => {
  app.post("/api/v1/rbac/createModule", rbacController.createModule);
  app.get("/api/v1/rbac/getAllModules", rbacController.getAllModules);
  app.get("/api/v1/rbac/getRBACMenuTree", rbacController.getRBACMenuTree);
  app.get("/api/v1/rbac/getModuleById/:id", rbacController.getModuleById);
  app.put("/api/v1/rbac/toggleStatus/:id", rbacController.toggleStatus);
  app.delete("/api/v1/rbac/deleteModule/:id", rbacController.deleteModule);

  // Role Permissions
  app.post(
    "/api/v1/rbac/bulkSaveRolePermissions",
    rbacPermission.bulkSaveRolePermissions
  );
  app.get(
    "/api/v1/rbac/getRolePermissions/:roleId",
    rbacPermission.getRolePermissions
  );
  app.post(
    "/api/v1/rbac/bulkSaveUserPermissions",
    rbacPermission.bulkSaveUserPermissions
  );
  app.get(
    "/api/v1/rbac/getRoleAndUserPermissions/:roleId/:userId/:entityId",
    rbacPermission.getRoleAndUserPermissions
  );

  // Module Access Control
  app.get(
    "/api/v1/rbac/getModuleAccess/:employeeId/:roleId/:entityId",
    rbacPermission.getModuleAccess
  );
  app.post(
    "/api/v1/rbac/checkModuleAccess",
    rbacPermission.checkModuleAccess
  );
};
