const express = require('express');
const router = express.Router();
const controller = require('../controller/getSODetailsByDocType');
// const {dynamicUploader}= require('../../../middleware/uploadFiles');


router.get('/api/v1/getSODetailsByDocType', controller.getSODetailsByDocType);
router.post('/api/v1/createSalesReturn', controller.createSalesReturn);
router.get('/api/v1/getsSalesReturn', controller.getsSalesReturn);
router.get('/api/v1/getSalesReturn', controller.getSalesReturn);



module.exports = router;