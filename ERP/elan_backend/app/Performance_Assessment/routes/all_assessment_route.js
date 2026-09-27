const teamAssessment = require('../controller/all_assessment_controller')



module.exports = app =>{
    app.get("/api/v1/getall_assessment_dept_wise", teamAssessment.getall_assessment_dept_wise);
    app.get("/api/v1/get_assessmentlist_by_dept", teamAssessment.get_assessmentlist_by_dept);
    app.get("/api/v1/getall_committee_review_list", teamAssessment.getall_committee_review_list);
    app.post("/api/v1/committee_user_self_assessment", teamAssessment.committee_user_self_assessment);
   
}