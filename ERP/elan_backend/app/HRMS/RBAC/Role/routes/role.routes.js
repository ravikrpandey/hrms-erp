module.exports = (app) => {
  const roleController = require("../controllers/role.controller");

  app.post("/api/v1/createRole", roleController.createRole);
  app.put("/api/v1/editRole/:id", roleController.editRole);
  app.get("/api/v1/getAllRole", roleController.getAllRole);
  app.get("/api/v1/getByIdRole/:id", roleController.getByIdRole);
  app.delete("/api/v1/deleteRole/:id", roleController.deleteRole);
};