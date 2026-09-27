const leaveTypesController = require("../controllers/leaveTypes.controller");

module.exports = app => {
    // app.post("/api/v1/create_Leave_Types", leaveTypesController.create_Leave_Types);
    app.post("/api/v1/createLeaveTypes", leaveTypesController.createLeaveTypes);
    app.put("/api/v1/editLeaveTypes/:id", leaveTypesController.editLeaveTypes);
    app.get("/api/v1/getAllLeaveTypes", leaveTypesController.getAllLeaveTypes);
    app.get("/api/v1/getByIdLeaveTypes/:id", leaveTypesController.getByIdLeaveTypes);
    app.delete("/api/v1/deleteLeaveTypes/:id", leaveTypesController.deleteLeaveTypes);
}