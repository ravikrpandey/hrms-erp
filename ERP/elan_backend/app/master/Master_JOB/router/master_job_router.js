const master_job_Controller = require("../controller/master_job_controller");

module.exports = app =>{
 app.get("/api/v1/getAll_Job_Profile_Type",master_job_Controller.getAll_Job_Profile_Type);
 app.get("/api/v1/getAll_Job_Type",master_job_Controller.getAll_Job_Type);
}