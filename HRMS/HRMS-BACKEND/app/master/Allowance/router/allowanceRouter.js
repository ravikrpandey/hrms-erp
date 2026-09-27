const allowanceController = require('../controller/allowanceController');

module.exports = app =>{
    app.post("/api/v1/createAllowance", allowanceController.create_Allowance);
    app.get("/api/v1/getall_Allowance",allowanceController.get_Allowance);
    app.get("/api/v1/getActive_Allowance",allowanceController.getActive_Allowance);
    app.get("/api/v1/Allowance_getById/:id",allowanceController.Allowance_getById);
    app.put("/api/v1/Allowance_updateById/:id",allowanceController.updateAllowanceById);
    app.put("/api/v1/Allowance_Status/:id",allowanceController.allowanceStatus);
    app.delete("/api/v1/Allowance_deleteById/:id",allowanceController.deleteAllowanceById);
    app.get("/api/v1/get_all_employe/:entity_id",allowanceController.getEmployeebyEntityId);
   
}