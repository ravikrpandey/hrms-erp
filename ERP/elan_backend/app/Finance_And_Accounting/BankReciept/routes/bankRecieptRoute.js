const express = require('express');
const router = express.Router();

const bankRecieptController = require('../controller/bankRecieptController');

router.post('/api/v1/createbankReciept',bankRecieptController.createBankReciept)
router.get('/api/v1/generateBankRecieptNumber',bankRecieptController.generateBankRecieptNumber)
router.get('/api/v1/getBankRecieptList',bankRecieptController.getBankRecieptList);
router.get('/api/v1/getBankRecieptById',bankRecieptController.getBankRecieptById);
router.get('/api/v1/getBankRecieptReportList',bankRecieptController.getBankRecieptReportList);
router.get('/api/v1/downloadBankRecieptById/:id',bankRecieptController.downloadBankRecieptById);

module.exports = router;