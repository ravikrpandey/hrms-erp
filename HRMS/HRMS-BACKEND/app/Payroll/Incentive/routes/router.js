const Incentive = require('../controller/controller.js');

module.exports = app => {
    app.post('/api/v1/createIncentive', Incentive.createOrUpdateIncentive);
    app.get('/api/v1/getAllIncentive', Incentive.getAllIncentive),
    app.get('/api/v1/getAllIncentiveById', Incentive.getAllIncentiveById)
    app.delete('/api/v1/deleteIncentive', Incentive.deleteIncentive)
}