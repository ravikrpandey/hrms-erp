const ATT_controller = require("../controller/att_calender_controller");
const verifyAuthToken = require("../../../middleware/AuthVerifyToken");

module.exports = app => {
    app.post("/api/v1/attendance/verified_punch", verifyAuthToken, ATT_controller.verified_punch);
    app.post("/api/v1/attendance/enroll_face", verifyAuthToken, ATT_controller.enroll_face);
    app.get("/api/v1/attendance/face_status/:employee_id?", verifyAuthToken, ATT_controller.get_face_status);
    app.post("/api/v1/create_DAILY_attendance", ATT_controller.create_dailyattendance);
    app.get("/api/v1/get_DAILY_attendance", ATT_controller.get_dailyattendance);
    app.get("/api/v1/get_attendanceBYmonth", ATT_controller.get_monthly_attendance);
    app.get("/api/v1/get_markdaily_Attendance", ATT_controller.markdailyAttendance);
    app.post("/api/v1/create_attand_userID", ATT_controller.create_attandance_userID);
    app.get("/api/v1/getAll_userID_list", ATT_controller.get_userID_list);
    app.get("/api/v1/attendance_Marked_Data", ATT_controller.attendanceMarkedData);
    app.get("/api/v1/WFH_Attendance_Data", ATT_controller.WFHattendanceData);
    app.get("/api/v1/getAll_userBY_entity/:entity_id", ATT_controller.get_userBY_entity_id);
    app.get("/api/v1/get_userIDdetailBYID/:id", ATT_controller.get_USERID_detailBYID);
    app.delete("/api/v1/delete_userIDdetailBYID/:id", ATT_controller.delete_USERID_dBYID);
    app.get("/api/v1/get_emp_GlobalMinutes", ATT_controller.get_emp_global_minutes);
    app.post("/api/v1/update_dailyattendance", ATT_controller.save_dailyattendance);
    app.get("/api/v1/get_daily_Attendance_Data", ATT_controller.get_daily_attendancedata);
    app.get("/api/v1/Export_to_Excel_Data/:entity_id", ATT_controller.export_data_to_Excel);
    app.post("/api/v1/export_excel_att_report/:month/:year", ATT_controller.export_excel_att_report);
    app.post("/api/v1/create_missing_punch_data", ATT_controller.missing_punch_data);
    app.get('/api/v1/global_min_decrementAfterlate', ATT_controller.global_Minute_decrease)
    app.get('/api/v1/getSerialNumber',ATT_controller.getSerialNumber )
    app.get('/api/v1/getGoogleApiKey',ATT_controller.getGoogleApiKey )





    /////////////////////////////////////// For Setting Device Id in our DB////////////

    // app.get('/api/v1/sync-device-id' , ATT_controller.syncDeviceIdToAttendanceUserId)

    /////////////////////////////////////// For Setting Multiple Device Id in our DB Exported Devices data from exel to CLIENT_DEVICE_DATA_TEMPP table in our db itself ////////////

    // app.get('/api/v1/sync-multiple-device-id', ATT_controller.syncMultipleDeviceId)

    ///////////////////////////////////////////////////////


   

}