const encashment_controller = require('../controller/leaveEncashment');

module.exports = app => {
    app.post("/api/v1/create_Encashment", encashment_controller.create_Encashment);
    app.get("/api/v1/getAll_Encashment", encashment_controller.getAll_Encashment);
    app.get("/api/v1/getEncashmentById", encashment_controller.getEncashmentById);
    app.delete("/api/v1/deleteEncashmentById/:id", encashment_controller.deleteEncashmentById);
    app.get("/api/v1/get_emp_byId_Encashment/:id", encashment_controller.getEncashmentEmployeesById);
    app.get("/api/v1/getIs_Encash", encashment_controller.getEncashLeave);

}