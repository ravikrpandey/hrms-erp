const maintenanceController = require('../controller/maintenanceController');
const { upload } = require("../../middleware/production_doc");
module.exports = app => {
   app.post("/api/v1/create_plan_maintenance",upload.array('image_upload',15), maintenanceController.create_plan_maintenance);
   app.put("/api/v1/Update_plan_maintenance",upload.array('image_upload',15), maintenanceController.Update_plan_maintenance);
   app.get("/api/v1/getall_Plan_Maintenance",maintenanceController.getall_Plan_Maintenance)
   app.get("/api/v1/getAllPending_maintenance",maintenanceController.getAllPending_maintenance)
   app.get("/api/v1/getall_Schedule_Maintenanceby_status",maintenanceController.getall_Schedule_Maintenanceby_status)
   app.get("/api/v1/getSchedule_Maintenanceby_Id",maintenanceController.getSchedule_Maintenanceby_Id)
   app.get("/api/v1/getAllAssetTag_id",maintenanceController.getAllAssetTag_id)
   app.get("/api/v1/getAllAssetbyCat_id",maintenanceController.getAllAssetbyCat_id)
   app.put("/api/v1/maintenanceApprove_Reject",maintenanceController.maintenanceApprove_Reject)
   app.get("/api/v1/getAll_remark_ByPlanId",maintenanceController.getAll_remark_ByPlanId);
   app.get("/api/v1/getAll_maintenanceTypeby_Workstation_id",maintenanceController.getAll_maintenanceTypeby_Workstation_id);
}
