const vehical_driverController = require("../controller/driver_mastercontroller");

module.exports = app => {
app.post("/api/v1/create_vehicle_driver",vehical_driverController.create_vehicle_driver);
app.get("/api/v1/getAll_Vehicle_driver",vehical_driverController.getAll_Vehicle_driver);
app.get("/api/v1/get_vehicle_driver_by_id",vehical_driverController.get_vehicle_driver_by_id);
}