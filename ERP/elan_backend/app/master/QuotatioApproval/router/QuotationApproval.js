const quotationApproval = require('../controllers/QuotationApprovalController');

module.exports = app => {
    app.post("/api/v1/saveQuotationApproval", quotationApproval.saveQuotationApproval);
    app.get("/api/v1/get_all_quotatioApproval", quotationApproval.getAllQuotationApprovals);
    app.get("/api/v1/get_quotationApprovalById/:id", quotationApproval.getQuotationApprovalById);
    app.put("/api/v1/update_quotationApprovalById/:id", quotationApproval.update_quotationApprovalById);
    app.delete("/api/v1/delete_quotatioApproval/:id", quotationApproval.deleteQuotationApproval);
  
    app.get("/api/v1/getAllSubCategory_forquotatioApproval", quotationApproval.getsubcatorgyData);
}