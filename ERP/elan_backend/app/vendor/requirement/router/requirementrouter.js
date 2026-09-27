const requirementController = require("../controller/requirementcontroller");

module.exports = app => {
    app.get("/api/v1/getAll_job_requirement",requirementController.getAll_job_requirement);
    app.get("/api/v1/getAll_Candidate_ProfilebyVendor",requirementController.getAll_Candidate_ProfilebyVendor);
    app.get("/api/v1/getAll_candidate_BY_JD_idByVendor",requirementController.getAll_candidate_BY_JD_idByVendor);
    app.get("/api/v1/getAll_recruiment_report_byvendor",requirementController.getAll_recruiment_report_byvendor);
}