const variableEarningController = require("../controller/variable_earning_controller");

module.exports = (app) => {
  app.post("/api/v1/createVariableEarning", variableEarningController.createVariableEarning);
  app.put("/api/v1/updateVariableAllotmentEarning/:id", variableEarningController.updateVariableEarning);
  app.put("/api/v1/UpdateVariableAllotmentStatusById/:id", variableEarningController.updateStatusById);
  app.get("/api/v1/getVariableEarningById/:id", variableEarningController.getVariableEarningById);
  app.get("/api/v1/getAllVariableEarning", variableEarningController.getAllVariableEarning);
  app.post("/api/v1/getVarEarningData", variableEarningController.getVarEarningData);
  app.post(
    "/api/v1/getAllEmployeeByVarEarning",
    variableEarningController.getAllEmployeeByVarEarning
  );

  app.delete("/api/v1/deleteVariableAllotmentEarning/:id", variableEarningController.deleteVariableAllotmentEarning);
};
