const salesReasonController = require("../controllers/sales_reason_controller");

module.exports = app => {

    app.post("/api/v1/create_salesReason", salesReasonController.create_salesReason);
    app.get("/api/v1/getAll_Active_salesReason", salesReasonController.getAll_Active_salesReason);
    app.get("/api/v1/getAll_salesReason", salesReasonController.getAll_salesReason);
    app.get("/api/v1/getById_salesReason/:id", salesReasonController.getById_salesReason);
    app.delete("/api/v1/delete_salesReason/:id", salesReasonController.delete_salesReason);
    app.put("/api/v1/update_salesReason/:id", salesReasonController.update_salesReason);
}