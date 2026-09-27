const bankPaymentVoucher = require("../controllers/bankPaymentController");

module.exports = app =>{
    app.get('/api/v1/getAllBankPaymentVoucherData',bankPaymentVoucher.getAllBankPaymentVoucherData)
    app.post('/api/v1/createBankPaymentVoucherData',bankPaymentVoucher.createBankPaymentVoucherData)
    app.get('/api/v1/generateBankPaymentVoucher',bankPaymentVoucher.generateBankPaymentVoucher)
    app.delete('/api/v1/deletebankPaymentData/:id',bankPaymentVoucher.deletebankPaymentData)
    app.get('/api/v1/getBankPaymentVoucher/:id',bankPaymentVoucher.getBankPaymentVoucher)
    app.put('/api/v1/updateBankPaymentVoucherData/:id',bankPaymentVoucher.updateBankPaymentVoucherData)
    app.put('/api/v1/generateBankPaymentNumber',bankPaymentVoucher.generateBankPaymentNumber)
   
   
}