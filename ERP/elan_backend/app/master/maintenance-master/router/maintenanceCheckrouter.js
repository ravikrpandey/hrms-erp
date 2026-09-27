const maintenancecheckController=require('../controller/maintenanceCheckcontroller');

module.exports = app => {
 app.post("/api/v1/create_maintenance_master",maintenancecheckController.create_maintenance_master);
 app.get("/api/v1/getAll_Maintenance_check",maintenancecheckController.getAll_Maintenance_check);
}