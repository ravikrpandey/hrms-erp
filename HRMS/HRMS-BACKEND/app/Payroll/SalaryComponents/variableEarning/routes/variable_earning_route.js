const SlryCompVariableEarningController = require('../controller/variable_earning_controller');
const {checkEntityAndFinancialYear} = require('../../../../middleware/checkEntityAndFinancialYear');
module.exports = app => {
    app.post('/api/v1/createSalaryComponentVariableEarning', checkEntityAndFinancialYear, SlryCompVariableEarningController.createSalaryComponentVariableEarning);
    // app.get('/api/v1/getAllSlryCompEarning', checkEntityAndFinancialYear, SlryCompVariableEarningController.getAllSlryCompEarning);
    // app.get('/api/v1/getAllSlryCompEarningUnformatedData', checkEntityAndFinancialYear, SlryCompVariableEarningController.getAllSlryCompEarningUnformatedData);
    app.get('/api/v1/getAllCreatedSlryVariableEarning',  SlryCompVariableEarningController.getAllCreatedSlryVariableEarning);
    app.get('/api/v1/getAllActiveVariableEarning',  SlryCompVariableEarningController.getAllActiveVariableEarning);
    app.get('/api/v1/getSlryCompVariableEarningById/:id', checkEntityAndFinancialYear, SlryCompVariableEarningController.getSlryCompVariableEarningById);
    // app.put('/api/v1/updateSlryCompEarning/:id', checkEntityAndFinancialYear, SlryCompVariableEarningController.updateSlryCompEarning);
    app.put('/api/v1/updateSlryCompVariableEarning/:id', checkEntityAndFinancialYear, SlryCompVariableEarningController.updateSlryCompVariableEarning);
    app.put('/api/v1/updateSlryCompVariableEarningStatus/:id', checkEntityAndFinancialYear, SlryCompVariableEarningController.updateSlryCompEarningStatus);
}