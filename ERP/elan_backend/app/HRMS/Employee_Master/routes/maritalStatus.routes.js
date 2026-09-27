const controller = require("../controllers/maritalStatus.controller.js");


module.exports = function (app) {
  app.post("/api/v1/maritalStatusdata", controller.maritalStatusdata);
  app.get("/api/v1/maritalStatusdatatest", controller.maritalStatusdatatest);
  app.get("/api/v1/maritalStutusdata/:id", controller.maritalStatusdatatestById);
  app.patch("/api/v1/maritalStatusData/:id", controller.updatemaritalStatus);
  app.patch("/api/v1/maritalStatusDatatest/:id", controller.maritalStatusTestdataInactive)
}