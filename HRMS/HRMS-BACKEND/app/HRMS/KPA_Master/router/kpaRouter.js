const kpaContoller = require("../controller/kpaController")
const kpaObjContoller = require("../controller/kpaObjController")
const assessmentGradController = require("../controller/assessmet-grading-controller");
const resultParamsController = require("../controller/assessment-result-parameters-controller");

module.exports = app => {
    // kpa master related 
    app.post("/api/v1/create_kpa", kpaContoller.createKpa);
    app.get("/api/v1/get_all_kpa/:id", kpaContoller.getallKpa);
    app.get("/api/v1/get_kpa_by_id/:id", kpaContoller.getKpaById);
    app.put("/api/v1/update_kpa/:id", kpaContoller.updateKpa);
    app.delete("/api/v1/delete_kpa/:id", kpaContoller.deleteKpa);
    app.put("/api/v1/kpa_status/:id", kpaContoller.KpaStatus);

    // kpa objectives
    app.get("/api/v1/get_all_kpaObj", kpaObjContoller.getallKpaObj);
    app.post("/api/v1/create_kpaObj", kpaObjContoller.createKpaObj);
    app.get("/api/v1/kpaObjective/:id", kpaObjContoller.getOneKpaObj);
    app.put("/api/v1/kpaObjective/:id", kpaObjContoller.updateKpaObj);
    app.delete("/api/v1/kpaObjective/:id", kpaObjContoller.deleteKpaObj);
    
    // employee 
    app.get("/api/v1/get_kpa_emp_byId/:id", kpaContoller.getkpaemployeeById);

    // self-Assesment grading
    app.get("/api/v1/assessment-grading-master", assessmentGradController.getAllGrades);
    app.post("/api/v1/assessment-grading-master", assessmentGradController.createGrade);
    app.get("/api/v1/assessment-grading-master/:id", assessmentGradController.getOneGrade);
    app.put("/api/v1/assessment-grading-master/:id", assessmentGradController.updateGrade);
    app.delete("/api/v1/assessment-grading-master/:id", assessmentGradController.deleteGrade);

    // assesment result parameters
    app.get("/api/v1/assessment-result-parameters", resultParamsController.getAllResultParams);
    app.post("/api/v1/assessment-result-parameters", resultParamsController.createResultParams);
    app.get("/api/v1/assessment-result-parameters/:id", resultParamsController.getOneResultParams);
    app.put("/api/v1/assessment-result-parameters/:id", resultParamsController.updateResultParams);
    app.delete("/api/v1/assessment-result-parameters/:id", resultParamsController.deleteResultParams);
}