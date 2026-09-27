const CustomerCategory = require("../controller/customer_category_controller");

module.exports = app => {
    app.post("/api/v1/createCustomerCategory", CustomerCategory.createCustomerCategory);
    app.get("/api/v1/getAllCustomerCategory", CustomerCategory.getAllCustomerCategory);
    app.get("/api/v1/getByIdCustomerCategory/:id", CustomerCategory.getByIdCustomerCategory);
    app.put("/api/v1/editCustomerCategory/:id", CustomerCategory.editCustomerCategory);
    app.put("/api/v1/customerCategoryStatus/:id", CustomerCategory.customerCategoryStatus);
    app.delete("/api/v1/deleteCustomerCategory/:id", CustomerCategory.deleteCustomerCategory);
}