
const entity_controller = require('../controllers/entity_mst_controller');
const { upload }  = require("../../middleware/uploadDocs");

module.exports = app => {   
    app.post("/api/v1/create_entity", upload.array('file', 1), entity_controller.createEntityMaster);
    app.get("/api/v1/getAll_entity", entity_controller.getAll_Entity);
    app.get("/api/v1/getById_entity/:id", entity_controller.getById_Entity);
    app.put("/api/v1/update_entity/:id",upload.array('file', 1),  entity_controller.update_Entity);
    app.delete("/api/v1/delete_entity/:id", entity_controller.delete_Entity);
    app.post("/api/v1/status_entity/:id", entity_controller.status_entity);
    app.get("/api/v1/getAll_active_Entity", entity_controller.getAllactive_Entity);
    app.get("/api/v1/getEntityDataByGroupName", entity_controller.getEntityDataByGroupName);
    app.get("/api/v1/getEntityDataHierarchyView", entity_controller.getEntityDataHierarchyView);
    app.get("/api/v1/registerForGSTPortalEntity", entity_controller.registerForGSTPortalEntity);
    app.post("/api/v1/verifyOtpForGSTPortalEntity", entity_controller.verifyOtpForGSTPortalEntity);
};  