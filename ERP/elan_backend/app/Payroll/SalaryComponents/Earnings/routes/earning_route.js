const SlryCompEarningController = require('../controller/earning_controller');
const {checkEntityAndFinancialYear} = require('../../../../middleware/checkEntityAndFinancialYear');
module.exports = app => {
    app.post('/api/v1/createSalaryComponentEarning', checkEntityAndFinancialYear, SlryCompEarningController.createSalaryComponentEarning);
    app.get('/api/v1/getAllSlryCompEarning', checkEntityAndFinancialYear, SlryCompEarningController.getAllSlryCompEarning);
    app.get('/api/v1/getAllSlryCompEarningUnformatedData', checkEntityAndFinancialYear, SlryCompEarningController.getAllSlryCompEarningUnformatedData);
    app.get('/api/v1/getAllCreatedSlryCompEarning',  SlryCompEarningController.getAllCreatedSlryCompEarning);
    app.get('/api/v1/getSlryCompEarningById/:id', checkEntityAndFinancialYear, SlryCompEarningController.getSlryCompEarningById);
    app.put('/api/v1/updateSlryCompEarning/:id', checkEntityAndFinancialYear, SlryCompEarningController.updateSlryCompEarning);
    app.put('/api/v1/updateSlryCompEarningStatus/:id', checkEntityAndFinancialYear, SlryCompEarningController.updateSlryCompEarningStatus);
}