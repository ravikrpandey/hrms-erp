const qualityController = require("../controller/qualitycontroller");

module.exports = app => {
    app.post("/api/v1/createQuality", qualityController.create_quality);
    app.get("/api/v1/getAllQuality", qualityController.getAllQuality);
    app.get("/api/v1/getQualityById/:id", qualityController.getQualityById);
    app.put("/api/v1/updateQualityMaster/:id", qualityController.update_quality);
    app.delete("/api/v1/deleteQualityMaster/:id", qualityController.deleteQualityMaster);
    app.put("/api/v1/updateQualityStatus/:id", qualityController.updateQualityStatus);
}