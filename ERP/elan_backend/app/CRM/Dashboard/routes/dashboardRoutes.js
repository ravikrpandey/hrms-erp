const dashBoardController = require('../controller/dashboardController')
module.exports = app =>{
    app.get("/api/v1/getcard_details/:entity_id",dashBoardController.getDashboardCard);
    app.get("/api/v1/getLeadSourceAnalysis/:entity_id",dashBoardController.getLeadSourceAnalysis);
    app.get("/api/v1/getDetailsForDashboard/:entity_id",dashBoardController.getDetailsForDashboard);
    app.get("/api/v1/getConversionRate/:entity_id",dashBoardController.getConversionRate);
    // app.get("/api/v1/Allowance_getById/:id",allowanceController.Allowance_getById);
}