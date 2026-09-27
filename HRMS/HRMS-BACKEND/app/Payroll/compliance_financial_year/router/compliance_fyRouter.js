const comliance_fy = require('../controller/compliace_fy_controller');


module.exports = (app) =>{
    app.post('/api/v1/createComplianceFinancial',comliance_fy.createComplianceLimits)
    app.get('/api/v1/getComplianceLimit',comliance_fy.getComplianceLimit)
}