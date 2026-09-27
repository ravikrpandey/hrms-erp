const employeeProbationController = require("../controllers/employeeResignation.controller");

module.exports = app => {
    app.post("/api/v1/createEmployeeResignation", employeeProbationController.createEmployeeResignation);//Used
    app.get("/api/v1/getAllEmployeeResignation/:id", employeeProbationController.getAllEmployeeResignation);//Used
    app.get("/api/v1/getByIdEmployeeResignation/:id", employeeProbationController.getByIdEmployeeResignation);//Used
    app.get("/api/v1/get_all_pending_Resignation/:id",employeeProbationController.get_all_pending_resignation)//Used
    app.get("/api/v1/get_all_Approved_Resignation/:id",employeeProbationController.get_all_approved_resignation)//Used
    app.get("/api/v1/get_all_Denied_Resignation/:id",employeeProbationController.get_all_Denied_resignation)//used
    app.post("/api/v1/Resignation_approve_levels/:id", employeeProbationController.approve_levels);///Used
    /////////

    
    app.put("/api/v1/editEmployeeResignation/:id", employeeProbationController.editEmployeeResignation);
    app.get("/api/v1/getByIdAllEmployeeResignation/:id", employeeProbationController.getByIdAllEmployeeResignation);
    app.delete("/api/v1/deleteEmployeeResignation/:id", employeeProbationController.deleteEmployeeResignation);
    app.put("/api/v1/Change_Resignation_status/:id", employeeProbationController.Change_Resignation_status);
    app.get("/api/v1/Get_all_Ex_Employee_list",employeeProbationController.get_all_Ex_Employee)
    app.get("/api/v1/get_all_Notice_period_serving_employee",employeeProbationController.get_all_notice_period_serving_emp)
    app.get("/api/get_all_pending_resgin/:id",employeeProbationController.get_all_pending_resigin)
    app.get("/api/get_all_approved_resign/:id",employeeProbationController.get_all_approved_resigin)
    app.get("/api/get_all_denied_resigin/:id",employeeProbationController.get_all_denied_resigin)
    app.get("/api/get_all_employee_regsign_status/:id",employeeProbationController.get_all_employee_Resign) 
    app.get("/api/v1/get_employee_resign_detials/:id",employeeProbationController.get_employee_resign_details)
    app.get('/api/v1/withdrawn_regsignation/:id/:emp_id',employeeProbationController.withdrawn_resignation)
    app.patch("/api/v1/changing_status_Notice_period_employee",employeeProbationController.change_notice_period_employee)
    // app.post("/api/v1/getAll_Resigantion_Approval_level/:id", employeeProbationController.getAll_Approval_level);
    app.post("/api/v1/create_all_resignation_approval/:id",employeeProbationController.create_all_resignation);
    app.get("/api/v1/get_all_resignation_list/:id",employeeProbationController.get_all_resignation_list);
    app.get("/api/v1/get_all_approved_resignation_list/:id",employeeProbationController.get_all_approved_resignation_list);
    app.put("/api/v1/update_resignation/:id", employeeProbationController.editAllResignation);
    app.get("/api/v1/getOffboardingEmployee", employeeProbationController.getAllOffboardingEmployee);
    app.get("/api/v1/getAllreviewList/:id",employeeProbationController.getAllReviewList);
    app.get("/api/v1/getAllApprovallevelResignation/:id", employeeProbationController.getAllApprovallevelresignation);
    app.get("/api/v1/getAllApprovedEmployeeResignation", employeeProbationController.getAllApprovedResignation);
    app.get("/api/v1/getIdbychecklistapproval/:id", employeeProbationController.getByIdChecklistapproval);
}