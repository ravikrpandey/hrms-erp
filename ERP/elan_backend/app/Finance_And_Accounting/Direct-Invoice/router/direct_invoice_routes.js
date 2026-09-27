const directInvoiceController = require("../controllers/direct__invoice_controller");
const directInvoicePaymentController = require("../controllers/direct_payment_controller");
module.exports = app => {

    app.post("/api/v1/create_direct_invoice", directInvoiceController.createDirectInvoice);
    app.get("/api/v1/getAllDirectInvoices", directInvoiceController.getAllDirectInvoices);
    app.get("/api/v1/getDirectInvoice", directInvoiceController.getDirectInvoice);
    app.get("/api/v1/getDirectInvoiceNumber/:id", directInvoiceController.generateDirectInvoiceNumber);
    app.get("/api/v1/getCustomerCOA", directInvoiceController.getCustomerCOA);
    app.get("/api/v1/getVendorCOA", directInvoiceController.getVendorCOA);
    app.get("/api/v1/getNuitNumber", directInvoiceController.getNuitNo);
    app.get("/api/v1/get_invoice_notes/:invoice_no", directInvoiceController.getIssueNotes);
    
    //payments
    app.get("/api/v1/getCompletedDirectInvoice",directInvoicePaymentController.getCompleteDirectInvoiceById);
    app.post("/api/v1/createPaymentDI", directInvoicePaymentController.createPaymentDI)
    app.post("/api/v1/issueNote", directInvoiceController.issueNote);
    app.get("/api/v1/get_purchase_account_list", directInvoiceController.get_Purchase_Account_List);
    app.get("/api/v1/get_Purchase_VAT_Account_List", directInvoiceController.get_Purchase_VAT_Account_List);
    app.get("/api/v1/is_cc_account_code_present/:account_code/:isVendor", directInvoiceController.isChartOfAccountExist);
    app.get("/api/v1/getProformaInvoiceById/:id", directInvoiceController.getProformaInvoiceById);
    // app.get("/api/v1/getDownloadPayments", directInvoicePaymentController.getDownloadPayments)
}