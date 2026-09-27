const additionalController = require('../controller/additionalController');

module.exports = app =>{
    app.post("/api/v1/createAdditional", additionalController.create_additional);
    app.get("/api/v1/getall_additional",additionalController.getAllAdditional);
    app.get("/api/v1/getby_additional/:id",additionalController.Additional_getById);
    app.put("/api/v1/updated_additional/:id",additionalController.updateAdditionalById);
    app.delete("/api/v1/delete_additional/:id",additionalController.deleteAdditionalById);
    app.put("/api/v1/statusUpdatedAdditional/:id",additionalController.statusUpdateStatus);



}