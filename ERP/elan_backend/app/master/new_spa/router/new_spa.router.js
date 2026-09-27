const new_spaController = require("../controller/new_spa.controller");


module.exports = app => {
    app.post("/api/v1/create_new_spa", new_spaController.create_new_spa );
    app.put("/api/v1/edit_new_spa/:id", new_spaController.edit_new_spa);
    app.get("/api/v1/get_ById_new_spa/:id", new_spaController.get_ById_new_spa);
    app.get("/api/v1/getAll_new_spa", new_spaController.getAll_new_spa);
    app.delete("/api/v1/delete_new_spa/:id", new_spaController.delete_new_spa);
    app.get("/api/v1/get_BysegmentId_new_spa/:id", new_spaController.get_BysegmentId_new_spa);
    app.get("/api/v1/get_Bycertificate_typeId_new_spa/:id", new_spaController.get_Bycertificate_typeId_new_spa);
}