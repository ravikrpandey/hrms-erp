const LeaveAppliedController = require('../controllers/leaveApplyController')

module.exports = app => {
  
// Add a new leave
app.post('/api/v1/ess/applyLeave', LeaveAppliedController.applyLeave);

// Get all leave list for employee
app.get('/api/v1/ess/getAllAppliedLeavesForEmployee', LeaveAppliedController.getAllAppliedLeavesForEmployee);

// Get Applied Leave By Employee Id
app.get('/api/v1/ess/getAllAppliedLeaveById', LeaveAppliedController.getAllAppliedLeaveById);

// Get All Employees By Entity
app.get('/api/v1/ess/getAllEmployeesByEntity', LeaveAppliedController.getAllEmployeesByEntity);

// Get leave list for Employee according to the department.
app.get('/api/v1/ess/getAllLeavesByDepartment', LeaveAppliedController.getAllLeavesByFilter);

app.get('/api/v1/ess/getEffectiveAppliedLeave', LeaveAppliedController.getEffectiveAppliedLeave);

// Delete applied leave from list for Employee .
app.put('/api/v1/ess/deleteAppliedLeaveById/:leave_id', LeaveAppliedController.deleteAppliedLeaveById);

// Update leave by ID
app.put('/api/v1/ess/updateAppliedLeaveById/:leave_id', LeaveAppliedController.updateAppliedLeaveById);


////////////////// Apply leave for other teammates///////////////////////

app.get('/api/v1/ess/get_allemployeeBY_managerID/:manager_id', LeaveAppliedController.get_allemployeeBY_managerID);
app.get('/api/v1/ess/getall_leaves_tobe_Approved', LeaveAppliedController.getAll_leaves_tobeApproved);
app.put('/api/v1/ess/update_leave_approval_status', LeaveAppliedController.update_leave_approvalstatus);


}