const arrearsalary_controller = require('../controller/ArrearSalaryController');

module.exports = app => {
    app.post("/api/v1/create_arrear_salary", arrearsalary_controller.create_arrear_salary);
    app.get("/api/v1/get_all_arrear_salary", arrearsalary_controller.get_all_arrear_salary);
      app.get("/api/v1/get_all_arrear_salary_by_id", arrearsalary_controller.get_all_arrear_salary_by_id);
    app.delete("/api/v1/delete_arrear_salary_by_id", arrearsalary_controller.delete_arrear_salary_by_id);
}