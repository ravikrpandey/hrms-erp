const express = require("express");
const router = express.Router();

const addDoController = require("../controllers/doController");

router.get("/api/v1/salesOrderById", addDoController.salesOrderById);
router.post("/api/v1/createAddDo", addDoController.createAddDo);
router.get("/api/v1/salesOrderByProposalId", addDoController.salesOrderByProposalId);
router.get("/api/v1/salesOrderHistory", addDoController.salesOrderHistory);
router.get('/api/v1/generate_delivery_order_number', addDoController.generateDeliveryOrderNumber);
router.get("/api/v1/getAllActiveTransType", addDoController.getAllActiveTransType);
router.get("/api/v1/getSupplyType", addDoController.getSupplyType);
router.get("/api/v1/getDocumentType", addDoController.getDocumentType);
router.get("/api/v1/getCdkDataByEntityId/:entity_id", addDoController.getCdkDataByEntityId); 
router.get("/api/v1/getInvoiceIrnDataByDoId/:do_id", addDoController.getInvoiceIrnDataByDoId);
router.get("/api/v1/getDeliveryChallanDataById/:do_id/:invoice_mode", addDoController.getDeliveryChallanDataById); 
router.post("/api/v1/generateIRNforSalesInvoice/:entity_id/:financial_year_id/:do_id/:invoice_id", addDoController.generateIRNforSalesInvoice);
router.post("/api/v1/generateEwayByIrn/:entity_id/:financial_year_id/:do_id/:invoiceMode", addDoController.generateEwayByIrn);
router.get("/api/v1/getAllEwayData/:entity_id/:financial_year_id", addDoController.getAllEwayData);
// router.get("/api/v1/getInvoiceIrnDataByDoId/:do_id", addDoController.getInvoiceIrnDataByDoId);
// router.get("/api/v1/getAllEwayData/:entity_id/:financial_year_id", addDoController.getAllEwayData);
// router.get("/api/v1/getAllEwayDataById/:entity_id/:financial_year_id/:do_id", addDoController.getAllEwayDataById);
router.get("/api/v1/getInvoiceIrnDataByInvoiceId/:invoice_id", addDoController.getInvoiceIrnDataByInvoiceId);
router.get("/api/v1/getAllEwayDataById/:entity_id/:financial_year_id/:invoice_id/:eway_id", addDoController.getAllEwayDataById);
router.get("/api/v1/downloadEway", addDoController.downloadEway);
// router.get("/api/v1/eWayDownload/:fileName",ewayPdfController.download)
router.post("/api/v1/eway/generateEwayWithoutIrn/:entity_id/:financial_year_id/:do_id/:customer_id", addDoController.generateEwayWithoutIrn);
router.post("/api/v1/cancelIRNforSalesInvoice/:entity_id/:invoice_id", addDoController.cancelIRNforSalesInvoice);
router.get("/api/v1/getDeliveryChallanById/:do_id", addDoController.getDeliveryChallanById);
router.get("/api/v1/getEwayListDataById/:entity_id/:financial_year_id/:eway_id", addDoController.getEwayListDetails);
router.get("/api/v1/getSalesOrderInvoice", addDoController.getSalesOrderInvoice);

module.exports = router;