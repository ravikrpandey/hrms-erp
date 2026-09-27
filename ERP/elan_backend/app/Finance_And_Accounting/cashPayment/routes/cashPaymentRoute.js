const express = require('express');
const router = express.Router();

const cashPaymentController = require('../controllers/cashPaymentController');

router.post('/api/v1/createCashPayment',cashPaymentController.createCashPayment)
router.get('/api/v1/generateCashPaymentNumber',cashPaymentController.generateCashPaymentNumber)
router.get('/api/v1/getCashPaymentList',cashPaymentController.getCashPaymentList);
router.get('/api/v1/getCashPaymentById',cashPaymentController.getCashPaymentById);
router.get('/api/v1/getCashPaymentReportList',cashPaymentController.getCashPaymentReportList);
router.put('/api/v1/generatecashPaymentNumber',cashPaymentController.generatecashPaymentNumber);
router.get('/api/v1/downloadCashPaymentById/:id',cashPaymentController.downloadCashPaymentById);


module.exports = router;