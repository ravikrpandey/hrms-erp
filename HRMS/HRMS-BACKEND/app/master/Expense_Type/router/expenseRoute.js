const expenseController = require("../controllers/expenseController");

module.exports = app => {

    app.post("/api/v1/create_expenseType", expenseController.create_expenseType);
    app.get("/api/v1/getAll_active_expenseType", expenseController.getAll_active_expenseType);
    app.get("/api/v1/getAll_expenseType", expenseController.getAll_expenseType);
    app.get("/api/v1/getById_expenseType/:id", expenseController.getById_expenseType);
    app.delete("/api/v1/delete_expenseType/:id", expenseController.delete_expenseType);
    app.put("/api/v1/update_expenseType/:id", expenseController.update_expenseType);
}