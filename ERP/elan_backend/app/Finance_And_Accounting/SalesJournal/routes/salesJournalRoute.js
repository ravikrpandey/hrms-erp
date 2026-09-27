const express = require('express');
const router = express.Router();

const salesJournalController = require('../controller/salesJournalController');

router.post('/api/v1/createSalesJournal',salesJournalController.createSalesJournal);
router.get('/api/v1/generateSalesJournalNumber',salesJournalController.generateSalesJournalNumber);
router.get('/api/v1/getSalesJournalList',salesJournalController.getSalesJournalList);
router.put('/api/v1/generatesalesJournalNumber',salesJournalController.generatesalesJournalNumber);
router.get('/api/v1/getsalesJournalById',salesJournalController.getsalesJournalById);
module.exports = router;