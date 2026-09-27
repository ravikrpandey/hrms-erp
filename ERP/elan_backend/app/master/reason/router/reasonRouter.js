const ReasonController = require('../controller/reasonController');

module.exports = app => {
    app.post("/api/v1/create_reason", ReasonController.create_Reason);
    app.get("/api/v1/getall_reasons/:entity_id", ReasonController.getAllReason);
    app.get("/api/v1/get_reason_ById/:id", ReasonController.get_Reason_by_id);
    app.put("/api/v1/update_reason_ById/:id", ReasonController.update_Reason_by_id);
    app.delete("/api/v1/delete_reason_ById/:id",ReasonController.delete_Reason_by_id);
    app.put("/api/v1/resStatus/:id",ReasonController.resStatus);
}