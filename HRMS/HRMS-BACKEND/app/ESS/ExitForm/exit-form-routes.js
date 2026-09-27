const controller = require("./exit-form-controller");
module.exports = (app) => {
  app.post("/api/v1/create_exit-form", controller.createExitInterview);
  app.get("/api/v1/get-exit-form-by-emp-id/:employee_id", controller.getExitFormByEmpId);
  app.get("/api/v1/get-exit-form-by-id/:exit_form_id", controller.getExitFormById);
  app.get("/api/v1/get-all-exit-form-to-be-approved", controller.getAllExitFormToBeApproved);
  app.put("/api/v1/approve-reject-exit-form-status", controller.approveRejExitFormStatus);
  app.get("/api/v1/get-exit-form-details-by-id/:exit_form_id", controller.getExitFormDetailsById);

};
