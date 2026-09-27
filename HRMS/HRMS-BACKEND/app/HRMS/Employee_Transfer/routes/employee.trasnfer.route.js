const employeeTransfer = require("../controllers/employee.transfer.controllers");

module.exports = (app) => {
  app.get("/api/v1/get_all_entityMaster", employeeTransfer.getAllEntity);
  app.post('/api/v1/save_Employee_transfer',employeeTransfer.save_Data_Employee_Transfer)
  app.get('/api/v1/list_show_Employee_tranfser/:createdBy',employeeTransfer.getAllEmployeeTransfers)
  app.get('/api/v1/get_Single_Data_employee_transfer/:id',employeeTransfer.getSingleUserdata)
  app.put("/api/v1/statusUpate/:id",employeeTransfer.statusUpdate);
  app.delete("/api/v1/delete_Record_employee_Transfer/:id",employeeTransfer.deleteTherecordEmployeeTransfer);
  app.put("/api/v1/update_the_employee_Transfer/:id",employeeTransfer.updateTheEmployeeTranfer);
  app.get('/api/v1/getlist_Pending_For_Approval/:approvalEmpId',employeeTransfer.getAfterLoginPendingApproval)
  app.put("/api/v1/Approved_Employee_Transfer/:id",employeeTransfer.approvedTheEmployee);
  app.put("/api/v1/employee_Rejected/:id",employeeTransfer.employeeRejected);
  app.get('/api/v1/get_list_Approval_employee/:approvalEmpId',employeeTransfer.getApprovedEmployee)
  app.get('/api/v1/get_list_rejected_employee/:approvalEmpId',employeeTransfer.getlistingrejectedEmployee)
};
