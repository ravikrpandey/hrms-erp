
const LeaveController =  require('../controllers/leaveController') 
const PolicyController =  require('../controllers/policyController') 



module.exports = app => {
  


  

// ===================LEAVE MASTER========================================
// Add a new leave
app.post('/api/v1/hrm/addLeave', LeaveController.addLeaveMaster);

// Get all leave list
app.get('/api/v1/hrm/getAllLeaves/:financial_year_id/:entity_id/:employee_id', LeaveController.getAllLeaves);
app.get('/api/v1/hrm/getEmployeeLeave/:id/:financial_year_id', LeaveController.getLeaveDetails);
app.get('/api/v1/hrm/getLeaveDetailsByEmployee/:id/:financial_year_id', LeaveController.getLeaveDetailsByEmployee);
app.get('/api/v1/hrm/getAllCancelLeave/:entity_id/:financial_year_id', LeaveController.getAllCancelLeave);
app.post('/api/v1/hrm/cancelEmployeeLeave', LeaveController.cancelEmployeeLeave);


// Get leave by ID6
app.get('/api/v1/hrm/getLeaveById/:leave_id', LeaveController.getLeaveById);

// Update leave by ID
app.put('/api/v1/hrm/updateLeaveById/:leave_id', LeaveController.updateLeaveById);

// Update leave status by ID
app.put('/api/v1/hrm/updateLeaveStatusById/:leave_id', LeaveController.updateLeaveStatusById);

// Delete leave by ID (FOR HARD DELETE)
app.put('/api/v1/hrm/deleteLeaveById/:leave_id', LeaveController.deleteLeaveById);

app.post('/api/v1/hrm/generateLeaveCode', LeaveController.generate_leave_Code);

// =======================================================================









// ===================LEAVE POLICY LIST========================================



// Get policy list   [0 = Don't have policy  or  1 = Have policy]
app.get('/api/v1/hrm/getAllLeavesPolicyList/:withPolicy/:financial_id/:entity_id/:employee_id', PolicyController.getLeavePolicyList);

// Delete leave Policy by ID
app.put('/api/v1/hrm/deleteLeavePolicyById/:leaveId', PolicyController.deleteLeavePolicyById);


// ========================================================================








// ===================LEAVE POLICY DETAIL==================================

// 1.) Policy Details  
//  Add a new leave Policy
app.post('/api/v1/hrm/addLeavePolicy', PolicyController.addLeavePolicyDetail);

// Get leave Policy by ID
app.get('/api/v1/hrm/getLeavePolicyById/:leaveId/:financial_id/:entity_id/:employee_id', PolicyController.getLeavePolicyDetailyById);



// ========================================================================







// =====================LEAVE POLICY ENTITLEMENT============================

// // 2.) Leave Entitlement            WORKING
// //  Add a new leave Entitlement
app.post('/api/v1/hrm/addLeaveEntitlement', PolicyController.addLeaveEntitlement);

// // Get leave Entitlement by ID      WORKING
app.get('/api/v1/hrm/getLeaveEntitlementById/:leaveId/:financial_id/:entity_id/:employee_id', PolicyController.getLeaveEntitlementById);

// // Update leave Entitlement by ID
// router.get('/api/v1/hrm/updateLeaveEntitlementById/:policy_id', PolicyController.updateLeaveEntitlementById);


// ========================================================================







// ======================LEAVE POLICY APPLICABILITY=========================

// // 3.) Leave Applicability   WORKING

// //  Add a new leave Applicability
app.post('/api/v1/hrm/addLeaveApplicability', PolicyController.addLeaveApplicability);

// Get leave Applicability by ID
app.get('/api/v1/hrm/getLeaveApplicabilityById/:leave_id/:financial_id/:entity_id/:employee_id', PolicyController.getLeaveApplicabilityById);

// Get leave Applicability by ID
app.get('/api/v1/hrm/getLeaveApplicabilityForAll/:leave_id/:financial_id/:entity_id/:employee_id', PolicyController.getLeaveApplicabilityForAll);

// Update leave Applicability by ID
// app.put('/api/v1/hrm/updateLeaveApplicabilityById/:leaveId/:policy_id', PolicyController.updateLeaveApplicabilityById);


// Get all locations        WORKING
app.get('/api/v1/hrm/getAllApplicabilityLocation', PolicyController.getAllApplicabilityLocation);


// Get all designatiom      WORKING
app.get('/api/v1/hrm/getAllApplicabilityDesignation', PolicyController.getAllApplicabilityDesignation);


// Get all department       WORKING
app.get('/api/v1/hrm/getAllApplicabilityDepartment', PolicyController.getAllApplicabilityDepartment);

// ========================================================================















// =======================LEAVE POLICY RESTRICTIONS==========================

// // 4.) Leave Restrictions         WORKING
// //  Add a new leave Restrictions
app.post('/api/v1/hrm/addLeaveRestrictions', PolicyController.addLeaveRestrictions);

// Get leave Restrictions by ID      WORKING
app.get('/api/v1/hrm/getLeaveRestrictionsById/:leave_id/:financial_id/:entity_id/:employee_id', PolicyController.getLeaveRestrictionsById);

// Update leave Restrictions by ID
// app.get('/api/v1/hrm/updateLeaveRestrictionsById/:policy_id', PolicyController.updateLeaveRestrictionsById);


// ========================================================================



















};