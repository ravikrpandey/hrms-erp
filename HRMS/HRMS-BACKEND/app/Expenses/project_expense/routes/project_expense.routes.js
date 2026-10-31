const controller = require("../controller/project_expense.controller");
const { upload } = require("../../../middleware/uploadDocs");

const uploadFile = (req, res, next) => {
  const handler = upload.single("file");
  handler(req, res, (err) => {
    if (err) {
      console.warn("File upload notice:", err);
    }
    next();
  });
};

module.exports = (app) => {
  app.get("/api/v1/expense/user-role", controller.getUserRoleInfo);
  app.get("/api/v1/expense/projects", controller.getProjects);
  app.get("/api/v1/expense/categories", controller.getCategories);
  app.post("/api/v1/expense", uploadFile, controller.createExpense);
  app.get("/api/v1/expense", controller.getAllExpenses);
  app.get("/api/v1/expense/:id", controller.getExpenseById);
  app.put("/api/v1/expense/:id", uploadFile, controller.updateExpense);
  app.post("/api/v1/expense/:id/approve", controller.approveExpense);
  app.post("/api/v1/expense/:id/reject", controller.rejectExpense);
  app.delete("/api/v1/expense/:id", controller.deleteExpense);
};

