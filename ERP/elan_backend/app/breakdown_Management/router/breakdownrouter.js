const breakdownController = require('../controller/breakdownController');
const { upload } = require("../../middleware/production_doc");

module.exports = app => {
    app.post("/api/v1/createBreakdownIndent", upload.single('image_upload'), breakdownController.createBreakdownIndent);
    app.get("/api/v1/getAll_BreakdownIndent",breakdownController.getAll_BreakdownIndent);
    app.get("/api/v1/getBreakIndent_byId",breakdownController.getBreakIndent_byId);
    app.get("/api/v1/getAll_OpenIndent",breakdownController.getAll_OpenIndent);
    app.get("/api/v1/getAll_AllocatedIndent",breakdownController.getAll_AllocatedIndent);
    app.get("/api/v1/getAll_AssignedIndent",breakdownController.getAll_AssignedIndent);
    app.get("/api/v1/getAll_Status",breakdownController.getAll_Status);
    app.put("/api/v1/assigned_breakdownIndent",breakdownController.assigned_breakdownIndent);
}
