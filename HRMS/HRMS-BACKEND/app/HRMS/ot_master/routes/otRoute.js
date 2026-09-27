 
const overTimeController = require('../controller/otController')

module.exports = app => {
app.post('/api/v1/hrms/createOvertime', overTimeController.createOvertime);
app.get('/api/v1/hrms/getAllOvertimeData/:entity_id',overTimeController.getAllOvertimeData)
app.put('/api/v1/hrms/updateOverTime/:entity_id',overTimeController.updateOverTime)

};