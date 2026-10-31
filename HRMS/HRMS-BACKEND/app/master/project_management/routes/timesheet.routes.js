const timesheetController = require("../controller/timesheet.controller.js");

module.exports = (app) => {
  app.post("/api/v1/pm/timesheet/logs", timesheetController.createLog);
  app.get("/api/v1/pm/timesheet/logs", timesheetController.getLogList);
  app.get("/api/v1/pm/timesheet/logs/summary", timesheetController.getLogSummary);
  app.get("/api/v1/pm/timesheet/weekly-matrix", timesheetController.getWeeklyMatrix);
  app.get("/api/v1/pm/timesheet/logs/:id", timesheetController.getLogById);
  app.put("/api/v1/pm/timesheet/logs/:id", timesheetController.updateLog);
  app.delete("/api/v1/pm/timesheet/logs/:id", timesheetController.deleteLog);

  app.get("/api/v1/pm/timesheet/jobs", timesheetController.getJobs);
  app.get("/api/v1/pm/timesheet/projects-summary", timesheetController.getProjectsSummary);
  app.get("/api/v1/pm/timesheet/job-schedule", timesheetController.getJobSchedule);

  app.post("/api/v1/pm/timesheet/submissions", timesheetController.submitTimesheet);
  app.get("/api/v1/pm/timesheet/submissions", timesheetController.getSubmissions);
  app.get("/api/v1/pm/timesheet/submissions/:id", timesheetController.getSubmissionById);
  app.put("/api/v1/pm/timesheet/submissions/:id/status", timesheetController.updateSubmissionStatus);
  app.get("/api/v1/pm/timesheet/submissions/:id/activities", timesheetController.getSubmissionActivities);
  app.post("/api/v1/pm/timesheet/submissions/:id/comments", timesheetController.addSubmissionComment);
};
