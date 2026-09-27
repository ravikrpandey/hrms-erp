module.exports = (app) => {
    const controller = require("../controller/asset_subcategory_controller");

    app.post("/api/v1/assetSubcategoryCreate", controller.assetSubcategoryCreate);
    app.get("/api/v1/assetSubcategoryList", controller.getAllAssetSubcat);
    app.get("/api/v1/assetSubcategoryListActiveStatus", controller.getAllAssetSubcatActiveStatus);
    app.get("/api/v1/assetSubcategoryById/:asset_subcategory_id", controller.getAssetSubcatById);
    app.put("/api/v1/assetSubcategoryUpdate/:asset_subcategory_id", controller.assetSubcategoryUpdate);
    app.put("/api/v1/updateAssetSubcategoryStatus/:asset_subcategory_id", controller.updateAssetSubcategoryStatus);
    app.delete("/api/v1/deleteAssetSubcategoryById/:asset_subcategory_id", controller.deleteAssetSubcategoryById);
};
