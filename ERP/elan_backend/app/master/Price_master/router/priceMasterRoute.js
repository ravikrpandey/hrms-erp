module.exports = app => {
    const priceController = require("../controllers/priceMasterController");

    app.post("/api/v1/createPrice", priceController.createPrice);
    app.get("/api/v1/getAllPrice", priceController.getAllPrice);
    app.get("/api/v1/getByIdPrice/:id", priceController.getByIdPrice);
    app.put("/api/v1/updatePriceById/:id", priceController.updatePriceById);
    app.put("/api/v1/priceStatus/:id", priceController.priceStatus);
    app.delete("/api/v1/deletePrice/:id", priceController.deletePrice);
  
}