
const express = require("express");
const router = express.Router();
const trialBalanceController = require('../controller/trial_balance');


module.exports = app => {   
      app.get("/api/v1/getTrialBalances", trialBalanceController.getTrialBalance);
      app.get("/api/v1/getProfitLoss",trialBalanceController.getProfitAndLoss);
      app.get("/api/v1/getBalanceSheet",trialBalanceController.getBalanceSheet);
}