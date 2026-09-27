const attendanceController = require("../controller/attendance_calendar.controller");

module.exports = app => {
    app.post("/api/v1/create_Attendance", attendanceController.create_Attendance)
    app.put("/api/v1/edit_Attendance/:id", attendanceController.edit_Attendance)
    app.get("/api/v1/get_ById_Attendance/:employee_id", attendanceController.get_ById_Attendance);
    app.get("/api/v1/get_All_InOut_Attendance", attendanceController.get_All_InOut_Attendance);
    
    app.post("/api/v1/create_Screen_On_Off", attendanceController.create_Screen_On_Off)
    app.put("/api/v1/edit_Screen_On_Off/:id", attendanceController.edit_Screen_On_Off)
    app.get("/api/v1/get_ById_Screen_On_Off/:employee_id", attendanceController.get_ById_Screen_On_Off);
    app.get("/api/v1/get_All_Screen_On_Off", attendanceController.get_All_Screen_On_Off);
    app.get("/api/v1/get_ById_Manager_Name/:id", attendanceController.get_ById_Manager_Name);

    app.get("/api/v1/get_ById_Employee_Attendance/:employee_id", attendanceController.get_ById_Employee_Attendance);
    app.get("/api/v1/get_All_Employee_Attendance", attendanceController.get_All_Employee_Attendance);
    // app.put("/api/v1/employee_Attendance/:employee_id", attendanceController.employee_Attendance);
    // app.put("/api/v1/total_Attendance_By_Employee/:employee_id", attendanceController.total_Attendance_By_Employee);
}