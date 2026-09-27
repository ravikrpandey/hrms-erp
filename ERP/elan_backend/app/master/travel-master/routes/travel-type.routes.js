const travelType = require("../controller/travel-type.controller");
const travelBudgetController = require("../controller/travel-budget.controller");

module.exports = (app) => {
  app.post("/api/v1/addTravelType", travelType.addTravelType);
  app.get("/api/v1/getAllTravelType", travelType.getAllTravelType);
  app.get("/api/v1/getTravelTypeById/:id", travelType.getTravelTypeById);
  app.delete("/api/v1/deleteTravelType/:id", travelType.deleteTravelType);

  // Travel Budget Routes
  app.post("/api/v1/addTravelBudget", travelBudgetController.addTravelBudget);
  app.get(
    "/api/v1/getAllTravelBudget",
    travelBudgetController.getAllTravelBudget
  );
  app.get("/api/v1/getTravelBudgetById/:id", travelBudgetController.getTravelBudgetById);
  app.delete("/api/v1/deleteTravelBudget/:id", travelBudgetController.deleteTravelBudget);

  // Reimbursement
  app.post("/api/v1/addReimbursementBudget", travelBudgetController.addReimbursementBudget);
  app.get(
    "/api/v1/getAllReimbursementBudget",
    travelBudgetController.getAllReimbursementBudget
  );

};
