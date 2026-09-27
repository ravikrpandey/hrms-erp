const express = require('express');
const router = express.Router();

const customerPaymentController = require('../controller/customerRcordPaymentController');

router.post('/api/v1/createCustomerRecordPayment',customerPaymentController.createCustomerRecordPayment);
router.post('/api/v1/getCustomerPaymentHistoryByVendor',customerPaymentController.getCustomerPaymentHistoryByVendor);

router.post('/api/v1/getDataDynamicById',customerPaymentController.getDataDynamicById);
router.get('/api/v1/getListCustomerRecordPayment',customerPaymentController.getListCustomerRecordPayment);


module.exports = router;