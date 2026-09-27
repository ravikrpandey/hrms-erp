const express = require('express');
const router = express.Router();

const purchaseJournalController = require('../controller/purchaseJournalController');

router.post('/api/v1/createPurchaseJournal',purchaseJournalController.createPurchaseJournal);

router.get('/api/v1/getPurchaseJournalList',purchaseJournalController.getPurchaseJournalList);
router.put('/api/v1/generatePurchaseJournalNumber',purchaseJournalController.generatePurchaseJournalNumber);
router.get('/api/v1/purchaseJournalById',purchaseJournalController.purchaseJournalById);
router.get('/api/v1/getBillingAddressById',purchaseJournalController.getBillingAddressById);
 
module.exports = router;  