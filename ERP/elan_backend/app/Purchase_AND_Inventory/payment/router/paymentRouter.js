const PaymentController = require("../controller/paymentContoller");

module.exports = app => {
   app.post("/api/v1/createPaymentinvoice", PaymentController.createPaymentinvoice)
   app.get("/api/v1/getbankaccountname", PaymentController.getbankaccountname)
   app.get("/api/v1/getpaymentInvoiceData", PaymentController.getpaymentInvoiceData)
}