

// router.get("/api/v1/getPostingPeriodList", postingPeriod.getPostingPeriodList);
// router.get("/api/v1/deletePostingPeriod/:id", postingPeriod.deletePostingPeriod);
// router.get("/api/v1/getPostingPeriodById/:id", postingPeriod.getPostingPeriodById);

// router.get("/api/v1/getFiscalYearActiveMonthByCompanyId/:id", postingPeriod.getFiscalYearActiveMonthByCompanyId);
// router.get("/api/v1/getPostingPeriodMonthListById/:id", postingPeriod.getPostingPeriodMonthListById);
// router.post("/api/v1/addPostingPeriod/:id", postingPeriod.addPostingPeriod);
// module.exports = router;


const express = require("express");
const router = express.Router();

const postingPeriod = require('../controllers/postingPeriod');


module.exports = app => {   
    app.get("/api/v1/getFinancialYearList/:id", postingPeriod.getFinancialYearList);
    app.get("/api/v1/getFromToMonthByFinancialYear/:id", postingPeriod.getFromToMonthByFinancialYear);
    app.get("/api/v1/getPostingPeriodList/:id", postingPeriod.getPostingPeriodList);
    // app.get("/api/v1/getCurrencyList", postingPeriod.getCurrencyList);
    app.get("/api/v1/deletePostingPeriod/:id", postingPeriod.deletePostingPeriod);
    app.post("/api/v1/addPostingPeriod/:id", postingPeriod.addPostingPeriod);
    app.get("/api/v1/getPostingPeriodById/:id", postingPeriod.getPostingPeriodById);
    app.get("/api/v1/getFinancialYearActiveMonthByEntityId/:id", postingPeriod.getFinancialYearActiveMonthByEntityId);
    app.get("/api/v1/getFinancialYearActiveMonthByEntityFinancial/:id/:financial_id", postingPeriod.getFinancialYearActiveMonthByEntityFinancial);
    app.get("/api/v1/getPostingPeriodMonthListById/:id", postingPeriod.getPostingPeriodMonthListById);
    app.get("/api/v1/getActiveMonthByFinancialYearId", postingPeriod.getActiveMonthByFinancialYearId);
    app.get("/api/v1/getAdditionalPostingPeriodMonthListById/:id", postingPeriod.getAdditionalPostingPeriodMonthListById);
    app.get("/api/v1/getFromToMonthByEntityId/:id", postingPeriod.getAdditionalPostingPeriodMonthListById);
    
};   
