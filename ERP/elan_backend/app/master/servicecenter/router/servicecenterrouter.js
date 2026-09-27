const ServiceCenterController = require("../controller/servicecentercontroller");
const {upload}  = require("../../../middleware/master");
// const VerifyAuthToken = require("../../../middleware/AuthVerifyToken");

module.exports = app=> {
    // app.use(VerifyAuthToken); 
    app.post("/api/v1/createservicecenter",upload.single('image'), ServiceCenterController.createServiceCenter);
    app.get("/api/v1/getallservicecenters",ServiceCenterController.getAllServiceCenters);
    app.get("/api/v1/getservicecenterbyid/:id",ServiceCenterController.getServiceCenterById);
    app.put("/api/v1/updateservicecenter/:id",upload.single('image'),ServiceCenterController.updateServiceCenter);
    app.delete("/api/v1/deleteservicecenter/:id",ServiceCenterController.deleteServiceCenter);
    app.put("/api/v1/updateservicestatus/:id",ServiceCenterController.updateServiceCenterStatus);
    app.get("/api/v1/getallactiveservicecenters",ServiceCenterController.getAllActiveServiceCenters);
}