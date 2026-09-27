const budgetPlanController = require("../controllers/budget_plandate_controller");

module.exports = app => {

    app.post("/api/v1/create_budgetPlan", budgetPlanController.create_budgetPlan);
    app.get("/api/v1/getAll_active_budgetPlan", budgetPlanController.getAll_active_budgetPlan);
    app.get("/api/v1/getAll_budgetPlan", budgetPlanController.getAll_budgetPlan);
    app.get("/api/v1/getById_budgetPlan/:id", budgetPlanController.getById_budgetPlan);
    app.delete("/api/v1/delete_budgetPlan/:id", budgetPlanController.delete_budgetPlan);
    app.put("/api/v1/update_budgetPlan/:id", budgetPlanController.update_budgetPlan);
    app.get("/api/v1/getAll_ExtendDate_With_budgetPlan/:id", budgetPlanController.getAll_ExtendDate_With_budgetPlan);
}