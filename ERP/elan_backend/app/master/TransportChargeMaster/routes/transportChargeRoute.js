const trasportChargeController = require('../controller/transportChargeController');
const express = require('express');
const router = express.Router();

router.post('/api/v1/create-transport-charge',trasportChargeController.createTransportCharge)
router.get('/api/v1/getTransportChargeList',trasportChargeController.getTransportChargeList)
router.get('/api/v1/getTransportChargeById/:id',trasportChargeController.getTransportChargeById)
router.put("/api/v1/updateTransportCharge/:id",trasportChargeController.updateTransportCharge);
module.exports=router;