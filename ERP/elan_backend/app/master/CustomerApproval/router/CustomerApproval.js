const customerApproval = require('../controllers/CustomerApprovalController');

module.exports = app => {
    app.post("/api/v1/create_customer_approval", customerApproval.create_customer_approval);
    app.get("/api/v1/get_all_customer_approvals", customerApproval.get_all_customer_approvals);
    app.get("/api/v1/get_customer_approvalById/:id", customerApproval.get_customer_approvalById);
    app.put("/api/v1/update_customer_approval/:id", customerApproval.update_customer_approval);
    app.delete("/api/v1/delete_customer_approval/:id", customerApproval.delete_customer_approval);
  
    app.get("/api/v1/all_employee_list", customerApproval.getEmployeeListForAll);
}