const appraisalDurationController = require("../controller/appraisalDuration_controller");

module.exports = app => {
    app.post("/api/v1/createApprisalDuration", appraisalDurationController.createApprisalDuration)
    app.get("/api/v1/getAllAppraisalDuration", appraisalDurationController.getAllAppraisalDuration)
    app.get("/api/v1/getByIdAppraisalDuration/:id", appraisalDurationController.getByIdAppraisalDuration)
    app.put("/api/v1/editAppraisalDuration/:id", appraisalDurationController.editAppraisalDuration)

    app.delete("/api/v1/deleteAppraisalDuration/:id", appraisalDurationController.deleteAppraisalDuration)
    app.post("/api/v1/updateAppraisalStatus/:id", appraisalDurationController.updateAppraisalStatus)
}