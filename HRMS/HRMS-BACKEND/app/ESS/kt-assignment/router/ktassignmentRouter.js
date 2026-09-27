const ktAssignmentController = require('../controller/ktAssignmentController');

module.exports = (app)=>{
    app.post("/api/v1/createKtAssignment",ktAssignmentController.createKtAssignment);
    app.get("/api/v1/getAllKtAssignment",ktAssignmentController.getAllKtAssignment);
    app.get("/api/v1/getKtAssignmentById/:id",ktAssignmentController.getKtAssignmentById);
    app.put("/api/v1/updateKtAssignment/:id",ktAssignmentController.updateKtAssignment);
    app.delete("/api/v1/deleteKtAssignment/:id",ktAssignmentController.deleteKtAssignment);
    app.get("/api/v1/getAllKtAssignmentRequest",ktAssignmentController.getMyKtRequests);
    app.get("/api/v1/getPendingForApproval",ktAssignmentController.getPendingForApproval);
    app.get("/api/v1/getApprovedRequests",ktAssignmentController.getApprovedRequests);
    app.get("/api/v1/getRejectedRequests",ktAssignmentController.getRejectedRequests);
    app.put("/api/v1/updateKTApprovalStatus",ktAssignmentController.updateKTApprovalStatus);
    app.get("/api/v1/getCompletedAssignmentDetails/:assignment_id",ktAssignmentController.getCompletedAssignmentDetails);
    app.get("/api/v1/getAllResignationEmp",ktAssignmentController.getAllResignationEmp);
}