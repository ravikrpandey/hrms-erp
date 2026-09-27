
const express = require("express");
const router = express.Router();
const bankAccount = require('../controllers/bankAccount');


module.exports = app => {
    app.get("/api/v1/getBankAccountList", bankAccount.getBankAccountList);
    app.get("/api/v1/deleteBankAccount/:id", bankAccount.deleteBankAccount);
    app.get("/api/v1/getBankAccountById/:id", bankAccount.getBankAccountById);
    app.post("/api/v1/addBankAccount/:id", bankAccount.addBankAccount);
    app.get("/api/v1/getAccountListForBank", bankAccount.getAccountListForBank);
    app.get("/api/v1/getBankList", bankAccount.getBankList);
    app.get("/api/v1/getBankAccountDetailsById/:id", bankAccount.getBankAccountDetailsById);
    app.get("/api/v1/getAccountNameByBankId/:id", bankAccount.getAccountNameByBankId);
    app.get("/api/v1/getBankAccountNameByBankId/:id", bankAccount.getBankAccountNameByBankId);
    
};
