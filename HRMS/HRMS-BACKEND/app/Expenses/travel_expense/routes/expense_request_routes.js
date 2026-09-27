const expense_request = require('../controller/travel_expense_controller')

module.exports = app => {
    app.get('/api/v1/get_all_travel', expense_request.getAlltravel)
    app.get('/api/v1/get_travel_details/:id', expense_request.getTravelDetailsData)
    app.post('/api/v1/create_expense_request', expense_request.createExpRequest)
    app.post('/api/v1/get_all_exp_request', expense_request.getallExpRequest)
    app.get('/api/v1/get_expense_request_by_id/:id', expense_request.getExpenseRequestById)
    app.delete('/api/v1/delete_expense_request/:id', expense_request.deleteExpenseRequestById)
    app.put('/api/v1/update_expense_request', expense_request.updateExpRequest)
    app.get("/api/v1/get_exp_levels_to_be_approved/:employee_id/:entity_id", expense_request.getExpLevelsToBeApproved);
    app.get("/api/v1/get_expense_rejected_list/:id/:entity_id", expense_request.getExpenseRejectedList);
    app.get("/api/v1/get_expense_approved_list/:id/:entity_id", expense_request.getApprovedExpenseRequest);
    app.post("/api/v1/expense_approved_level/:expense_id", expense_request.expenseApprovelLevels);

    app.post("/api/v1/get_all_approver_level/:expense_id", expense_request.allExpenseApprovalLevel);


    // other expense
    app.get("/api/v1/get_by_otherExpense/:id", expense_request.get_by_otherExpense);
    app.get("/api/v1/get_all_otherExpense/:employee_id/:entity_id", expense_request.get_all_otherExpense);

    app.post("/api/v1/myotherExpense_All", expense_request.myotherExpense_All);
    app.get("/api/v1/getBudgetDataOfGrade/:toCityId", expense_request.getBudgetDataOfGrade);
    app.get("/api/v1/getLocalConveyanceDataOfGrade", expense_request.getLocalConveyanceDataOfGrade);
    app.get("/api/v1/getReimbursementDataOfGrade", expense_request.getReimbursementDataOfGrade);
    app.get("/api/v1/getTravelRequestOfEmp", expense_request.getTravelRequestOfEmp);
    app.get("/api/v1/getTravelJourneyByDate", expense_request.getTravelJourneyByDate);
}