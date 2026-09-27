const companyDepreciationController = require("../controller/company_depreciationMaster");
const { upload } = require("../../../middleware/uploadDocs");


module.exports = app => {
    app.get("/api/v1/getCalculationMethods", companyDepreciationController.getCalculationMethods);
    app.post("/api/v1/createDepreciationCalculations", companyDepreciationController.createDepreciationCalculations);
    app.get("/api/v1/getAllCreateDepreciationCalculations/:entity_id", companyDepreciationController.getAllCreateDepreciationCalculations);
    app.get("/api/v1/getDepreciationCalculationsById/:id/:entity_id", companyDepreciationController.getDepreciationCalculationsById);
    app.patch("/api/v1/updateDepreciationCalculations/:id", companyDepreciationController.updateDepreciationCalculations);
    app.delete("/api/v1/deleteDepreciationCalculation/:id", companyDepreciationController.deleteDepreciationCalculation);
    app.get("/api/v1/getBasicDetailsForAsset/:id", companyDepreciationController.getBasicDetailsForAsset);
    // app.get("/api/v1/getAllPurchaseOrderDetails/:id", companyDepreciationController.getAllPurchaseOrderDetails);
    app.get("/api/v1/getAllPoDetails/:id", companyDepreciationController.getAllPoDetails);
    app.get("/api/v1/getAllDocsByPO_itemId/:po_itemId", companyDepreciationController.getAllDocsByPO_itemId);
   
    // app.put("/api/v1/updateCompanyDepreciationDocs/:po_itemId", upload.array('file'), companyDepreciationController.updateCompanyDepreciationDocs);
    app.post("/api/v1/createCompanyDepreciationDocs",upload.array('file'), companyDepreciationController.createCompanyDepreciationDocs);
    app.get("/api/v1/calculateAssetDepreciation/:asset_id", companyDepreciationController.calculateAssetDepreciation);
    app.get("/api/v1/getAllCompanyDepreciationDetails/:id", companyDepreciationController.getAllCompanyDepreciationDetails);
    app.get("/api/v1/getAssetCompanyDepriciation/:asset_id", companyDepreciationController.getAssetCompanyDepriciation);

} 