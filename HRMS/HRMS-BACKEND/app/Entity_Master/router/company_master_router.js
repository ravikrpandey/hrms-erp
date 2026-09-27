module.exports = app =>{
    const company_master_controller = require('../controllers/company_master_controller');
    app.post("/api/v1/createCompanyMaster", company_master_controller.createCompanyMaster);
    app.get("/api/v1/getAll_companyMaster", company_master_controller.getAllCompanyList);
    app.put("/api/v1/update_companyMaster/:comp_id", company_master_controller.updateById);
    app.get("/api/v1/getById_companyMaster/:comp_id", company_master_controller.getByIdCompany);
    app.delete("/api/v1/delete_companyMaster/:comp_id", company_master_controller.deletecompanyData);
}