const express = require('express');
const router = express.Router();

const transportController = require('../Controller/TransportController');

router.post('/api/v1/createTransportVoucher',transportController.createTransportVoucher);
router.get('/api/v1/getAllTransportVoucherList',transportController.getAllTransportVoucherList);
router.get('/api/v1/getLRDataList',transportController.getLRDataList);
router.get('/api/v1/getTransportById',transportController.getTransportById)
router.get('/api/v1/getTransportChargesTotal',transportController.getTransportChargesTotal)
router.get('/api/v1/getTranportDataList',transportController.getTranportDataList)
router.get('/api/v1/getTransporterByIdTdsValue',transportController.getTransporterByIdTdsValue)
router.get('/api/v1/getTdsNatureOfTransactionTransporter',transportController.getTdsNatureOfTransactionTransporter)
router.get('/api/v1/getCompleteTransportVoucher',transportController.getCompleteTransportVoucher)
 
module.exports = router;  