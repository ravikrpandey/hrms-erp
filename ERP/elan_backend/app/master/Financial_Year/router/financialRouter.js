module.exports = app => {
    const financialController = require("../controller/financialController");

    app.post("/api/v1/createFinancialYear", financialController.createFinancialYear);
    app.get("/api/v1/getAllfinancial", financialController.getAllfinancial);
    app.get("/api/v1/getAllfinancial_active", financialController.getAllfinancial_active);
    app.get("/api/v1/getByIdfinancial/:id", financialController.getByIdfinancial);
    app.put("/api/v1/updatefinancialById/:id", financialController.updatefinancialById);
    app.put("/api/v1/updatefinanceStatus/:id", financialController.updatefinancialstatusById);
    app.delete("/api/v1/deletefinancial/:id", financialController.deletefinancial);
    app.get("/api/v1/getAllActivefinancial_year", financialController.getAllActivefinancial_year);
    app.get("/api/v1/getAllfinancial_yearRange", financialController.getAllfinancial_yearRange);

}