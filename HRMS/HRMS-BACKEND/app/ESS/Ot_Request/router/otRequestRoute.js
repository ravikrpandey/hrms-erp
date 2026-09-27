 const overTimeRequestController = require("../controller/otRequestController");
 ///Hii//

module.exports = app => {
    app.post("/api/v1/create_OvertimeRequest",overTimeRequestController.create_OvertimeRequest);
    app.post("/api/v1/get-ot-requests-by-status",overTimeRequestController.get_ot_requests_by_status);
    app.get("/api/v1/get_requestById",overTimeRequestController.get_requestById);
    app.post("/api/v1/approveORReject_Request",overTimeRequestController.approveORReject_Request);
    app.post("/api/v1/get_employeeAttendence",overTimeRequestController.get_employeeAttendence);
    app.post("/api/v1/get-all-ot-req",overTimeRequestController.get_all_ot_req);
    app.put("/api/v1/update_overtimerequestById",overTimeRequestController.update_OvertimeRequest);
    
}