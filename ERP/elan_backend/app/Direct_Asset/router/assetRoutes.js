const assetController = require("../controller/assetController");

const { validateAssetAllocation } = require('../validators/asset_allocate_validator');
const { validationResult } = require('express-validator');
const { upload } = require("../../../app/middleware/uploadDocs")


module.exports = app => {
    app.get("/api/v1/generate_asset_tagId", assetController.createAssetTagId);
    app.get("/api/v1/generate_batch_code", assetController.createBatchCode);
    app.post("/api/v1/create_direct_asset/:entity_id/:financial_year_id/:employee_id", assetController.CreateDirectAsset);
    app.put("/api/v1/update_direct_asset/:id", assetController.updateDirectAsset);
    app.post("/api/v1/allocate_assetForm/:assign_by/:grn_item_status_id/:grn_id",
        validateAssetAllocation,assetController.CreateAssetAllocate
    );
    app.post("/api/v1/allocateBulkAsset",assetController.allocateBulkAsset);

    app.get("/api/v1/getAllAsset/:employee_id/:entity_id", assetController.getAllAsset);
    app.get("/api/v1/getNearToSalvageAsset/:entity_id", assetController.getAllNearToSalvageAsset);
    app.get("/api/v1/getAlreadySalvageAsset/:entity_id", assetController.getAllAlreadySalvageAsset);
    app.post('/api/v1/upload_asset_list',  upload.single('file', 1),  assetController.upload_asset_list);
    app.get("/api/v1/getAssetAllocatedEmp/:entity_id", assetController.getAssetAllocatedEmp);
    app.get("/api/v1/getAssetAssetNoteList/:entity_id", assetController.getAssetAssetNoteList);
    app.get("/api/v1/getAssetEmployeeById/:employee_id", assetController.getAssetEmployeeById);

    app.get("/api/v1/getAssetAssignList/:entity_id/:employee_id", assetController.getAssetAssignList);
    app.get("/api/v1/getAllAssetHistory/:entity_id/:employee_id", assetController.getAllAssetHistory);
    app.post("/api/v1/deallocateAsset",assetController.deallocateAsset);
    app.get("/api/v1/getAssetDetailsById/:grn_status_id", assetController.getAssetDetailsById);
    app.get("/api/v1/getAllAssetStatuses",assetController.getAllAssetStatuses);
    app.post("/api/v1/createDisposition",assetController.createDisposition);
    app.get("/api/v1/getAllDisposition",assetController.getAllDisposedAssets);
    app.get("/api/v1/download_asset_note", assetController.downloadAssetNote);
    app.get("/api/v1/getDashboardStats/:entity_id", assetController.getDashboardStats);
    app.get("/api/v1/getDepreciationForAsset/:grn_id", assetController.getDepreciationForAsset);
    app.post("/api/v1/createRevaluation",assetController.createRevaluation);
    app.get("/api/v1/getRevaluedAssets",assetController.getAllRevaluedAssets);
    app.post("/api/v1/getAssetDashboard/:entity_id/:financial_id", assetController.getAssetDashboard);
    app.get("/api/v1/get_writeOff_assetList/:entity_id", assetController.getWriteOffAssetList);
    app.get("/api/v1/get_writeOff_asset_byId/:id", assetController.getWriteOffAssetById);
    app.put("/api/v1/updateDisposition/:disposition_id", assetController.updateDisposition);
    app.get("/api/v1/get_sold_assetList/:entity_id", assetController.getSellAssetList);
     app.get("/api/v1/get_sold_asset_byId/:id", assetController.getSoldAssetById);
}