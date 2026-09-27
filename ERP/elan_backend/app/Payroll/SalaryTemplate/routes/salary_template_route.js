const SalaryTemplateController = require('../controller/salary_template_controller');
const {checkEntityAndFinancialYear} = require('../../../middleware/checkEntityAndFinancialYear');



module.exports = app => {
    app.post('/api/v1/createSalaryTemplate', checkEntityAndFinancialYear, SalaryTemplateController.createSalaryTemplate )
    app.get('/api/v1/getAllGrade', checkEntityAndFinancialYear, SalaryTemplateController.getAllGrade )
    app.get('/api/v1/getAllSalaryTemplate',  SalaryTemplateController.getAllSalaryTemplate )
    app.get('/api/v1/getAllActiveSalaryTemplate',  SalaryTemplateController.getAllActiveSalaryTemplate )
    app.get('/api/v1/getSalaryTemplateById/:id',  SalaryTemplateController.getSalaryTemplateById)
    app.get('/api/v1/getAllActiveBranch', SalaryTemplateController.getAllActiveBranch )
    app.get('/api/v1/getAllActiveCompany', checkEntityAndFinancialYear, SalaryTemplateController.getAllActiveCompany )
    app.get('/api/v1/getAllCompany_with_entity',  SalaryTemplateController.getAllCompany_with_entity )
    app.put('/api/v1/updateSalaryTempStatus/:id', checkEntityAndFinancialYear, SalaryTemplateController.updateSalaryTempStatus )
    app.put('/api/v1/updateSalaryTemplate/:id', checkEntityAndFinancialYear, SalaryTemplateController.updateSalaryTemplate )
    app.get('/api/v1/getAllEntityMaster', checkEntityAndFinancialYear, SalaryTemplateController.getAllEntityMaster )
}