const compOffController = require("../controller/compoff.contoller");

module.exports = (app) => {
  app.post("/api/v1/saveAssignCompOff", compOffController.saveCompOff);
  app.get("/api/v1/getListdataCompOff/:entity_id", compOffController.getListdataAssignCompOff);
  app.get("/api/v1/getCompById/:id", compOffController.getSingleUserById);
  app.delete("/api/v1/deleteCompoff/:id", compOffController.deleteCompOff);
  app.put('/api/v1/updateCompOffdata/:id', compOffController.updateCompOffData);
  app.get("/api/v1/getUserEntityWise/:primary_entity_id", compOffController.getEmployeebasedOnEntity)
  app.get("/api/v1/get_daily_Attendance__InoutCompoff", compOffController.getDailyAttendancedataInOutCompOff);
  app.get('/api/v1/getCompoffOnlyLoginEmployee/:entity_id/:employee_id', compOffController.getOnlyCreatedUserData);

};
