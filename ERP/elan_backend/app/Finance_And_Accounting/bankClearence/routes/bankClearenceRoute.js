
const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bank = require('../controllers/bankClearence');
router.get("/api/v1/getBankDetailsById/:id", bank.getBankDetailsById);
router.get("/api/v1/getBankList", bank.getBankList);
router.get("/api/v1/deleteBank/:id", bank.deleteBank);
router.get("/api/v1/getBankById/:id", bank.getBankById);
router.post("/api/v1/addBank/:id", bank.addBank);
router.get("/api/v1/getCountryList", bank.getCountryList);
router.post('/api/v1/upload_bank_statement',upload.single('file'),bank.uploadBankStatement);
router.get('/api/v1/getBankClearenceList',bank.getBankClearenceList);
router.post('/api/v1/reconcile_bank_statement',bank.reconcileBankStatement);
router.post('/api/v1/getUnReconciledBankEntries',bank.getUnReconciledBankEntries);
router.post('/api/v1/getBankEntriesForBankReconciliationStatm',bank.getBankEntriesForBankReconciliationStatm);

module.exports = router;


