const PaymentController = require("../controller/InvoiceController");

module.exports = app => {
   app.get("/api/v1/getCompleteGRNInvoiceById",PaymentController.getCompleteGRNInvoiceById);
   app.get("/api/v1/get_all_grnnumberInvoice",PaymentController.get_all_grnnumberInvoice);
   app.post("/api/v1/createPayment", PaymentController.createPayment)
   app.post("/api/v1/createPOInvoice", PaymentController.createPOInvoice)
   app.post("/api/v1/createmultipleposingalInvoice", PaymentController.createmultipleposingalInvoice)
   app.get("/api/v1/getDownloadPayments", PaymentController.getDownloadPayments)
   app.get("/api/v1/get_all_GRN_invoice",  PaymentController.get_all_completedGRNInvoice);
   app.get('/api/v1/getAllInvoiceList', PaymentController.getAllInvoiceList)
   app.get('/api/v1/getCompleteGRNInvoice', PaymentController.getCompleteGRNInvoice)
   app.get('/api/v1/getvendorwithdatepo', PaymentController.getvendorwithdatepo)
   app.get('/api/v1/allExistingPo/:entity_id', PaymentController.allExistingPo)
   app.get('/api/v1/getvendorwithdatepolist', PaymentController.getvendorwithdatepolist)
   app.get('/api/v1/getPOAdvanceUtilization', PaymentController.getPOAdvanceUtilization)
  
   
}