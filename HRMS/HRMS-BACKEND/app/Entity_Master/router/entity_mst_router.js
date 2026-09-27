const entity_controller = require("../controllers/entity_mst_controller");
const { upload, uploadMultiple } = require("../../middleware/uploadDocs");

module.exports = (app) => {
  // app.post("/api/v1/create_entity", upload.array('file', 1), entity_controller.createEntityMaster);
  app.post(
    "/api/v1/create_entity",
    uploadMultiple,
    entity_controller.createEntityMaster
  );
  app.get("/api/v1/getAll_entity", entity_controller.getAll_Entity);
  app.get("/api/v1/new_getAll_entity", entity_controller.new_getAll_Entity);
  app.get("/api/v1/getById_entity/:id", entity_controller.getById_Entity);
  app.put(
  "/api/v1/update_entity/:id",
  upload.fields([
    { name: "company_logo", maxCount: 1 },
    { name: "signature_logo", maxCount: 1 }
  ]),
  entity_controller.update_Entity
);

  app.delete("/api/v1/delete_entity/:id", entity_controller.delete_Entity);
  app.post("/api/v1/status_entity/:id", entity_controller.status_entity);
  app.get(
    "/api/v1/getAll_active_Entity",
    entity_controller.getAllactive_Entity
  );
  app.get("/api/v1/get_all_company_list", entity_controller.getAllCompany);
  app.get(
    "/api/v1/get_all_entity_branch_list",
    entity_controller.getAllEntityBranch
  );
};
