const stageController = require("../controllers/stage.controller");

module.exports = app => {
    app.post("/api/v1/createStage", stageController.createStage);
    app.put("/api/v1/editStage/:id", stageController.editStage);
    app.get("/api/v1/getStageById/:id", stageController.getStageById);
    app.get("/api/v1/getAllStage", stageController.getAllStage);
    app.delete("/api/v1/deleteStage/:id", stageController.deleteStage)
}