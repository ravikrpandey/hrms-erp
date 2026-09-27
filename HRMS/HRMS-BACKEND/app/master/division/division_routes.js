module.exports = (app) => {
    const controller = require("../division/division_controller");
  
      app.post("/api/v1/division", controller.createdivision);
      app.get("/api/v1/divisionlist", controller.divisionList);
      app.get("/api/v1/divisiondetails/:division_id", controller.divisionDetails);
      app.put("/api/v1/divisionupdate/:division_id", controller.divisionUpdate);
      app.put("/api/v1/divisionupdateStatus/:division_id", controller.update_divisionStatus);
      app.delete("/api/v1/divisiondelete/:division_id", controller.divisionDeleted);
      app.get("/api/v1/get_all_active_division", controller.getactivedivisionList);
  };
  