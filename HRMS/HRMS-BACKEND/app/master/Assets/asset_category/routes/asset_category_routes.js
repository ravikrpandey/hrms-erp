module.exports = (app) => {
    const controller = require("../controller/asset_category_controller");

    app.post("/api/v1/assetCategoryCreate", controller.assetCategoryCreate);
    app.get("/api/v1/assetCategoryList", controller.assetCategoryList);
    app.get("/api/v1/getassetCategoryListActiveStatus", controller.getassetCategoryListActiveStatus);
    app.get("/api/v1/assetCategoryById/:asset_category_id", controller.assetCategoryById);
    app.put("/api/v1/assetCategoryUpdate/:asset_category_id", controller.assetCategoryUpdate);
    app.put("/api/v1/updateAssetCategoryStatus/:asset_category_id", controller.updateAssetCategoryStatus);
    app.delete("/api/v1/deleteAssetCategoryById/:asset_category_id", controller.deleteAssetCategoryById);
};
