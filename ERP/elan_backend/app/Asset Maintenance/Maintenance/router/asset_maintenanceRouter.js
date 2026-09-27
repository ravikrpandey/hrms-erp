const assetMaintenanceController = require("../controller/asset_maintenanceController");
const { upload } = require("../../../middleware/uploadDocs");


module.exports = app => {
    app.post("/api/v1/createAssetMaintenance", assetMaintenanceController.createAssetMaintenance);
    app.get("/api/v1/getAllVendorsForMaintenance/:entity_id", assetMaintenanceController.getAllVendorsForMaintenance);
    app.get("/api/v1/getAllAssetsForMaintenance/:entity_id", assetMaintenanceController.getAllAssetsForMaintenance);
    app.get("/api/v1/getAllMaintenanceList/:entity_id", assetMaintenanceController.getAllMaintenanceList);
    app.get("/api/v1/getMaintenanceListById/:id", assetMaintenanceController.getMaintenanceListById);
    app.patch("/api/v1/updateAssetMaintenance/:id", assetMaintenanceController.updateAssetMaintenance);
    app.get("/api/v1/getMaintenanceListByIdForAssetView/:asset_tagIds", assetMaintenanceController.getMaintenanceListByIdForAssetView);

    app.post("/api/v1/createAssetCategory", assetMaintenanceController.createAssetCategory);
    app.put("/api/v1/updateAssetCategory/:id", assetMaintenanceController.updateAssetCategory);
    app.get("/api/v1/getAllAssetCategory/:entity_id", assetMaintenanceController.getAllAssetCategory);
    app.get("/api/v1/getAssetCategoryById/:category_id", assetMaintenanceController.getAssetCategoryById);
    app.put("/api/v1/change_repairCategory_status",assetMaintenanceController.changeRepairCategoryStatus);
    app.post("/api/v1/getRepairCategoryByAssetCat", assetMaintenanceController.getRepairCategoryByAssetCat);

}