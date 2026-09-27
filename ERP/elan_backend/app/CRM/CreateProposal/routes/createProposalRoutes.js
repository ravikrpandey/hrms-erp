const express = require("express");
const router = express.Router();

const createProposalController = require("../controllers/createProposalController");
const discountController = require("../controllers/grossDiscountController");

const {upload}= require('../../../middleware/uploadDocs');
const {dynamicUploader}= require('../../../middleware/uploadFiles');
const uploadFiles = dynamicUploader("quotationdocuments")

router.post('/api/v1/getProposalCompanyData/:id', createProposalController.getProposalCompanyData);
router.post('/api/v1/createProposal', createProposalController.createProposal);
// router.post('/api/v1/createProposal-old', createProposalController.createProposalold);
router.post('/api/v1/crm/createNewCustomer', createProposalController.createNewCustomer);
// router.post('/api/v1/createnProposalNew', createProposalController.createnProposalNew);
router.get('/api/v1/getProposalList', createProposalController.getProposalList);
router.patch('/api/v1/updateProposalStatus', createProposalController.updateProposalStatus);
router.get('/api/v1/proposalVersionList', createProposalController.proposalVersionList);
router.get('/api/v1/proposalVersionListById', createProposalController.proposalVersionListById);
router.get('/api/v1/previewProposal', createProposalController.previewProposal);
router.get('/api/v1/proposalVersionMailData', createProposalController.proposalVersionMailData);
router.get('/api/v1/getExistingProposalById', createProposalController.getExistingProposalById);
router.post('/api/v1/add_customisation_branding', createProposalController.add_customisation_branding);
router.post('/api/v1/add_proposal_customisation_branding', createProposalController.add_proposal_customisation_branding);
router.post('/api/v1/get_customisation_branding/:id', createProposalController.get_customisation_branding);
router.post('/api/v1/get_proposal_customisation_branding/:id', createProposalController.get_proposal_customisation_branding);
router.post('/api/v1/get_customisation_branding_existing_client/:id', createProposalController.get_customisation_branding_existing_client);
router.get('/api/v1/getAllProposalList', createProposalController.getAllProposalList);
router.get('/api/v1/getsCustomerByDealer/:dealer_id', createProposalController.getsCustomerByDealer);
router.get('/api/v1/getsCustomerAddress/:customer_id', createProposalController.getsCustomerAddress);

router.patch('/api/v1/updateProposalVersion/:version_id', createProposalController.updateProposalVersion);
router.get('/api/v1/updateBookingProposalVersion/:version_id/:proposal_id', createProposalController.updateBookingProposalVersion);
router.get('/api/v1/getAllApprovalLevelProposal', createProposalController.getAllApprovalLevelProposal);
router.patch('/api/v1/updateProposalItemStatus', createProposalController.updateProposalItemStatus);
router.post('/api/v1/generate_performa_invoice', createProposalController.generate_performa_invoice);
router.get('/api/v1/getAll_generate_performa', createProposalController.getAll_generate_performa);
router.post('/api/v1/updateMailStatus', createProposalController.updateMailStatus);
router.post('/api/v1/updateBookingStatus', createProposalController.updateBookingStatus);

router.patch('/api/v1/updateFollowupDate/:versio_id', createProposalController.updateFollowupDate);
//////////////////
/////////// here rotes for quotation changes " 
// 
///////////

// Lead Source Routes
router.get('/api/v1/getLeadSource', createProposalController.getAllLeadSource);
router.post('/api/v1/leadSource/create', createProposalController.createLeadSource);
router.get('/api/v1/leadSource/:id', createProposalController.getLeadSourceById);
router.put('/api/v1/leadSource/:id', createProposalController.updateLeadSource);
router.delete('/api/v1/leadSource/:id', createProposalController.deleteLeadSource);

router.get('/api/v1/getSalesCustomers', createProposalController.getSalesCustomers);

// deliveryTermUnloadings
router.get('/api/v1/deliveryTermUnloadings', createProposalController.deliveryTermUnloadings);
router.post('/api/v1/deliveryTermUnloadings/create', createProposalController.createDeliveryTermUnloading);
router.get('/api/v1/deliveryTermUnloadings/:id', createProposalController.getDeliveryTermUnloadingById);
router.put('/api/v1/deliveryTermUnloadings/:id', createProposalController.updateDeliveryTermUnloading);
router.delete('/api/v1/deliveryTermUnloadings/:id', createProposalController.deleteDeliveryTermUnloading);

// paymentMain
router.get('/api/v1/paymentMainList', createProposalController.paymentMainList);
router.post('/api/v1/paymentMain/create', createProposalController.createPaymentMainCategory);
router.get('/api/v1/paymentMain/:id', createProposalController.getPaymentMainCategoryById);
router.put('/api/v1/paymentMain/:id', createProposalController.updatePaymentMainCategory);
router.delete('/api/v1/paymentMain/:id', createProposalController.deletePaymentMainCategory);

// subPaymentMain
router.get('/api/v1/subPaymentMainList/:payment_main_id', createProposalController.subPaymentMainList);
router.get('/api/v1/subPaymentMainList', createProposalController.getAllSubPaymentMainList);
router.post('/api/v1/subPaymentMain/create', createProposalController.createSubPaymentMain);
router.get('/api/v1/subPaymentMain/:id', createProposalController.getSubPaymentMainById);
router.put('/api/v1/subPaymentMain/:id', createProposalController.updateSubPaymentMain);
router.delete('/api/v1/subPaymentMain/:id', createProposalController.deleteSubPaymentMain);

// Insurrance
router.get('/api/v1/insuranceList', createProposalController.insuranceList);
router.post('/api/v1/insurance/create', createProposalController.createInsurance);
router.get('/api/v1/insurance/:id', createProposalController.getInsuranceById);
router.put('/api/v1/insurance/:id', createProposalController.updateInsurance);
router.delete('/api/v1/insurance/:id', createProposalController.deleteInsurance);

// Freight
router.get('/api/v1/freightList', createProposalController.freightList);
router.post('/api/v1/freight/create', createProposalController.createFreight);
router.get('/api/v1/freight/:id', createProposalController.getFreightById);
router.put('/api/v1/freight/:id', createProposalController.updateFreight);
router.delete('/api/v1/freight/:id', createProposalController.deleteFreight);

// Gross Discount 
router.get('/api/v1/getGrossDiscMst', discountController.getGrossDiscMst );


router.get('/api/v1/download_qoutationProforma_pdf', createProposalController.download_qoutationProforma_pdf );
router.get('/api/v1/checkSchemeStatusByClientCategory', createProposalController.checkSchemeStatusByClientCategory);


/////////////////////////
//////////
//////////here code for mail options 
////////////
router.post('/api/v1/pdfQuotationVersionMail',upload.array('files'),createProposalController.pdfQuotationVersionMail )
router.post('/api/v1/googleGeminiAi',upload.none(),createProposalController.googleGeminiAi )
router.get('/api/v1/getProposalDocumentsList',createProposalController.getProposalDocumentsList);
router.post('/api/v1/uploadMultipleDocuments', uploadFiles,createProposalController.uploadMultipleDocuments);
router.delete('/api/v1/deleteProposalDocument/:id', createProposalController.deleteProposalDocument);
router.get('/api/v1/getInstallationKitBomList',createProposalController.getInstallationKitBomList);

module.exports = router;
