const assetClass = require('../controller/assetcontroller');

module.exports = app => {
    app.post("/api/v1/createAssets", assetClass.createAssets);
    app.get("/api/v1/assets_get", assetClass.assets_get);
    app.get("/api/v1/active_assets_get", assetClass.active_assets_get);
    app.get("/api/v1/get_All_Category_Master", assetClass.get_All_Category_Master);
    app.get("/api/v1/assets_get_id/:id?", assetClass.assets_get_id);
    app.put("/api/v1/update_asset/:id", assetClass.update_asset);
    app.delete("/api/v1/delete_asset/:id", assetClass.delete_asset);
    app.put("/api/v1/assetStatus/:id", assetClass.assetStatus);
}