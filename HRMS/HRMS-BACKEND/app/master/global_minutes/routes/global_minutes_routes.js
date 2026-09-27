module.exports = (app) => {
    const controller = require("../controller/global_minutes_controller");
  
      app.post("/api/v1/create_global_minutes", controller.createGlobalMinutes);
      app.get("/api/v1/global_minutes_list", controller.minutesList);
      app.get("/api/v1/global_minutes/:id", controller.minutesDetails);
      app.put("/api/v1/global_minute_update/:minutes_id", controller.minuteUpdate);
      app.put("/api/v1/update_minute_status/:minutes_id", controller.updateMinutesStatus);
      app.delete("/api/v1/delete_minute/:minutes_id",controller.deleteMinutes);

  };
  