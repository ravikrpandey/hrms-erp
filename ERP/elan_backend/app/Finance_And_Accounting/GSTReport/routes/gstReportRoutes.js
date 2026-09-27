
const express = require('express');
const router = express.Router();

const gstReportController = require('../controller/gstReportController');

router.get('/api/v1/getPurchaseCreditLimitList',gstReportController.getPurchaseCreditLimitList)
router.get('/api/v1/getPurchaseDebitLimitList',gstReportController.getPurchaseDebitLimitList)
router.get('/api/v1/purchaseRegister',gstReportController.purchaseRegister)
router.get('/api/v1/getSalesCreditLimitList',gstReportController.getSalesCreditLimitList)
router.get('/api/v1/getSalesDebitNoteList',gstReportController.getSalesDebitNoteList)
router.get('/api/v1/getInputOutputGstReport',gstReportController.getInputOutputGstReport)
router.get('/api/v1/getSalesRegisterGSTReport',gstReportController.getSalesRegisterGSTReport)

module.exports = router;