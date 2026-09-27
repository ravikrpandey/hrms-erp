
const dashBoardController = require('../controller/dashboardController');

module.exports = app => {   
    app.get("/api/v1/getDashBoardFinanceData/:entity_id/:financial_id", dashBoardController.getDashBoardFinanceData);

};   