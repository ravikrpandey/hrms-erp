const timeSheet_controller=require("../controller/timeSheetController")


module.exports = app => {
    app.post('/api/v1/createTimeSheet', timeSheet_controller.createTimeSheet);
    app.get('/api/v1/getAllProjectsForUser/:login_id', timeSheet_controller.getAllProjectsForUser);
    app.get('/api/v1/getAllTasksForUser/:project_id/:assigned_to', timeSheet_controller.getAllTasksForUser);
    app.post('/api/v1/getTimesheetDataonMonth/:employee_id', timeSheet_controller.getTimesheetDataonMonth);


}