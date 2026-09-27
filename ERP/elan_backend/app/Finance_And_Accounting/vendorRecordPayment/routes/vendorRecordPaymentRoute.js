const express = require('express');
const router = express.Router();

const recordPaymentController = require('../controller/vendorRecordPaymentController');

router.post('/api/v1/createVendorRecordPayment',recordPaymentController.createVendorRecordPayment);
router.get('/api/v1/getAllVendorRecordPayment',recordPaymentController.getAllVendorRecordPayment);
router.get('/api/v1/createVendorPaymentVoucherSeries',recordPaymentController.createVendorPaymentVoucherSeries);
router.post('/api/v1/getVendorPaymentHistoryByVendor',recordPaymentController.getVendorPaymentHistoryByVendor);

module.exports = router;