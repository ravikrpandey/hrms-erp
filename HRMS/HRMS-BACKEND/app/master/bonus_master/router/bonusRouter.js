const bonus_controller = require('../controller/bonusController');

module.exports = app => {
    app.post("/api/v1/create_bonus", bonus_controller.create_bonus);
    app.get("/api/v1/getAll_Bonus", bonus_controller.getAll_Bonus);
    app.get("/api/v1/getBonusById", bonus_controller.getBonusById);
    app.delete("/api/v1/deleteBonusById/:id", bonus_controller.deleteBonusById);
    app.get("/api/v1/get_emp_byId_bonus/:id", bonus_controller.getBonusEmployeesById);

}