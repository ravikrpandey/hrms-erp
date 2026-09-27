const setupworkcalenderController = require('../controller/setUpWorkCalender.controller');

module.exports = app => {
    app.post('/api/v1/createSetupWorkCalendder',setupworkcalenderController.createSetupWorkCalender);
    app.get('/api/v1/getAllSetupWorkCalendder/:financial_year_id/:entity_id/:createdBy/:month_name',setupworkcalenderController.getAllSetupWorkCalender);
    app.get('/api/v1/getCalendarBydeptid/:dept_id/:entity_id',setupworkcalenderController.getAllSetupWorkcalendarByid);
}
