const express = require('express');
const router = express.Router();

const VoucherMainController = require('../controllers/VoucherMainController');


router.get('/api/v1/getAllVoucherMainData',VoucherMainController.getAllVoucherMainData);
router.post('/api/v1/createVoucherMainList',VoucherMainController.createVoucherMainList);
router.get('/api/v1/voucherMainList',VoucherMainController.voucherMainList);
router.get('/api/v1/voucherMainListById',VoucherMainController.voucherMainListById);
router.put('/api/v1/updateVoucherMainById',VoucherMainController.updateVoucherMainById);
router.get('/api/v1/getBankVoucherById',VoucherMainController.getBankVoucherById);
router.post('/api/v1/getVoucherMainSeries',VoucherMainController.getVoucherMainSeries);

module.exports = router;