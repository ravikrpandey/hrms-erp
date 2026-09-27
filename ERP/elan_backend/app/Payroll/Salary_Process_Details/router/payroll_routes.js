const payroll_controller = require("../controller/payroll_controller");
const workflow_controller = require("../controller/workflow_controller");

module.exports = app => {
    app.get("/api/v1/getAll_Employee_List", payroll_controller.get_all_employee_list);
    app.get("/api/v1/getAll_Employee_List_hold", payroll_controller.get_all_employee_list_hold);
    app.get("/api/v1/employee_AttendanceDetails", payroll_controller.employee_attendance_details);
    app.get("/api/v1/employee_salary_Details_BYID", payroll_controller.employee_salary_detailsBYID);
    app.get("/api/v1/get_employeesdetails", payroll_controller.get_employee_sdetailsBYID);
    app.get("/api/v1/total_MonthlyAttendance", payroll_controller.total_monthly_attendance);
    app.post("/api/v1/generate_SalarySlip", payroll_controller.generate_salary_slip);
    app.get("/api/v1/download_SalarySlip", payroll_controller.download_salary_slip);
    app.get("/api/v1/salary_ProcessList", payroll_controller.salary_process_list);
    app.get("/api/v1/employeeList_BY_processID/:id", payroll_controller.employee_list_BYprocessID);
    app.get("/api/v1/download_allsalary_slips_zip", payroll_controller.download_allsalary_slips_zip);
    app.get("/api/v1/downloadEmployeeSalaryData", payroll_controller.downloadEmployeeSalaryData);

    app.post("/api/v1/payroll_bulk_approval_request", workflow_controller.payroll_bulk_approval_request);
    app.get("/api/v1/approval_salary_process_list", workflow_controller.approval_salary_process_list);
    app.get("/api/v1/approval_employeeList_BY_processID/:id", workflow_controller.approval_employee_list_BYprocessID);
    app.post("/api/v1/payroll_approval_status", workflow_controller.payroll_approval_status);
    app.get("/api/v1/approved_emp_list_BYprocessID/:id", workflow_controller.approved_emp_list_BYprocessID);
    app.get("/api/v1/approved_salary_processList", workflow_controller.approved_salary_processList);
    app.get("/api/v1/get_login_employee_list", workflow_controller.get_login_employee_list);
    app.get("/api/v1/approved_loginEmp_list_BYprocessID/:id", workflow_controller.approved_loginEmp_list_BYprocessID);
    app.get("/api/v1/approved_loginSalary_processList", workflow_controller.approved_loginSalary_processList);
    app.get("/api/v1/rejected_loginSalary_processList", workflow_controller.rejected_loginSalary_processList);
    app.get("/api/v1/rejected_employeeList_BY_processID/:id", workflow_controller.rejected_employeeList_BY_processID);
    app.post("/api/v1/payroll_approval_closed_status", workflow_controller.payroll_approval_closed_status);
};

