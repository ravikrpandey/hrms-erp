const express = require('express')
const router = express.Router();
const tdsController = require('../controller/TDSController');

router.post('/api/v1/createTDS',tdsController.createTDS);
router.get('/api/v1/getAllTDS',tdsController.getAllTDS);
router.get('/api/v1/getAllTDSById',tdsController.getAllTDSById);
router.put('/api/v1/updateTdsById',tdsController.updateTdsById);
router.get('/api/v1/getTDSById',tdsController.getTDSById);
router.put('/api/v1/deleteTDSById',tdsController.deleteTDSById);
router.put('/api/v1/createGlobalTdsMapCA',tdsController.createGlobalTdsMapCA);
router.get('/api/v1/getAllGlAccountMapped',tdsController.getAllGlAccountMapped)


router.post('/api/v1/createGlMappingTransactions',tdsController.createGlMappingTransactions);
module.exports=router