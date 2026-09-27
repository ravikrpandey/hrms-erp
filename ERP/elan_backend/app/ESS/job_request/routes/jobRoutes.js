const jobController = require("../controller/jobController");
const { upload }  = require("../../../middleware/uploadDocs");



module.exports = app => {
    app.post("/api/v1/createJob_request",  jobController.createJob_request);
    app.get("/api/v1/getALL_job_request",  jobController.getALL_job_request);
    app.get("/api/v1/getID_job_request/:id",  jobController.getID_job_request);
    app.delete("/api/v1/delete_job_request/:id",  jobController.delete_job_request);
    app.get("/api/v1/get_levels_to_be_approved",  jobController.get_levels_to_be_approved);
    app.get("/api/v1/get_Rejected_Approvals",  jobController.get_Rejected_Approvals);
    app.get("/api/v1/get_Approved_Approvals",  jobController.get_Approved_Approvals);
    app.post("/api/v1/approve_levels/:id", jobController.approve_levels);
    app.post("/api/v1/getAll_Approval_level/:id", jobController.getAll_Approval_level);
    app.post("/api/v1/getAllArea_active", jobController.getAllArea_active);
    app.get("/api/v1/branch_get_active", jobController.branch_get_active);
    app.get("/api/v1/getContractTypes_active/:entity_id/:financial_id", jobController.getContractTypes_active);
    app.get("/api/v1/getAllReason_active/:entity_id", jobController.getAllReason_active);
    app.get("/api/v1/getAllDesignation_active", jobController.getAllDesignation_active);
    app.get("/api/v1/getAllDepartment_all_active", jobController.getAllDepartment_all_active);
    app.post("/api/v1/OpenAI_APi",jobController.OpenAI_APi);
   
}