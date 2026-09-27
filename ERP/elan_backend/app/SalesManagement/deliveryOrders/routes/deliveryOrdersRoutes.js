const express = require('express');
const router = express.Router();
const deliveryOrderCountroller = require('../controller/deliveryOrdersController');

router.post('/api/v1/createDeliveryOrder', deliveryOrderCountroller.createDeliveryOrder);
router.get('/api/v1/getDeliveryById/:id/:entity_id', deliveryOrderCountroller.getDeliveryById);
router.put('/api/v1/updatDelStatusByDepId/:delivery_order_id', deliveryOrderCountroller.approvedDeliveryOrderById);
router.delete("/api/v1/deleteDeliveryById/:id",  deliveryOrderCountroller.deleteDeliveryById);
router.get('/api/v1/getAllDeliveryOrderApprovalLevel/:delivery_order_id', deliveryOrderCountroller.getAllDeliveryOrderApprovalLevel);
router.get('/api/v1/getDeliveryOrderByMainId/:id', deliveryOrderCountroller.getDeliveryByMainId);

module.exports = router;