const express = require('express');
const router = express.Router();

const RCMReportController = require('../controller/RCMReportController');

router.get('/api/v1/getRCMPurchaseRegister',RCMReportController.getRCMPurchaseRegister);
router.get('/api/v1/getSacWiseTransactions',RCMReportController.getSacWiseTransactions);

module.exports = router;  