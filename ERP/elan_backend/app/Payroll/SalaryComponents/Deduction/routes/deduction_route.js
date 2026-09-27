const SlryCompEarningController = require('../controller/deduction_controller');
const {checkEntityAndFinancialYear} = require('../../../../middleware/checkEntityAndFinancialYear');

    
module.exports = app => {
    app.post('/api/v1/createSalaryComponentDeduction', checkEntityAndFinancialYear, SlryCompEarningController.createSalaryComponentDeduction);
    app.get('/api/v1/getAllSlryCompDeduction', checkEntityAndFinancialYear, SlryCompEarningController.getAllSlryCompDeduction);
    app.get('/api/v1/getAllSlryCompDeductionUnformatedData', checkEntityAndFinancialYear, SlryCompEarningController.getAllSlryCompDeductionUnformatedData);
    app.get('/api/v1/getSlryCompDeductionById/:id', checkEntityAndFinancialYear, SlryCompEarningController.getSlryCompDeductionById);
    app.put('/api/v1/updateSlryCompDeduction/:id', checkEntityAndFinancialYear, SlryCompEarningController.updateSlryCompDeduction);
    app.put('/api/v1/updateSlryCompDeductionStatus/:id', checkEntityAndFinancialYear, SlryCompEarningController.updateSlryCompDeductionStatus);
}