const segmentController = require("../controller/segment.controller");


module.exports = app => {
    app.post("/api/v1/create_segment", segmentController.create_segment );
    app.put("/api/v1/edit_segment/:id", segmentController.edit_segment);
    app.get("/api/v1/get_ById_segment/:id", segmentController.get_ById_segment);
    app.get("/api/v1/getAll_segment", segmentController.getAll_segment);
    app.delete("/api/v1/delete_segment/:id", segmentController.delete_segment)
}