const financialController = require("../controller/financialController");
module.exports = app => {
   
    app.get("/api/v1/getSubModulesData", financialController.getSubModulesData);
    app.post('/api/v1/createFinacialTransactionIntegration',financialController.createFinacialTransactionIntegration)
    app.get('/api/v1/getFinacialTransactionIntegrationList',financialController.getFinacialTransactionIntegrationList)
    app.get('/api/v1/getfinancialTransactionsById',financialController.getfinancialTransactionsById)
    

}

