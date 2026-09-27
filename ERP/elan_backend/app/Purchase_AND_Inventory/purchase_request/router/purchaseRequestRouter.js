const purchaseController = require("../controller/pucrchseRequestController");

module.exports = (app) => {
  app.post("/api/v1/createPer", purchaseController.createPer);
  app.put("/api/v1/UpdatePer/:pr_id", purchaseController.UpdatePer);
  app.post(
    "/api/v1/get_levels_to_be_approved_pr/:id",
    purchaseController.get_levels_to_be_approved_pr,
  );
  app.post(
    "/api/v1/get_Rejected_Approvals_pr/:id",
    purchaseController.get_Rejected_Approvals_pr,
  );
  app.post(
    "/api/v1/get_Approved_Approvals_pr/:id",
    purchaseController.get_Approved_Approvals_pr,
  );
  app.post(
    "/api/v1/approve_levels_pr/:id",
    purchaseController.approve_levels_pr,
  );
  app.post(
    "/api/v1/getAll_Approval_level_pr/:pr_id",
    purchaseController.getAll_Approval_level_pr,
  );
  app.get(
    "/api/v1/get_item_master/:id/:sub_category_id",
    purchaseController.get_item_master,
  );
  app.get(
    "/api/v1/get_employee_data/:id",
    purchaseController.get_employee_data,
  );
  app.post("/api/v1/budget_data", purchaseController.budget_data);
  app.post("/api/v1/get_all_pr", purchaseController.get_all_pr);
  app.get("/api/v1/get_all_pr_id/:id", purchaseController.get_all_pr_id);
  app.get(
    "/api/v1/get_service_master/:id",
    purchaseController.get_service_master,
  );
  app.post(
    "/api/v1/get_budget_details_pr",
    purchaseController.get_budget_details_pr,
  );
  app.post("/api/v1/generate_PR_No", purchaseController.generate_PR_No);
  app.get(
    "/api/v1/get_all_vendor_name",
    purchaseController.get_all_vendor_name,
  );

  app.post(
    "/api/v1/getSpendByPRcategory/:entity_id",
    purchaseController.getSpendByPRcategory,
  );
  app.post(
    "/api/v1/getTotalSpendByVendors/:entity_id",
    purchaseController.getTotalSpendByVendors,
  );
  app.post(
    "/api/v1/getTotalSpendByDepartment/:entity_id",
    purchaseController.getTotalSpendByDepartment,
  );
  app.post(
    "/api/v1/getTotalSpendOnCategory/:entity_id",
    purchaseController.getTotalSpendOnCategory,
  );
  app.post(
    "/api/v1/getTotalSpend/:entity_id",
    purchaseController.getTotalSpend,
  );
  app.get(
    "/api/v1/getSpendTrends/:entity_id",
    purchaseController.getSpendTrends,
  );
  app.get(
    "/api/v1/getSpendForecastTrends/:entity_id",
    purchaseController.getSpendForecastTrends,
  );
  app.get("/api/v1/downloadPRById/:id", purchaseController.downloadPRById);
};
