const express = require('express')
const router = express.Router();
const EinvoiceController = require('../controller/EinvoiceController');

router.post('/api/v1/genrateIRN',EinvoiceController.genrateIRN);
router.post('/api/v1/genratePdfinvoice',EinvoiceController.genratePdfinvoice);
router.post('/api/v1/genratePdfEwayinvoice',EinvoiceController.genratePdfEwayinvoice);
router.get('/api/v1/getEinvoiceList',EinvoiceController.getEinvoiceList);


module.exports = router;