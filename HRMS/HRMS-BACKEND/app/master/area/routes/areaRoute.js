module.exports = app => {
    const areaController = require("../controller/areaController");

    app.post("/api/v1/createArea", areaController.createArea);
    app.get("/api/v1/getAllArea/:entity_id", areaController.getAllArea);
    app.get("/api/v1/getByIdArea/:id", areaController.getByIdArea);
    app.put("/api/v1/updateAreaById/:id", areaController.updateAreaById);
    app.delete("/api/v1/deleteArea/:id", areaController.deleteArea);
    app.put("/api/v1/areaStatus/:id", areaController.AreaStatus);
  
   
}