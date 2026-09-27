const express = require('express');
const router = express.Router();

const cashRecieptController = require('../controllers/cashRecieptController');

router.post('/api/v1/createCashReciept',cashRecieptController.createCashReciept)
router.get('/api/v1/generateCashRecieptNumber',cashRecieptController.generateCashRecieptNumber)
router.get('/api/v1/getCashRecieptList',cashRecieptController.getCashRecieptList);
router.get('/api/v1/getCashRecieptById',cashRecieptController.getCashRecieptById);
router.get('/api/v1/getCashRecieptReportList',cashRecieptController.getCashRecieptReportList);
router.put('/api/v1/generateBankRecieptNumber',cashRecieptController.generateBankRecieptNumber);
router.get('/api/v1/downloadCashRecieptById',cashRecieptController.downloadCashRecieptById);
module.exports = router;