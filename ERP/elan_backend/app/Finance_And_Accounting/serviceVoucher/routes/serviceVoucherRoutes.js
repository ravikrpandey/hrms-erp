const express = require('express');
const router = express.Router();

const serviceVoucherControllerData = require('../controller/serviceVoucherController');

router.post('/api/v1/createServiceVoucher',serviceVoucherControllerData.createServiceVoucher);
router.put('/api/v1/generateServiceVoucherNumber',serviceVoucherControllerData.generateServiceVoucherNumber);
router.get('/api/v1/getServiceVoucherList',serviceVoucherControllerData.getServiceVoucherList);
router.get('/api/v1/getServiceVoucherById/:id',serviceVoucherControllerData.getServiceVoucherById);
// router.put('/api/v1/gene ratesalesJournalNumber',serviceVoucherController.generatesalesJournalNumber);
module.exports = router;