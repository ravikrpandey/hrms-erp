
const express = require("express");
const router = express.Router();
const cashBook = require('../controllers/cashBook');


module.exports = app => {
    app.get("/api/v1/getDepartmentById/:id", cashBook.getDepartmentById);
    // app.get("/api/v1/deleteBankAccount/:id", cashBook.deleteBankAccount);
    // app.get("/api/v1/getBankAccountById/:id", cashBook.getBankAccountById);
    app.post("/api/v1/addCashBookMoneyIn", cashBook.addCashBookMoneyIn);
    app.post("/api/v1/addCashBookMoneyOut", cashBook.addCashBookMoneyOut);
    app.get("/api/v1/getCashBookData/:id", cashBook.getCashBookData);
    // app.get("/api/v1/getBankList", cashBook.getBankList);
    app.get("/api/v1/getAccountListForCashBook", cashBook.getAccountListForCashBook);
    app.get("/api/v1/getInterestIncomeAccountList", cashBook.getInterestIncomeAccountList);
    app.get("/api/v1/getOtherIncomeAccountList", cashBook.getOtherIncomeAccountList);
    app.get("/api/v1/getVendorList", cashBook.getVendorList);
    app.get("/api/v1/getAllEquityAccountList", cashBook.getAllEquityAccountList);
    app.get("/api/v1/getMoneyOutToAccountList/:id", cashBook.getMoneyOutToAccountList);
    app.get("/api/v1/getExpenseAccountList/:id", cashBook.getExpenseAccountList);
    app.get("/api/v1/getCashBookDataById", cashBook.getCashBookDataById);
    app.get("/api/v1/getAllCashAccount/:entity_id", cashBook.getAllCashAccount);
    
};
