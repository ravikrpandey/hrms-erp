const CustomermicroCategory = require("../controller/customer_micro_controller");

module.exports = app => {
    app.post("/api/v1/createCustomermicroCategory", CustomermicroCategory.createCustomermicroCategory);
    app.get("/api/v1/getAllCustomermicroCategory", CustomermicroCategory.getAllCustomermicroCategory);
    app.put("/api/v1/editCustomermicroCategory/:id", CustomermicroCategory.editCustomermicroCategory);
    app.get("/api/v1/getByIdCustomermicroCategory/:id", CustomermicroCategory.getByIdCustomermicroCategory);
    app.put("/api/v1/customermicroCategoryStatus/:id", CustomermicroCategory.customermicroCategoryStatus);
    app.delete("/api/v1/deleteCustomermicroCategory/:id", CustomermicroCategory.deleteCustomermicroCategory);
    app.get("/api/v1/getAllmicroCategory/:id", CustomermicroCategory.getAllmicroCategory);
}