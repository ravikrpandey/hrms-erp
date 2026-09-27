const advancepayment_controller = require('../controller/advancePaymentController');

module.exports = app => {
    app.post("/api/v1/create_Advancepayment", advancepayment_controller.create_Advancepayment);
    app.get("/api/v1/getAll_Advancepayment", advancepayment_controller.getAll_Advancepayment);
    app.get("/api/v1/getAdvancepaymentById", advancepayment_controller.getAdvancepaymentById);
    app.delete("/api/v1/deleteAdvancepaymentById/:id", advancepayment_controller.deleteAdvancepaymentById);
    app.get("/api/v1/get_emp_byId_Advancepayment/:id", advancepayment_controller.getAdvancepaymentEmployeesById);
}