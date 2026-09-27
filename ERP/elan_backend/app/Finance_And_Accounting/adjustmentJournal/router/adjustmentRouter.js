const express = require('express');
const router = express.Router();

const adjustmentController = require('../controller/adjustmentController');

router.post('/api/v1/createAdjustmentJournal',adjustmentController.createAdjustmentJournal)
router.get('/api/v1/getAllAdjustmentJournalList',adjustmentController.getAllAdjustmentJournalList)
router.get('/api/v1/getAdjustmentJournalBYId',adjustmentController.getAdjustmentJournalBYId)
router.post('/api/v1/adjustment-voucher/generate/:id', adjustmentController.generateAdjustmentVoucher);
 

module.exports = router;