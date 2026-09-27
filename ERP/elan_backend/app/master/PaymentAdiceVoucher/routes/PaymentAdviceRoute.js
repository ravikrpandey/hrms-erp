const paymentAdviceVoucher = require("../controllers/paymentAdviceVouchercontroller");

module.exports = app =>{
    app.get('/api/v1/getAllpaymentVoucher',paymentAdviceVoucher.getAllPaymentVoucherData)
    app.get('/api/v1/generateServiesPaymentAdvice',paymentAdviceVoucher.generateSeriesData)
    app.post('/api/v1/createPaymentAdviceData',paymentAdviceVoucher.createPaymentAdviceData)
    app.delete('/api/v1/deletePaymentAdviceData/:id',paymentAdviceVoucher.deletePaymentAdviceData)
    app.get('/api/v1/getPaymentAdviceVoucher/:id',paymentAdviceVoucher.getPaymentAdviceVoucher)
    app.put('/api/v1/updatePaymentVoucherData/:id',paymentAdviceVoucher.updatePaymentVoucherData)
    app.get('/api/v1/getVendorByIdTdsValue',paymentAdviceVoucher.getVendorByIdTdsValue)
    app.get('/api/v1/getTdsNatureOfTransaction',paymentAdviceVoucher.getTdsNatureOfTransaction)
    app.post('/api/v1/getPOInvoiceDataListById',paymentAdviceVoucher.getPOInvoiceDataListById)
    
}
