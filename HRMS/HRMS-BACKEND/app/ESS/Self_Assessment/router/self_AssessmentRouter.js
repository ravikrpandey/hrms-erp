const SelfAssessment =  require('../controller/self_AssessmentController');
const {upload}  = require("../../../middleware/uploadDocs");

module.exports = app =>{
    app.get("/api/v1/get_Self_Assessment/:id", SelfAssessment.getAll_Assessment);
    app.get("/api/v1/getAll_Manager_Assessment/:id", SelfAssessment.getAll_Manager_Assessment);
    app.get("/api/v1/getAll_Approval_Manager/:id", SelfAssessment.getAll_Approval_Manager); //used for Apprvoal manager assessment
    app.get("/api/v1/getall_kpa_self_Assessment/:id",SelfAssessment.getAll_kpaSelfAssessment);
    app.get("/api/v1/get_selfemployee/:id", SelfAssessment.get_SelfAssessmentEmployee);
    app.post("/api/v1/submit_self_assessment",SelfAssessment.submitAssessment);
    app.get("/api/v1/get_submited_self_assessment/:id", SelfAssessment.getSubmit_SelfAssessment);
    app.get("/api/v1/get_by_id_self_assessment", SelfAssessment.get_by_id_self_assessment);
    app.put("/api/v1/updateSubmit_SelfAssessment", SelfAssessment.updateSubmit_SelfAssessment);
    app.get("/api/v1/getall_total_team_member", SelfAssessment.getall_total_team_member);
    app.post("/api/v1/assign_committee_user_for_assessment", SelfAssessment.assign_committee_user_for_assessment);
}