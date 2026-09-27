const express = require("express");
const router = express.Router();

const invoiceController = require("../controller/invoiceController");

router.post('/api/v1/createInvoice', invoiceController.createInvoice);
router.get('/api/v1/getInvoiceList/:id', invoiceController.getInvoiceList);
router.get('/api/v1/getDownloadInvoiceById/:id', invoiceController.getDownloadInvoiceById);

module.exports = router;
