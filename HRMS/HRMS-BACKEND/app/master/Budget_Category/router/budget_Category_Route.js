const budgetCategoryController = require("../controllers/budget_Category_Controller");

module.exports = app => {

    app.post("/api/v1/create_budget_category", budgetCategoryController.create_budget_category);
    app.get("/api/v1/getall_active_budget_category", budgetCategoryController.getall_active_budget_category);
    app.get("/api/v1/getall_budget_category", budgetCategoryController.getall_budget_category);
    app.get("/api/v1/getbyId_budget_category/:id", budgetCategoryController.getbyId_budget_category);
    app.put("/api/v1/update_budget_category/:id", budgetCategoryController.update_budget_category);
    app.delete("/api/v1/delete_budget_category/:id", budgetCategoryController.delete_budget_category);
}