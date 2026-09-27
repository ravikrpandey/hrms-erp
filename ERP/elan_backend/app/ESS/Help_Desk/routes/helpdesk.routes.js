const helpDeskController = require("../controllers/helpdesk.controller");

module.exports = app => {
   app.post("/api/v1/createHelpDesk", helpDeskController.createHelpDesk);
   app.put("/api/v1/editHelpDesk/:id", helpDeskController.editHelpDesk);
   app.get("/api/v1/getAllHelpDesk", helpDeskController.getAllHelpDesk);
   app.get("/api/v1/getByIdAllHelpDesk/:id", helpDeskController.getByIdAllHelpDesk);
   app.get("/api/v1/getUniqueNumber", helpDeskController.get_Unique_Req_No);
   app.get("/api/v1/getUniqueNumber/:id", helpDeskController.get_Unique_Req_No_Patch);
   app.get("/api/v1/getByIdHelpDesk/:id", helpDeskController.getByIdHelpDesk);
   app.delete("/api/v1/deleteHelpDesk/:id", helpDeskController.deleteHelpDesk);
}