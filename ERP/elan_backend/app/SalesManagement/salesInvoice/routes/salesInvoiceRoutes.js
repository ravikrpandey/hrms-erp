const express = require('express');
const router = express.Router();
const salesInvoiceController = require('../controller/salesInvoice');
const {dynamicUploader}= require('../../../middleware/uploadFiles');

router.post('/api/v1/createSalesInvoice/:id', salesInvoiceController.createSalesInvoice);
// router.delete("/api/v1/deleteProformaById/:id",  salesInvoiceController.deleteProformaById);
router.get('/api/v1/getSaleInvoiceById/:id', salesInvoiceController.getSaleInvoiceById);
// // router.get('/api/v1/getQuotationByMainId/:id', salesInvoiceController.getQuotationByMainId);
router.put('/api/v1/updateInvoiceStatus/:invoice_id', salesInvoiceController.approvedSalesInvoiceById);
// // router.get('/api/v1/getQuotationDocCode', salesInvoiceController.getQuotationDocCode);
// // router.get('/api/v1/getApprovedQuotationDetailById/:id', salesInvoiceController.getApprovedQuotationDetailById);
// // router.get('/api/v1/getApprovedQuotationItemDetailById/:id', salesInvoiceController.getApprovedQuotationItemDetailById);
router.get('/api/v1/getPorformaDocCode/:entity_id', salesInvoiceController.getPorformaDocCode);
router.get('/api/v1/getApprovedProformaDetailById/:id', salesInvoiceController.getApprovedProformaDetailById);
router.get('/api/v1/getQuotationItemDetailByPorformaId/:id', salesInvoiceController.getQuotationItemDetailByPorformaId);
router.get('/api/v1/getApprovedSalesInvoiceDetailById/:id', salesInvoiceController.getApprovedSalesInvoiceDetailById);
router.get('/api/v1/getApprovedSalesInvoices/:id', salesInvoiceController.getApprovedSalesInvoices);
router.get('/api/v1/getAllSalesInvoiceApprovalLevel/:sales_invoice_id', salesInvoiceController.getAllSalesInvoiceApprovalLevel);

router.get('/api/v1/getAllInvoiceData/:id', salesInvoiceController.getAllInvoiceData);


const salesOrderController = require('../controller/salesOrderController');
const { upload } = require("../../../middleware/uploadDocs");

router.post('/api/v1/createSalesOrder',salesOrderController.createSalesOrder);
router.get('/api/v1/generateSalesOrderNO/:financial_year_id',salesOrderController.generateSalesOrderNumber);
router.get('/api/v1/getSOByProposal/:proposal_id/:version_id',salesOrderController.getSOByProposal);
router.get('/api/v1/getSOHistory/:proposal_id',salesOrderController.getSOHistory);
router.get('/api/v1/getAllSOList',salesOrderController.getAllSOList);
router.get('/api/v1/getSOForDispatch/:status',salesOrderController.getSOFORDispatch);
router.get('/api/v1/getSOForDispatchAcknowledge',salesOrderController.getSOForDispatchAcknowledge);
router.get('/api/v1/getSOByid/:id',salesOrderController.getSOByid);
router.post('/api/v1/create_addPO',upload.array('image_upload',15),salesOrderController.create_addPO);
router.post('/api/v1/forwardSOToRM',salesOrderController.forwardSOToRM);
router.get('/api/v1/getCreditWorklowApprovalList',salesOrderController.getCreditWorklowApprovalList);
router.get('/api/v1/getAllBookingList',salesOrderController.getAllBookingList);
router.get('/api/v1/getAllBookingList_backOffice',salesOrderController.getAllBookingList_backOffice);
router.get('/api/v1/getAllBookingList2',salesOrderController.getAllBookingList2);
router.get('/api/v1/getAllPendingBookingList',salesOrderController.getAllPendingBookingList);
router.get('/api/v1/getBookingById',salesOrderController.getBookingById);
router.get('/api/v1/getDispatchedSO',salesOrderController.getDispatchedSO);
router.get('/api/v1/generateSalesBookingNo/:financial_year_id',salesOrderController.generateSalesBookingNumber);
router.patch('/api/v1/applyCustBranding/:id',salesOrderController.applyCustBranding)
router.patch('/api/v1/updateSoDate/:id',salesOrderController.updateSoDate)
router.patch('/api/v1/uploadSoDoc/:id',upload.single('file'),salesOrderController.uploadSoDoc)
router.get('/api/v1/getDispatchedSOByWareouseId',salesOrderController.getDispatchedSOByWareouseId);
router.get('/api/v1/AllProposalNo/:financial_year_id/:status',salesOrderController.allProposalNo);
router.get('/api/v1/allProposalItems/:financial_year_id',salesOrderController.allProposalItems);
router.get('/api/v1/allProposalCustomer/:financial_year_id/:status',salesOrderController.allProposalCustomer);
router.post("/api/v1/uploadPODDoc",dynamicUploader(),salesOrderController.uploadPODDoc);

////////////

router.get('/api/v1/getAllPartiallyList',salesOrderController.getAllPartiallyList);
router.post('/api/v1/salesSoProgressStatus',salesOrderController.updateSoStatus);
router.patch('/api/v1/proposalVersionRejected/:pi_id',salesOrderController.proposalVersionRejected);
router.get('/api/v1/reasonStatusList',salesOrderController.reasonStatusList);
router.post('/api/v1/updateSalesBooking',salesOrderController.updateSalesBooking);
router.patch('/api/v1/updateVersionStatus/:version_id',salesOrderController.updateVersionStatus);



///////////////////////////
///////////////// here routing for bypass challan create direct invoice 
///////////////////////
router.get('/api/v1/getAllSalesOrder/:entity_id/:financial_id',salesOrderController.getAllSalesOrder )
router.get('/api/v1/downloadSalesOrder/:id',salesOrderController.downloadSalesOrder )
router.get('/api/v1/getCustomerAging', salesOrderController.getCustomerAging);
router.get('/api/v1/getCustomerAgingByCustomerId/:id', salesOrderController.getCustomerAgingByCustomerId);
router.get('/api/v1/getAllcollectionReportData', salesOrderController.getAllcollectionReportData);

module.exports = router;