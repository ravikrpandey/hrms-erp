const express = require('express');
const router = express.Router();
const proformaController = require('../controller/proforma');

router.post('/api/v1/createProforma/:id', proformaController.createProforma);
router.get('/api/v1/getAllProforma/:id', proformaController.getAllProforma);
router.delete("/api/v1/deleteProformaById/:id",  proformaController.deleteProformaById);
router.get('/api/v1/getQuotationById/:id', proformaController.getQuotationById);
router.get('/api/v1/getProformaById/:id', proformaController.getProformaById);
router.put('/api/v1/updateProformaStatus/:proforma_id', proformaController.approvedProformaById);
router.get('/api/v1/getAllProformaApprovalLevel/:proforma_id', proformaController.getAllProformaApprovalLevel);
// router.get('/api/v1/getQuotationDocCode', proformaController.getQuotationDocCode);
// router.get('/api/v1/getApprovedQuotationDetailById/:id', proformaController.getApprovedQuotationDetailById);
// router.get('/api/v1/getApprovedQuotationItemDetailById/:id', proformaController.getApprovedQuotationItemDetailById);
router.get('/api/v1/getQuotationDocCode/:entity_id', proformaController.getQuotationDocCode);
router.get('/api/v1/getApprovedQuotationDetailById/:id', proformaController.getApprovedQuotationDetailById);
router.get('/api/v1/getApprovedQuotationItemDetailById/:id', proformaController.getApprovedQuotationItemDetailById);



module.exports = router;