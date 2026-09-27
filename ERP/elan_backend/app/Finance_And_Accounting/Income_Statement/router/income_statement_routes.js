const incomeStatementController = require("../controllers/income_statement_controller");

module.exports = app => {

    app.get("/api/v1/getall_total_revenue", incomeStatementController.getall_total_revenue);
    app.get("/api/v1/getall_operating_expense", incomeStatementController.getall_operating_expense);
    app.get("/api/v1/getall_variable_cost", incomeStatementController.getall_variable_cost);
    
    app.get("/api/v1/generate_income_statement", incomeStatementController.generate_income_statement);
    app.post("/api/v1/create_income_statement", incomeStatementController.create_income_statement);
    app.get("/api/v1/getById_income_statement/:id", incomeStatementController.getById_income_statement);
    app.get("/api/v1/getall_income_statement", incomeStatementController.getall_income_statement);
    app.get("/api/v1/get_levels_to_be_approved_income", incomeStatementController.get_levels_to_be_approved_income);
    app.get("/api/v1/getall_income_Approval_level/:id", incomeStatementController.getall_income_Approval_level);
    app.get("/api/v1/get_approved_approval_income", incomeStatementController.get_approved_approval_income);
    app.get("/api/v1/get_rejected_approval_income", incomeStatementController.get_rejected_approval_income);
    app.post("/api/v1/income_approve_levels/:id", incomeStatementController.income_approve_levels); 
}