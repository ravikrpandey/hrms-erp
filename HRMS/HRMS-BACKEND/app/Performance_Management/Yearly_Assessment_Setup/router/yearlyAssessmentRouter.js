const Assessment_Controller = require("../controller/yearlyAssessmentController")

module.exports = app =>{
    app.post("/api/v1/create_assessment", Assessment_Controller.createAssessment);
    app.get("/api/v1/getAll_assessment/:id", Assessment_Controller.getAll_Assessment);
    app.get("/api/v1/get_assessmentById/:id", Assessment_Controller.getAssessmentById);
    app.put("/api/v1/update_assessmentById/:id", Assessment_Controller.updateAssessmentById);
    app.delete("/api/v1/deleteAssessmentById/:id", Assessment_Controller.deleteAssessmentById);
    app.get("/api/v1/get_assessment_financial_year", Assessment_Controller.get_Assessment_financeYear);
    app.put("/api/v1/status_assessment/:id", Assessment_Controller.YrAssessmentStatus);
    app.get('/api/v1/get_department_data', Assessment_Controller.departMentSelected)
    

}