const express = require('express');
const router = express.Router();

const bankPaymentController = require('../controller/bankPaymentController');

router.post('/api/v1/createBankPayment',bankPaymentController.createBankPayment)
router.get('/api/v1/generateBankPaymentNumber',bankPaymentController.generateBankPaymentNumber)
router.get('/api/v1/getBankPaymentList',bankPaymentController.getBankPaymentList);
router.get('/api/v1/getBankPaymentById',bankPaymentController.getBankPaymentById);
router.get('/api/v1/getBankPaymentReportList',bankPaymentController.getBankPaymentReportList);
router.get('/api/v1/getPaymentAmountBYpaymentAdvoiceId',bankPaymentController.getPaymentAmountBYpaymentAdvoiceId);
router.get('/api/v1/downloadBankPaymentById/:id',bankPaymentController.downloadBankPaymentById);

module.exports = router;