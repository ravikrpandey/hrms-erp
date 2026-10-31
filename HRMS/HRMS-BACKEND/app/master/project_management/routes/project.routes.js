module.exports = (app) => {
  const projectController = require("../controller/project.controller");
  const taskController = require("../controller/task.controller");
  const expenseReportController = require("../controller/expenseReport.controller");

  app.get("/api/v1/pm/reports/expense-report", expenseReportController.getExpenseReport);
  app.get("/api/v1/pm/reports/expense-report/export", expenseReportController.exportExpenseReport);

  app.post("/api/v1/pm/projects", projectController.createProject);
  app.get("/api/v1/pm/projects", projectController.getAllProjects);
  app.get("/api/v1/pm/projects/next-code", projectController.getNextProjectCode);
  app.get("/api/v1/pm/projects/:id", projectController.getProjectById);
  app.put("/api/v1/pm/projects/:id", projectController.updateProject);
  app.delete("/api/v1/pm/projects/:id", projectController.deleteProject);

  app.post("/api/v1/pm/projects/:id/members", projectController.addProjectMember);
  app.get("/api/v1/pm/projects/:id/members", projectController.getProjectMembers);
  app.put("/api/v1/pm/projects/:id/members/:memberId", projectController.updateProjectMember);
  app.delete("/api/v1/pm/projects/:id/members/:memberId", projectController.removeProjectMember);

  app.get("/api/v1/pm/projects/:id/milestones", projectController.getProjectMilestones);
  app.post("/api/v1/pm/projects/:id/milestones", projectController.createProjectMilestone);
  app.put("/api/v1/pm/projects/:id/milestones/reorder", projectController.reorderProjectMilestones);
  app.put("/api/v1/pm/projects/:id/milestones/:milestoneId", projectController.updateProjectMilestone);
  app.delete("/api/v1/pm/projects/:id/milestones/:milestoneId", projectController.deleteProjectMilestone);

  app.get("/api/v1/pm/employees", projectController.getEmployeesForDropdown);
  app.get("/api/v1/pm/departments", projectController.getDepartmentsForDropdown);

  app.post("/api/v1/pm/tasks", taskController.createTask);
  app.get("/api/v1/pm/tasks", taskController.getAllTasks);
  app.get("/api/v1/pm/tasks/:id", taskController.getTaskById);
  app.put("/api/v1/pm/tasks/:id", taskController.updateTask);
  app.put("/api/v1/pm/tasks/:id/review", taskController.reviewTask);
  app.delete("/api/v1/pm/tasks/:id", taskController.deleteTask);
  app.get("/api/v1/pm/tasks/:id/activity", taskController.getTaskActivity);
  app.post("/api/v1/pm/tasks/:id/comments", taskController.createComment);
  app.put("/api/v1/pm/tasks/:id/comments/:commentId", taskController.updateComment);
  app.delete("/api/v1/pm/tasks/:id/comments/:commentId", taskController.deleteComment);
};

