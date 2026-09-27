module.exports = (app) => {
    const controller = require("../controller/asset_allotment_controller");

    app.post("/api/v1/assetAllotmentCreate", controller.assetAllotmentCreate);
    app.get("/api/v1/getAllAssetAllotmentList", controller.getAllAssetAllotmentList);
    app.get("/api/v1/getAllssetAllotmentListActiveStatus", controller.getAllssetAllotmentListActiveStatus);
    app.get("/api/v1/getassetAllotmentById/:asset_allotment_id", controller.getassetAllotmentById);
    app.put("/api/v1/assetAllotmentUpdate/:asset_allotment_id", controller.assetAllotmentUpdate);
    app.put("/api/v1/updateAssetAllotmentStatus/:asset_allotment_id", controller.updateAssetAllotmentStatus);
};
