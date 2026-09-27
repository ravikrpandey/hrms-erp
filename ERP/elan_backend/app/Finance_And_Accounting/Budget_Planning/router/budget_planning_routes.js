const budgetPlanningController = require("../controllers/budget_planning_controller");

module.exports = app => {

    app.post("/api/v1/create_budgetPlanning", budgetPlanningController.create_budgetPlanning);
    app.post("/api/v1/bulk_approval_request", budgetPlanningController.bulk_approval_request);
    app.get("/api/v1/get_approval_request_by_departmentId", budgetPlanningController.get_approval_request_by_departmentId);
    app.get("/api/v1/getAll_budgetPlanning/:id", budgetPlanningController.getAll_budgetPlanning);
    app.get("/api/v1/getById_budgetPlanning/:id", budgetPlanningController.getById_budgetPlanning);
    app.put("/api/v1/update_budgetPlanning/:id", budgetPlanningController.update_budgetPlanning);
    app.put("/api/v1/map_budget_planning_with_cc/:id", budgetPlanningController.map_budget_planning_with_cc);
} 