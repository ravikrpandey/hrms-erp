const express = require('express')
const router = express.Router();
const vehiclePlanningWithSale = require('../controller/vehicle_planning_controller');

router.get('/api/v1/getVehiclePlanningById/:id',vehiclePlanningWithSale.getVehiclePlanningById);
router.get('/api/v1/downloadSOInvoice/:vehicle_id/:so_id',vehiclePlanningWithSale.downloadSOInvoice);
router.get('/api/v1/getMapItemDetailsById/:id',vehiclePlanningWithSale.getMapItemDetailsById);
router.post('/api/v1/saveMappedItemsSerialNo', vehiclePlanningWithSale.saveMappedItemsSerialNo);
router.get('/api/v1/getMapSerialNoBySOId/:id/:planningId',vehiclePlanningWithSale.getMapSerialNoBySOId);

module.exports=router