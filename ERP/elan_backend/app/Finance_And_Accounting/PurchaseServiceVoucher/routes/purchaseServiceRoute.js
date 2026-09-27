const express = require('express');
const router = express.Router();

const purchaseServiceController = require('../controller/purchaseServiceVoucherController');

router.post('/api/v1/createPurchaseService',purchaseServiceController.createPurchaseService);

router.get('/api/v1/getPurchaseServiceList',purchaseServiceController.getPurchaseServiceList);
router.put('/api/v1/generatePurchaseServiceNumber',purchaseServiceController.generatePurchaseServiceNumber);
router.get('/api/v1/purchaseServiceById',purchaseServiceController.purchaseServiceById);
router.get('/api/v1/getVendorBillingList',purchaseServiceController.getVendorBillingList);
router.get('/api/v1/purchaseServiceVoucherRoutesDownload/:id',purchaseServiceController.generatePurchaseServiceVoucherPDF);
 
module.exports = router;  