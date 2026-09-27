 const overtimeController = require("../controller/extrahourController");
module.exports = app => {
   app.post("/api/v1/create_extraHour",overtimeController.create_extraHour);
   app.get("/api/v1/getAll_extraHour",overtimeController.getAll_extraHour);
   app.get("/api/v1/get_extraHourbyId",overtimeController.get_extraHourbyId);
}