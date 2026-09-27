const assetWarrantyController = require("../controller/asset_warrantyListController");
const { upload } = require("../../../middleware/uploadDocs");

module.exports = app =>{
    app.post("/api/v1/createAssetWarranty", assetWarrantyController.createAssetWarranty);
    app.get("/api/v1/getAssetWarranties/:entity_id", assetWarrantyController.getAssetWarranties);
    app.get("/api/v1/getAssetWarrantiesById/:id", assetWarrantyController.getAssetWarrantiesById);
    app.patch("/api/v1/updateAssetWarranty/:id", assetWarrantyController.updateAssetWarranty);
    app.delete("/api/v1/deleteAssetWarranty/:id", assetWarrantyController.deleteAssetWarranty);
    app.get("/api/v1/getAssetWarrantiesByIdForAssetView/:assetTagId", assetWarrantyController.getAssetWarrantiesByIdForAssetView);
}