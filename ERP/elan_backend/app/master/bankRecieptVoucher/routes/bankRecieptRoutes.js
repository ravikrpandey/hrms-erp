const bankRecieptVoucher = require("../controllers/bankRecieptvoucher");

module.exports = app =>{
    app.get('/api/v1/getAllBankRecieptData',bankRecieptVoucher.getAllBankRecieptData)
    app.post('/api/v1/createBankRecieptData',bankRecieptVoucher.createBankRecieptData)
    app.get('/api/v1/generateServiesBankRecieptVoucher',bankRecieptVoucher.generateServiesBankRecieptVoucher)
    app.delete('/api/v1/deletebankRecieptData/:id',bankRecieptVoucher.deletebankRecieptData)
    app.get('/api/v1/getBankRecieptVoucher/:id',bankRecieptVoucher.getBankRecieptVoucher)
    app.put('/api/v1/updateBankRecieptVoucherData/:id',bankRecieptVoucher.updateBankRecieptVoucherData)
    app.put('/api/v1/generateBankReceiptNumber',bankRecieptVoucher.generateBankReceiptNumber)
   
   
}