module.exports = (app) => {
    const controller = require("../controller/asset_master_controller");

    app.post("/api/v1/assetMasterCreate", controller.assetMasterCreate);
    app.get("/api/v1/getAllAssetMaster", controller.getAllAssetMaster);
    app.get("/api/v1/getAllAssetMasterActiveStatus", controller.getAllAssetMasterActiveStatus);
    app.get("/api/v1/getAssetMasterById/:asset_master_id", controller.getAssetMasterById);
    app.put("/api/v1/assetMasterUpdate/:asset_master_id", controller.assetMasterUpdate);
    app.put("/api/v1/assetMasterStatusUpdate/:asset_master_id", controller.assetMasterStatusUpdate);
    app.delete("/api/v1/deleteAsseMasterById/:asset_master_id", controller.deleteAsseMasterById);
    app.get("/api/v1/getAllAvailableAssetMaster", controller.getAllAvailableAssetMaster);
};
