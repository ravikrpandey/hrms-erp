const vehical_categoryController = require("../controller/vehical_categorycontroller");

module.exports = app => {
  app.post("/api/v1/create_vehical_category",vehical_categoryController.create_vehical_category);
  app.get("/api/v1/getAll_vehical_category",vehical_categoryController.getAll_vehical_category);
  app.put("/api/v1/update_vehical_category",vehical_categoryController.update_vehical_category);
  app.get("/api/v1/get_vehical_category_byId",vehical_categoryController.get_vehical_category_byId);
  app.get("/api/v1/get_vehical_category_Active",vehical_categoryController.get_vehical_category_Active);
}