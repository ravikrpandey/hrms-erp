const LwfController = require("../controller/lwf_controller");

module.exports = (app) => {
  app.post("/api/v1/create-lwf", LwfController.createLwf);
  app.get("/api/v1/get-all-lwf", LwfController.getAllLwf);
  app.put("/api/v1/update-lwf-status-by-id/:id", LwfController.updateLwfStatusById);
  app.get("/api/v1/get-lwf-by-id/:id", LwfController.getLwfById);
  app.put("/api/v1/update-lwf-by-id/:id", LwfController.updateLwfById);
  //////////// Compliance details///////////
  app.get("/api/v1/get-compliance-details/:employee_id", LwfController.getComplianceDetails);

};
