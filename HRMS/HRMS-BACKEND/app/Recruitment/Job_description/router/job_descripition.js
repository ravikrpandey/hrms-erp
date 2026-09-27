const jobController = require("../controller/job_descipitionController");



module.exports = app => {
    app.get("/api/v1/approved_request", jobController.get_Approved_Jobdescription);
    app.post("/api/v1/createJob_descripition", jobController.createJob_descripition);
    app.get("/api/v1/getAll_job_descripition/:id", jobController.getAll_job_descripition);
    app.post("/api/v1/createjob_email", jobController.createjob_email);
    app.get("/api/v1/get_all_job", jobController.get_all_job);
    app.get("/api/v1/get_all_question",jobController.get_all_question);
    app.put("/api/v1/get_user_selection_answer/:id",jobController.get_user_selection_answer);
    app.get("/api/v1/download_jd_doc/:fileName",jobController.download_jd_doc);
    app.get("/api/v1/get_all_approved_jobrequest",jobController.get_all_approved_jobrequest);
    app.get("/api/v1/get_all_jobrequest",jobController.get_all_jobrequest);
}