const targetController = require("../controller/targetcontroller");

module.exports = app => {
  app.get("/api/v1/getAllReportingManager",targetController.getAllReportingManager);
  app.get("/api/v1/getAllSalesEmployee",targetController.getAllSalesEmployee);
  app.post("/api/v1/createUpdateTarget",targetController.createUpdateTarget);
  app.get("/api/v1/getTargetDetails",targetController.getTargetDetails);
  app.get("/api/v1/getTargetList",targetController.getTargetList);
  app.post("/api/v1/targetStatusChange",targetController.targetStatusChange);
  app.get("/api/v1/getAchievementList",targetController.getAchievementList);
  app.get("/api/v1/getAchievementDetails",targetController.getAchievementDetails);
}