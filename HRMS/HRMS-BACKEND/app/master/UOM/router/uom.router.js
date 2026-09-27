const uomdetailsController = require("../controller/uom.controller");

module.exports = app =>{
    app.post("/api/v1/create_uom",uomdetailsController.create_uom);
    app.get("/api/v1/getAllUOM",uomdetailsController.getAllUOM);
    app.get("/api/v1/getAllActiveUOM",uomdetailsController.getAllActiveUOM);
    app.get("/api/v1/getByIdUOM/:id",uomdetailsController.getByIdUOM);
    app.put("/api/v1/edituom/:id",uomdetailsController.edituom);
    app.delete("/api/v1/deleteUOM/:id",uomdetailsController.deleteUOM);
    app.put("/api/v1/UOMStatus/:id",uomdetailsController.UOMStatus);
}
