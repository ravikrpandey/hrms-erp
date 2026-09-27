const gratuityController = require("../controller/gratuityController");

module.exports = (app) => {
  app.post("/api/v1/create_gratuity", gratuityController.createOrUpdateGratuity);
  app.get("/api/v1/getAllGratuity",gratuityController.getAllGratuity);
  app.post("/api/v1/calculateGratuity",gratuityController.calculateGratuity);
};
