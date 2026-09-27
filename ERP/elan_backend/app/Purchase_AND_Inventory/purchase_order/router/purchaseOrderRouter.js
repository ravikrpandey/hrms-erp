const purchaseOrderController = require("../controller/purchaseOrderController");

module.exports = (app) => {
  app.get("/api/v1/getAllLocation", purchaseOrderController.getAllLocation);
  app.post("/api/v1/createPO", purchaseOrderController.createPO);
  app.put("/api/v1/UpdatePO/:po_id", purchaseOrderController.UpdatePO);
  app.get(
    "/api/v1/getAllCostCenterbyDep/:dept_id",
    purchaseOrderController.getAllCostCenterbyDep,
  );
  app.post(
    "/api/v1/approve_levels_po/:id",
    purchaseOrderController.approve_levels_po,
  );
  app.post(
    "/api/v1/getAll_Approval_level_po/:po_id",
    purchaseOrderController.getAll_Approval_level_po,
  );
  app.get(
    "/api/v1/get_to_be_approved_po/:id",
    purchaseOrderController.get_to_be_approved_po,
  );
  app.get(
    "/api/v1/get_Approved_Approvals_po/:id",
    purchaseOrderController.get_Approved_Approvals_po,
  );
  app.get(
    "/api/v1/get_Rejected_Approvals_po/:id",
    purchaseOrderController.get_Rejected_Approvals_po,
  );
  app.post("/api/v1/get_allPO", purchaseOrderController.get_allPO);
  app.get("/api/v1/get_allPO_id/:id", purchaseOrderController.get_allPO_id);
  app.post("/api/v1/getAll_draftPO", purchaseOrderController.getAll_draftPO);
  app.post("/api/v1/generate_Po_No", purchaseOrderController.generate_Po_No);
  app.put(
    "/api/v1/update_draft_po/:po_id",
    purchaseOrderController.update_draft_po,
  );
  app.get(
    "/api/v1/get_all_PR_for_PO",
    purchaseOrderController.get_all_PR_for_PO,
  );
  app.get(
    "/api/v1/get_all_Quotation_for_PO",
    purchaseOrderController.get_all_Quotation_for_PO,
  );
  app.get(
    "/api/v1/getQuantityLedger",
    purchaseOrderController.getQuantityLedger,
  );
  app.get(
    "/api/v1/download_purchase_order_pdf",
    purchaseOrderController.download_purchase_order_pdf,
  );
  app.post(
    "/api/v1/getPurchaseDataCount/:entity_id/:emp_id",
    purchaseOrderController.getPurchaseDataCount,
  );
  app.put(
    "/api/v1/updateshipingstatus",
    purchaseOrderController.updateshipingstatus,
  );
  app.get(
    "/api/v1/get_Creator_Approved_POs/:id",
    purchaseOrderController.get_Creator_Approved_POs,
  );
  app.get(
    "/api/v1/getCHAForwarderList",
    purchaseOrderController.getCHAForwarderList,
  );
  app.get(
    "/api/v1/getCHAForwarderModeList",
    purchaseOrderController.getCHAForwarderModeList,
  );
  app.post(
    "/api/v1/createOrUpdateBOE",
    purchaseOrderController.createOrUpdateBOE,
  );
  app.put("/api/v1/claimItemsCHA", purchaseOrderController.claimItemsCHA);
  app.put("/api/v1/updateCHACharges", purchaseOrderController.updateCHACharges);
  app.delete(
    "/api/v1/deleteCHADocument",
    purchaseOrderController.deleteCHADocument,
  );
  app.put("/api/v1/generateCHABill", purchaseOrderController.generateCHABill);
  app.post(
    "/api/v1/createOrUpdateForwarder",
    purchaseOrderController.createOrUpdateForwarder,
  );
  app.get(
    "/api/v1/getGateInwardList",
    purchaseOrderController.getGateInwardList,
  );
  app.put(
    "/api/v1/receivedPOFromGateInward",
    purchaseOrderController.receivedPOFromGateInward,
  );
  app.delete("/api/v1/deletePO/:po_id", purchaseOrderController.deletePO);
  app.get(
    "/api/v1/downloadPurchaseOrderById/:id",
    purchaseOrderController.downloadPurchaseOrderById,
  );
};
