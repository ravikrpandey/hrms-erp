
const bioAttendanceTimeList = require("../controllers/bioAttandance_time_controller.js");

module.exports = (app) => {
app.post("/api/v1/cron_BioAtt_workingList", bioAttendanceTimeList.cron_BioAtt_workingList);
app.post("/api/v1/getAllBioAttOfEmp", bioAttendanceTimeList.getAllBioAttOfEmp);
app.post("/api/v1/getbyIdBioAttOfEmp", bioAttendanceTimeList.getbyIdBioAttOfEmp);

};





