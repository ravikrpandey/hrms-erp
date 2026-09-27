const express = require('express');
const router = express.Router();

const paymentAdviceController = require('../controller/paymentAdviceController');

router.post('/api/v1/createPaymentAdvice',paymentAdviceController.createPaymentAdvice);

router.post('/api/v1/generatePaymentAdviceNumber',paymentAdviceController.generatePaymentAdviceNumber);

router.post('/api/v1/getPaymentAdviceList',paymentAdviceController.getPaymentAdviceList);
router.get('/api/v1/getPaymentAdviceById',paymentAdviceController.getPaymentAdviceById);
router.get('/api/v1/getPaymentAdviceReportList',paymentAdviceController.getPaymentAdviceReportList);
router.post('/api/v1/getAllPoGrnSoByVendorId',paymentAdviceController.getAllPoGrnSoByVendorId);
router.get('/api/v1/downloadPaymentAdviceById/:id',paymentAdviceController.downloadPaymentAdviceById);


module.exports = router;