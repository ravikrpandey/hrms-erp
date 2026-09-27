const taxslabController = require("../controller/tax_controller");

module.exports = app => {
    app.post("/api/v1/createTaxslab", taxslabController.createTaxslab)
    app.put("/api/v1/editTaxslab/:id", taxslabController.editTaxslab)
    app.get("/api/v1/getByIdTaxslab/:id", taxslabController.getByIdTaxslab)
    app.get("/api/v1/getByIdAllTaxslab/:id", taxslabController.getByIdAllTaxslab)
    app.get("/api/v1/getAllTaxslab", taxslabController.getAllTaxslab)
    app.delete("/api/v1/deleteTaxslab/:id", taxslabController.deleteTaxslab)
}