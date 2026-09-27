const elanCtrl = require("../third-party/elan.controller");

module.exports = (app) => {
  // Organization Type Master Routes
  app.post(
    "/api/v1/third-party/createOrgTypeMaster",
    elanCtrl.createOrgTypeMaster
  );
  app.put(
    "/api/v1/third-party/updateOrgTypeMaster/:id",
    elanCtrl.updateOrgTypeMaster
  );
  app.get(
    "/api/v1/third-party/getAllOrgTypeMasters",
    elanCtrl.getAllOrgTypeMasters
  );
  app.delete(
    "/api/v1/third-party/deleteOrgTypeMasterById/:id",
    elanCtrl.deleteOrgTypeMasterById
  );

  // Organization Setup Routes
  app.post("/api/v1/third-party/createOrgSetup", elanCtrl.createOrgSetup);

  app.put("/api/v1/third-party/updateOrgSetup/:id", elanCtrl.updateOrgSetup);
  app.get("/api/v1/third-party/getAllOrgSetups", elanCtrl.getAllOrgSetups);
  app.delete(
    "/api/v1/third-party/deleteOrgSetupById/:id",
    elanCtrl.deleteOrgSetupById
  );
  app.get("/api/v1/third-party/getAllOrgUsers/:orgId", elanCtrl.getAllOrgUsers);
  app.get(
    "/api/v1/third-party/getOrgPrimaryUser/:orgId",
    elanCtrl.getOrgPrimaryUser
  );

  app.post("/api/v1/third-party/createOrgUser", elanCtrl.createOrgUser);

  app.put("/api/v1/third-party/updateOrgUser/:id", elanCtrl.updateOrgUser);
  app.delete("/api/v1/third-party/deleteOrgUser/:id", elanCtrl.deleteOrgUser);
};
