const dashboard = require("../controller/dashboard.controller");


module.exports = (app) => {
    app.get('/api/v1/getAllLeaveEmployeeData/:entity_id', dashboard.get_All_Leave_data_get)
    app.get('/api/v1/getAllattendanceEmployeedata/:entity_id',dashboard.get_All_LeaveApplyData )
    app.get('/api/v1/getAllNewJoinandOtherData/:entity_id',dashboard.get_AllBirthDayAndOtherAnnouncementdata)
    app.get('/api/v1/getOnlyWFHEmployeeRecord/:entity_id',dashboard.get_OnlyWFHemployeeList)
    app.get('/api/v1/getAllUpcomingHoliday/:entity_id', dashboard.getAllUpComingHoliday)
}