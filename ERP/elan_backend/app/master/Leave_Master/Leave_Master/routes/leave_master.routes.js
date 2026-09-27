const LeavePolicyController = require("../controller/leave_master.controller")

module.exports = app => {
    app.post("/api/v1/createLeavePolicy", LeavePolicyController.createLeavePolicy);
    app.put("/api/v1/editLeavePolicy/:leavePolicyId", LeavePolicyController.editLeavePolicy);
    app.get("/api/v1/getAllLeavePolicy", LeavePolicyController.getAllLeavePolicy);
    app.get("/api/v1/getLeavePolicyById/:leavePolicyId", LeavePolicyController.getLeavePolicyById);
    app.put("/api/v1/deleteLeavePolicyById/:leavePolicyId", LeavePolicyController.deleteLeavePolicyById)
}