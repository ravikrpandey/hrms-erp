
const express = require("express");
const router = express.Router();

const chartsOfAccountsController = require('../controllers/chartOfAccounts');


module.exports = app => {   
    app.get("/api/v1/get_Parent_Account_List", chartsOfAccountsController.get_Parent_Account_List);
    app.get("/api/v1/get_Chart_Of_Account_List/:id", chartsOfAccountsController.get_Chart_Of_Account_List);
    app.get("/api/v1/get_Master_Account_Type", chartsOfAccountsController.get_Master_Account_Type);
    app.get("/api/v1/getCurrencyList", chartsOfAccountsController.getCurrencyList);
    app.get("/api/v1/get_Account_Group_By_Id/:id", chartsOfAccountsController.get_Account_Group_By_Id);
    app.post("/api/v1/save_Chart_Of_Accounts/:id", chartsOfAccountsController.save_Chart_Of_Accounts);
    app.get("/api/v1/get_Charts_Of_Account_Details_By_Id/:id", chartsOfAccountsController.get_Charts_Of_Account_Details_By_Id);
    app.get("/api/v1/delete_Chart_Of_Accounts/:id", chartsOfAccountsController.delete_Chart_Of_Accounts);
    app.get("/api/v1/get_Charts_Of_Account_By_Id/:id", chartsOfAccountsController.get_Charts_Of_Account_By_Id);
    app.get("/api/v1/getRootTypeByChartId/:id", chartsOfAccountsController.getRootTypeByChartId);
    app.get("/api/v1/getTrialBalance22", chartsOfAccountsController.getTrialBalance22);
    app.get("/api/v1/getMonthList", chartsOfAccountsController.getMonthList);
    app.get("/api/v1/get_Party_Type_List", chartsOfAccountsController.get_Party_Type_List);
    app.get("/api/v1/getDefaultCurrencyId", chartsOfAccountsController.getDefaultCurrencyId);
    app.post("/api/v1/checkBankAccountForJournal", chartsOfAccountsController.checkBankAccountForJournal);
    app.get("/api/v1/get_Trial_Balance_Report_List", chartsOfAccountsController.get_Trial_Balance_Report_List);
    app.get("/api/v1/get_Party_Name_List", chartsOfAccountsController.get_Party_Name_List);
    app.get("/api/v1/getProductList", chartsOfAccountsController.getProductList);
    app.get("/api/v1/get_All_Bank_Acc_List", chartsOfAccountsController.get_All_Bank_Acc_List);
    // app.post("/api/v1/filterVendorLedgerReport/:entity_id", chartsOfAccountsController.filterVendorLedgerReport);
    app.post("/api/v1/getCostCenterLedger/:entity_id", chartsOfAccountsController.getCostCenterLedger);
    app.post("/api/v1/getProfitCenterLedger/:entity_id", chartsOfAccountsController.getProfitCenterLedger);
    app.get("/api/v1/getAllServiceDataById", chartsOfAccountsController.getAllServiceDataById);
    app.get("/api/v1/BankClearenceAccountList", chartsOfAccountsController.BankClearenceAccountList);
    app.get("/api/v1/getChartOfAccountById", chartsOfAccountsController.getChartOfAccountById);
    app.get('/api/v1/getProfitCenterDetailedLedger/:entity_id/:profit_center_id', chartsOfAccountsController.getProfitCenterDetailedLedger);
};   

// app.get("/api/v1/getProfitLoss",trialBalanceController.getProfitAndLoss);