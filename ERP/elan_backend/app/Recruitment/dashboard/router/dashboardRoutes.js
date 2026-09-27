const recruitmentDashboardController = require("../controller/dashboardController");

module.exports = app => {
app.post('/api/v1/getRecruitmentDashboard/:entity_id/:created_by',recruitmentDashboardController.getRecruitmentDashboard );
app.post('/api/v1/getRecruitmentAverageTime/:entity_id/:created_by',recruitmentDashboardController.getRecruitmentAverageTime );
app.get('/api/v1/getRecruitmentsForCurrentMonth/:entity_id/:created_by',recruitmentDashboardController.getRecruitmentsForCurrentMonth );
app.get('/api/v1/getRecruitmentsTrends/:entity_id/:created_by/:financial_id',recruitmentDashboardController.getRecruitmentsTrends );
app.post('/api/v1/getRecruitmentPipelineFunnel/:created_by/:entity_id',recruitmentDashboardController.getRecruitmentPipelineFunnel );
app.get('/api/v1/getRecruiters/:entity_id',recruitmentDashboardController.getRecruiters );
app.post('/api/v1/getRecruiterData/:created_by/:entity_id',recruitmentDashboardController.getRecruiterData )
}