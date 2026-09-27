const vehical_masterController = require("../controller/vehical_mastercontroller");

module.exports = app => {
    app.post("/api/v1/create_vehicle",vehical_masterController.create_vehicle);
    app.get("/api/v1/getAll_vehicleMaster",vehical_masterController.getAll_vehicleMaster);
    app.get("/api/v1/get_vehicle_master_byId",vehical_masterController.get_vehicle_master_byId);
    app.put("/api/v1/update_vehicle",vehical_masterController.update_vehicle);
    app.get("/api/v1/get_vehicles_by_VendorId/:vendor_id",vehical_masterController.get_vehicles_by_vendorId);
    app.get("/api/v1/get_vehicles_by_vehicle_categoryId/:vehicle_category_id/:entity_id",vehical_masterController.get_vehicles_by_vehcle_catId);
    app.get("/api/v1/get_vehicles_by_vehcle_catIdAndVendorId/:vehicle_category_id/:vendor_id/:entity_id",vehical_masterController.get_vehicles_by_vehcle_catIdAndVendorId);
}