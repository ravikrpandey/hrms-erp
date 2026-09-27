const voucherController = require("../controllers/voucher.controller");

module.exports = app =>{
    app.get('/api/v1/getAllVoucher',voucherController.getAllVoucherData)
    app.get('/api/v1/generateServies',voucherController.generateSeriesData)
    app.get('/api/v1/getVoucherById/:id',voucherController.getVoucherById)
    app.post('/api/v1/createVoucherData',voucherController.createVoucherData)
    app.delete('/api/v1/deleteVoucherById/:id',voucherController.deleteVoucherById)
    app.put('/api/v1/updateVoucherData/:id',voucherController.updateVoucherData)
   
   
}
