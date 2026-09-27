const GrnController = require("../controller/grnController");

module.exports = (app) => {
  app.get("/api/v1/Code_grn_create", GrnController.Code_grn_create);
  app.post("/api/v1/create_grn", GrnController.create_grn);
  app.post("/api/v1/createGRN", GrnController.create_final_GRN);
  app.get("/api/v1/createCode/:id", GrnController.createCode);
  app.get("/api/v1/get_all_po_id", GrnController.get_all_po_id);
  app.put("/api/v1/updateData_GRN/:id", GrnController.updateData_GRN);
  app.put("/api/v1/updateGRN/:id", GrnController.updateGRN);
  app.get("/api/v1/get_all_GRN", GrnController.get_all_completedGRN);
  app.get("/api/v1/get_all_GRN_ID/:id", GrnController.get_all_GRN_ID);
  app.get("/api/v1/get_all_grnItem_id", GrnController.get_all_grnItem_id);
  app.get("/api/v1/get_by_Id_grn", GrnController.get_by_Id_grn);
  app.get("/api/v1/get_GRN_bygrnANDpoID", GrnController.get_GRN_ByPO_AND_GRN_id);
  app.patch("/api/v1/patchGrnDiscard", GrnController.patchGrnDiscard);
  app.get("/api/v1/downloadPurchaseInvoiceById", GrnController.downloadPurchaseInvoiceById);
  app.get("/api/v1/downloadPurchaseGRNById", GrnController.downloadPurchaseGRNById);
  app.get("/api/v1/get_vendor_po_list", GrnController.get_vendor_po_list);
  app.post("/api/v1/bulkUploadSBExcel", GrnController.bulkUploadSBExcel);
};
