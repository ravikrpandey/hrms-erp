const express = require('express');
const router = express.Router();

const paymentProgramController = require('../controller/paymentProgramController');

router.post('/api/v1/paymentProgram',paymentProgramController.paymentProgram);
router.get('/api/v1/generatePaymentProgramNumber',paymentProgramController.generatePaymentProgramNumber);
router.post('/api/v1/getAllCompletedInvoice',paymentProgramController.getAllCompletedInvoice);


module.exports = router;