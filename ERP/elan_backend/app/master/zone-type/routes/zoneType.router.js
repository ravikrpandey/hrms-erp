const zoneTypeController = require("../controller/zoneType.controller");

module.exports = app => {
    app.post("/api/v1/createZoneType", zoneTypeController.createZoneType);
    app.get("/api/v1/getAllZoneTypes", zoneTypeController.getAllZoneTypes);
    app.get("/api/v1/getZoneTypeById/:id", zoneTypeController.getZoneTypeById);
    app.patch("/api/v1/updateZoneType/:id", zoneTypeController.updateZoneType);
    app.delete("/api/v1/deleteZoneType/:id", zoneTypeController.deleteZoneType);
};
