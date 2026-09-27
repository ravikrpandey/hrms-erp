const TeamPerformance = require('../contorller/team_performanceController')
module.exports = app =>{
    app.get("/api/v1/team_performance_assessment/:entity_id", TeamPerformance.getAll_selfAssessment);
    app.get("/api/v1/selfperformance_employee/:entity_id", TeamPerformance.get_SelfAssessmentEmployee);
    app.get("/api/v1/getall_kpa_team_employee_Assessment/:id",TeamPerformance.getAll_kpaSelfAssessment);

}