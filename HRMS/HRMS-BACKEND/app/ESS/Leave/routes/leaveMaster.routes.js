const leaveTypesMasterController = require("../controllers/leaveMaster.controller");

module.exports = app => {
    app.post("/api/v1/createLeaveTypesMaster", leaveTypesMasterController.createLeaveTypesMaster);
    app.post("/api/v1/createRemaningLeave", leaveTypesMasterController.createRemaningLeave);
    app.put("/api/v1/editLeaveTypesMaster/:id", leaveTypesMasterController.editLeaveTypesMaster);
    app.get("/api/v1/getAllLeaveTypesMaster", leaveTypesMasterController.getAllLeaveTypesMaster);
    app.get("/api/v1/getByIdLeaveTypesMaster/:id", leaveTypesMasterController.getByIdLeaveTypesMaster);
    app.post("/api/v1/getByIdLeaveemployee/:id", leaveTypesMasterController.getByIdLeaveemployee);
    app.delete("/app/v1/deleteLeaveTypesMaster/:id", leaveTypesMasterController.deleteLeaveTypesMaster);
    app.put("/api/v1/updateStatusLeaveTypesMaster/:emp_leave_id", leaveTypesMasterController.updateStatusLeaveTypesMaster);
}