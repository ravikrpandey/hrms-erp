const dashboardController = require("../controllers/dashboard.controllers")

module.exports = app => {
    app.get("/api/v1/get_All_Dashboard_Card_Count", dashboardController.get_All_Dashboard_Card_Count);
    app.get("/api/v1/globalSearch", dashboardController.globalSearch);
};