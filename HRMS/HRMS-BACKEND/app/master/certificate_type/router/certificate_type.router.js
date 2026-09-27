const certificate_typeController = require("../controller/certificate_type.controller");


module.exports = app => {
    app.post("/api/v1/create_certificate_type", certificate_typeController.create_certificate_type );
    app.put("/api/v1/edit_certificate_type/:id", certificate_typeController.edit_certificate_type);
    app.get("/api/v1/get_ById_certificate_type/:id", certificate_typeController.get_ById_certificate_type);
    app.get("/api/v1/getAll_certificate_type", certificate_typeController.getAll_certificate_type);
    app.delete("/api/v1/delete_certificate_type/:id", certificate_typeController.delete_certificate_type);
    app.get("/api/v1/get_BysegmentId_certificate_type/:id", certificate_typeController.get_BysegmentId_certificate_type);
}