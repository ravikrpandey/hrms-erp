const SlryCompEarningController = require('../controller/reimbursement_controller');
const {checkEntityAndFinancialYear} = require('../../../../middleware/checkEntityAndFinancialYear');
module.exports = app => {
    app.post('/api/v1/createSalaryComponentReimbursement', checkEntityAndFinancialYear, SlryCompEarningController.createSalaryComponentReimbursement);
    app.get('/api/v1/getAllSlryCompReimbursement', checkEntityAndFinancialYear, SlryCompEarningController.getAllSlryCompReimbursement);
    app.get('/api/v1/getAllSlryCompReimbursementUnformatedData', checkEntityAndFinancialYear, SlryCompEarningController.getAllSlryCompReimbursementUnformatedData);
    app.get('/api/v1/getSlryCompReimbursementById/:id',SlryCompEarningController.getSlryCompReimbursementById);
    app.put('/api/v1/updateSlryCompReimbursement/:id', checkEntityAndFinancialYear, SlryCompEarningController.updateSlryCompReimbursement);
    app.put('/api/v1/updateSlryCompReimbursementStatus/:id', checkEntityAndFinancialYear, SlryCompEarningController.updateSlryCompReimbursementStatus);


  


}