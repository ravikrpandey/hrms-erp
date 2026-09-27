const workController = require("../controller/workFlowController");

module.exports = app => {
    app.post("/api/v1/create_workflow_approval",workController.create_work_Flow);
    app.get("/api/v1/get_All_workflow",workController.get_All_workflow);
    app.get("/api/v1/view_workflow_byId/:id",workController.view_workflow_byId);
    app.put("/api/v1/update_workflow_byId/:id",workController.update_workflow_byId);
    app.get("/api/v1/get_All_workflow_type",workController.get_All_workflow_type);
    app.get("/api/v1/getAllEmployeeByBranchId/:branch_id",workController.getAllEmployeeByBranchId);
   
}