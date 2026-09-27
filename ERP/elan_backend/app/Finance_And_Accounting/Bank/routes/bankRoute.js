
const express = require("express");
const router = express.Router();
const bank = require('../controllers/bank');


module.exports = app => {
    app.get("/api/v1/getBankDetailsById/:id", bank.getBankDetailsById);
    app.get("/api/v1/getBankList", bank.getBankList);
    app.get("/api/v1/getBankAccount", bank.getBankAccount);
    app.get("/api/v1/deleteBank/:id", bank.deleteBank);
    app.get("/api/v1/getBankById/:id", bank.getBankById);
    app.post("/api/v1/addBank/:id", bank.addBank);
    app.get("/api/v1/getCountryList", bank.getCountryList);
    app.get("/api/v1/getCashInBankCOA/:id", bank.getCashInBankCOA);
    app.post("/api/v1/getJournalEntriesForBankClearance/:account_id/:entity_id", bank.getJournalEntriesForBankClearance);
    app.put("/api/v1/updateClearanceDates", bank.updateClearanceDates);
    app.post("/api/v1/getClosingBalanceForBankReconciliation/:account_id/:entity_id", bank.getClosingBalanceForBankReconciliation);
    app.get("/api/v1/getTrialBalance", bank.getTrialBalance);
    app.post("/api/v1/getAllJournalEntriesForBankClearance/:account_id/:entity_id", bank.getAllJournalEntriesForBankClearance);

    
};


