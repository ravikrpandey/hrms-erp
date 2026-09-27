
const express = require('express');
const router = express.Router();

const creditDebitNote = require('../controller/creditDebitNoteCcontroller');

router.post('/api/v1/createCreditDebitBuilder',creditDebitNote.createCreditDebitNote)
router.get('/api/v1/getInvoiceItemByinvoiceId',creditDebitNote.getInvoiceItemByinvoiceId)
router.get('/api/v1/generateCreditDebitCode',creditDebitNote.generateCreditDebitCode)
router.get('/api/v1/getCreditNoteList',creditDebitNote.getCreditNoteList)
router.get('/api/v1/getCreditNoteById',creditDebitNote.getCreditNoteById)

module.exports = router;