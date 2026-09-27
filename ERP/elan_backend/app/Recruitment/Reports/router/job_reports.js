const recruitmentReportsController = require("../controller/job_reportsController");

module.exports = app => {
app.get('/api/v1/getJobdescriptionReport/:entity_id',recruitmentReportsController.getJobdescriptionReport);
app.get('/api/v1/getRecruiterMonthReport/:entity_id',recruitmentReportsController.getRecruiterMonthReport);
app.get('/api/v1/getPositionTimeReport/:entity_id',recruitmentReportsController.getPositionTimeReport);
app.get('/api/v1/getRecruiterLocationReport/:entity_id',recruitmentReportsController.getRecruiterLocationReport);
app.get('/api/v1/getCandidateInterviewRoundReport/:entity_id',recruitmentReportsController.getCandidateInterviewRoundReport);
app.get('/api/v1/getRecruiterProductivityReport/:entity_id',recruitmentReportsController.getRecruiterProductivityReport);
app.get('/api/v1/getRecruiterRoundReport/:entity_id',recruitmentReportsController.getRecruiterRoundReport);
app.get('/api/v1/getBackoutCandidatesReport/:entity_id',recruitmentReportsController.getBackoutCandidatesReport);
app.get('/api/v1/getInterviewerReport/:entity_id',recruitmentReportsController.getInterviewerReport);
app.get('/api/v1/getMonthlyInterviewerReport/:entity_id',recruitmentReportsController.getMonthlyInterviewerReport);
app.get('/api/v1/getInterviewerStatusReport/:entity_id',recruitmentReportsController.getInterviewerStatusReport);
app.get('/api/v1/getOnboardingReport/:entity_id',recruitmentReportsController.getOnboardingReport);
}