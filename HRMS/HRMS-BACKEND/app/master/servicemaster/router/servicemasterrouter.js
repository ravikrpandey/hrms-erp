const ServiceController = require("../controller/servicemastercontroller");
const {upload}  = require("../../../middleware/uploadDocs");

module.exports = app=> {
    // app.use(VerifyAuthToken); 
    app.post("/api/v1/createServiceMaster",upload.single('image'), ServiceController.createServiceMaster);
    app.get("/api/v1/getAllServices",ServiceController.getAllServices);
    app.get("/api/v1/getServicesById/:id",ServiceController.getServicesById);
    app.put("/api/v1/update_services/:id",upload.single('image'),ServiceController.update_services);
    app.delete("/api/v1/deleteServices/:id",ServiceController.deleteServices);
    app.put("/api/v1/updateServiceStatus/:id",ServiceController.updateServiceStatus);
}