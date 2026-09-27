const Travel_request_controller=require('../Controller/travel_Request_Controller');
const TravelPlanController=require('../Controller/travel_plan.controller');


module.exports = app => {
    app.get('/api/v1/get_travel_details_by_id/:id/:entity_id', Travel_request_controller.get_Travel_details)
    app.post('/api/v1/create_travel_request/:id', Travel_request_controller.create_travel_request)
    app.post('/api/v1/get_all_travel_request', Travel_request_controller.get_all_travel_request)
    app.get('/api/v1/get_travel_request_by_id/:id', Travel_request_controller.get_travel_request_by_id);
    app.delete('/api/v1/delete_travel_request_by_id/:id', Travel_request_controller.delete_travel_request_by_id)
    app.put('/api/v1/update_travel_request/:id', Travel_request_controller.update_travel_request)
    app.get("/api/v1/get_travel_levels_to_be_approved/:id/:entity_id", Travel_request_controller.get_levels_to_be_approved);
    app.get("/api/v1/get_travel_rejected_approvals/:id/:entity_id", Travel_request_controller.get_Travel_Rejected_Approvals);
    app.get("/api/v1/get_travel_approvals_list/:id/:entity_id", Travel_request_controller.get_Travel_Approved_Approvals);
    app.post("/api/v1/travel_approve_level/:travel_id", Travel_request_controller.travel_approve_levels);
    app.post("/api/v1/get_all_approval_level/:travel_id", Travel_request_controller.All_Travel_Approval_level);
    app.post("/api/v1/get_all_advanced_approved_data", Travel_request_controller.getAllAdvanceTravelData);
    app.get("/api/v1/download_uploaded_documents/:travel_id", Travel_request_controller.downloadUploadTicket);
    app.get("/api/v1/getTravelReport/:entity_id", Travel_request_controller.getTravelReport);
    app.get("/api/v1/getExpenceSummaryReport/:entity_id", Travel_request_controller.getExpenceSummaryReport);
    app.get("/api/v1/getTravelExpenceReport/:entity_id", Travel_request_controller.getTravelExpenceReport);
    app.get("/api/v1/getDepartmentTravelExpenceReport/:entity_id", Travel_request_controller.getDepartmentTravelExpenceReport);
    app.get("/api/v1/getApprovalStatusReport/:entity_id", Travel_request_controller.getApprovalStatusReport);
    app.get("/api/v1/getFrequentlyVisitedCities/:department_id", Travel_request_controller.getFrequentlyVisitedCities);
    app.get("/api/v1/getTopSpendingEmployees/:entity_id/:department_id", Travel_request_controller.getTopSpendingEmployees);
    app.get("/api/v1/getReimbursementReport/:entity_id", Travel_request_controller.getReimbursementReport);
    app.get("/api/v1/getExpenseReimbursementReport/:entity_id", Travel_request_controller.getExpenseReimbursementReport);
    app.get("/api/v1/getExpenseTrendReport/:entity_id", Travel_request_controller.getExpenseTrendReport);
    app.get("/api/v1/getUnsubmittedReport/:entity_id", Travel_request_controller.getUnsubmittedReport);

    // Travel Plan
    app.post('/api/v1/travel/plan/', TravelPlanController.create);
    app.put('/api/v1/travel/plan/', TravelPlanController.update);
    app.get('/api/v1/travel/plan/approve', TravelPlanController.approveTravelPlan);
    app.get('/api/v1/travel/plan/', TravelPlanController.findAll);
    app.delete('/api/v1/travel/plan/', TravelPlanController.delete);
}