const express = require("express");
const router = express.Router();

const salesInvoiveController = require("../controllers/salesInvoiceController");
const pdfController= require("../utils/pdfController/pdf")


router.post("/api/v1/createSalesInvoice", salesInvoiveController.createSalesInvoice);
router.get("/api/v1/getSalesInvoiceData/:do_id/:so_id", salesInvoiveController.getSalesInvoiceData);
router.get("/api/v1/getAllSalesInvoiceData", salesInvoiveController.getAllSalesInvoiceData);
router.get('/api/v1/pdfSalesInvoiceData',salesInvoiveController.pdfSalesInvoice);
router.get("/api/v1/salesInvoiceDownload/:fileName",pdfController.download)
router.get("/api/v1/downloadInvoice/:id",salesInvoiveController.downloadInvoice)



router.get("/api/v1/getAllPendingSalesInvoiceData/:status", salesInvoiveController.getAllPendingSalesInvoiceData);
router.get("/api/v1/getAllApprovedSalesInvoiceData", salesInvoiveController.getAllApprovedSalesInvoiceData);

router.post("/api/v1/invoice/create-direct-invoice", salesInvoiveController.createDirectInvoice);


module.exports = router;