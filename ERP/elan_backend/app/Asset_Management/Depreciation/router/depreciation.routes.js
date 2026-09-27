const depreciationController = require("../controller/depreciation_controller");
const { upload } = require("../../../middleware/uploadDocs");

module.exports = app => {

    app.post("/api/v1/create_asset_depreciation", depreciationController.create_asset_depreciation);
    app.get("/api/v1/getAll_asset_depreciation", depreciationController.getAll_asset_depreciation);
    app.get("/api/v1/getById_asset_depreciation/:id", depreciationController.getById_asset_depreciation);
    app.put("/api/v1/update_asset_depreciation/:id",  depreciationController.update_asset_depreciation);
    app.delete("/api/v1/delete_asset_depreciation/:id",  depreciationController.delete_asset_depreciation);
    app.get("/api/v1/download_asset_depreciation_format",  depreciationController.download_asset_depreciation_format);
    app.post("/api/v1/bulkCreate_asset_depreciation",upload.array('file', 1), depreciationController.bulkCreate_asset_depreciation);
    app.get("/api/v1/getCalculationMethods", depreciationController.getCalculationMethods);
    app.post("/api/v1/createDepreciationCalculations", depreciationController.createDepreciationCalculations);
    app.get("/api/v1/getAllCreateDepreciationCalculations", depreciationController.getAllCreateDepreciationCalculations);
    app.get("/api/v1/getCreateDepreciationCalculationsById/:id/:entity_id", depreciationController.getCreateDepreciationCalculationsById);
    app.put("/api/v1/updateDepreciationCalculations/:id", depreciationController.updateDepreciationCalculations);
    app.delete("/api/v1/deleteDepreciationCalculation/:id", depreciationController.deleteDepreciationCalculation);
}