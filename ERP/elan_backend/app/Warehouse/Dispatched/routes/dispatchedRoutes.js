const express = require('express')
const router = express.Router();
const dispatchedController = require('../controllers/dispatchedController');

const vehicleCtrl = require('../../VehiclePlanning/vehicle-planning.controller');
const gateIOCtrl = require('../../VehiclePlanning/gateInwardOutward.controller');

router.get('/api/v1/salesOrderList/:employee_id',dispatchedController.salesOrderList);
router.get('/api/v1/dispatchedOrderList/:employee_id',dispatchedController.dispatchedOrderList);
router.get('/api/v1/getSaleByOrderId/:order_no_id',dispatchedController.getSaleByOrder);
router.get('/api/v1/getDispachedOrderDetails/:order_no_id',dispatchedController.getDispachedOrderDetails);
router.get('/api/v1/getWarehouseListByProductQuantity',dispatchedController.getWarehouseListByProductQuantity);
router.post('/api/v1/createDispatch',dispatchedController.createDispatch);
router.get('/api/v1/getTrialBalanced',dispatchedController.getTrialBalance);

// Vehicle Planning
router.post('/api/v1/createVehiclePlan', vehicleCtrl.createVehiclePlan);
router.get('/api/v1/getVehiclePlannedData', vehicleCtrl.getVehiclePlannedData);
router.get('/api/v1/getVehiclePlanById/:id', vehicleCtrl.getVehiclePlanById);
router.put('/api/v1/updateVehiclePlanById/:id', vehicleCtrl.updateVehiclePlanById);
router.put('/api/v1/updateDriverDetail/:id', vehicleCtrl.updateDriverDetail);
router.get('/api/v1/getPlanningByTransporter', vehicleCtrl.getPlanningByTransporter);
router.patch('/api/v1/transporterAcceptance/:treq_id', vehicleCtrl.transporterAcceptance);
router.get('/api/v1/getsTransAdminApprovel/:vpId', vehicleCtrl.getsTransAdminApprovel);
router.patch('/api/v1/updateTransporterAdminStatus', vehicleCtrl.updateTransporterAdminStatus);
router.patch('/api/v1/approvedVehiclePlanning', vehicleCtrl.approvedVehiclePlanning);
router.get('/api/v1/getsRateAgreementByTransporter', vehicleCtrl.getsRateAgreementByTransporter);
router.get('/api/v1/getPlanningByTransporterForRFQ', vehicleCtrl.getPlanningByTransporterForRFQ);

// Gate Inward Outward
router.get('/api/v1/getGateInwardOutwardList', gateIOCtrl.getGateInwardOutwardList);
router.put('/api/v1/updateGateInwardOutward', gateIOCtrl.updateGateInwardOutward);
router.get('/api/v1/getPickList', gateIOCtrl.getPickList);
router.put('/api/v1/updatePickData', gateIOCtrl.updatePickData);
router.get('/api/v1/getLRList', gateIOCtrl.getLRList);
router.put('/api/v1/updateLRData/:id', gateIOCtrl.updateLRData);
router.get('/api/v1/getInvoiceList', gateIOCtrl.getInvoiceList);
router.get('/api/v1/downloadDispatchPickList/:id', gateIOCtrl.downloadDispatchPickList);
router.get('/api/v1/downloadGateOutWordPdf/:id', gateIOCtrl.downloadDispatchPickList);

module.exports=router