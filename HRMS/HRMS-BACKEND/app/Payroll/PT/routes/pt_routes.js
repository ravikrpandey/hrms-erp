const PtController = require("../controller/pt_controller");

module.exports = (app) => {
  // app.get('/api/v1/get-entity-state-data-by-id', PtController.getEntityStateDataById);
  app.post("/api/v1/create-pt", PtController.createPt);
  app.get("/api/v1/get-all-pt", PtController.getAllPt);
  app.put("/api/v1/update-pt-status-by-id/:id", PtController.updatePtStatusById);
  app.get("/api/v1/get-pt-by-id/:id", PtController.getPtById);
  app.put("/api/v1/update-pt-by-id/:id", PtController.updatePtById);
};
