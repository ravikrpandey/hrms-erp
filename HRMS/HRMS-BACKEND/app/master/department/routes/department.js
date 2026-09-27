module.exports = app => {
    const departmentController = require("../controller/department");

    app.post("/api/v1/createDepartment", departmentController.createDepartment);
    app.get("/api/v1/getAllDepartment", departmentController.getAllDepartment);
    app.get("/api/v1/getAllDepartment_all", departmentController.getAllDepartment_all);
    app.get("/api/v1/getByIdDepartment/:id", departmentController.getByIdDepartment);
    app.delete("/api/v1/deleteDepartment/:dept_id", departmentController.deleteDepartment);
    app.put("/api/v1/editDepartment/:dept_id", departmentController.editDepartment);
    app.get('/api/v1/calculate_Buget', departmentController.calculate_Buget)
    app.get('/api/v1/getAllDepartment_pro', departmentController.getAllDepartment_pro)
    app.put("/api/v1/updateDepartmentStatus/:departmentId", departmentController.updateDepartmentStatus);
    app.get("/api/v1/get_all_dep/:dept_id", departmentController.get_all_dep);
    app.put("/api/v1/depStatus/:id", departmentController.depStatus);
    app.get("/api/v1/get_all_workflow_department", departmentController.getAllWorkflowDepartment);



    app.post("/api/v1/createmasterDepartment", departmentController.createaMasterDepartment);
    app.put("/api/v1/editDepartmentmaster/:department_name", departmentController.editDepartmentMaster);
    app.get("/api/v1/getByIdDepartmentMaster/:department_name", departmentController.getByIdDepartmentMater);

}