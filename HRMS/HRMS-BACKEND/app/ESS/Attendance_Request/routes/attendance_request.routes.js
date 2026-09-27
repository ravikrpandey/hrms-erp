const attendanceController = require("../controllers/attendance_request.controller");

module.exports = (app) => {

  app.post("/api/v1/createAttendance_request", attendanceController.createAttendance);
  app.get("/api/v1/attendance_request_by_id/:id", attendanceController.getAllAttendanceById);
  app.post("/api/v1/get_attendance_request_by_manager", attendanceController.get_attendance_request_by_manager);
  app.post("/api/v1/updateAttendancestatus", attendanceController.updateAttendanceStatus);
};
