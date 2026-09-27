const CustomerCategory = require("../controller/customer_sub_category");

module.exports = app => {
    app.post("/api/v1/createCustomersubCategory", CustomerCategory.createCustomersubCategory);
    app.get("/api/v1/getAllCustomersubcategory", CustomerCategory.getAllCustomersubcategory);
    app.put("/api/v1/editCustomersubCategory/:id", CustomerCategory.editCustomersubCategory);
    app.put("/api/v1/customerSubCategoryStatus/:id", CustomerCategory.customerSubCategoryStatus);
    app.get("/api/v1/getByIdCustomersubCategory/:id", CustomerCategory.getByIdCustomersubCategory);
    app.get("/api/v1/getAllSubCategory/:id", CustomerCategory.getAllSubCategory);
    app.delete("/api/v1/deleteCustomerSubCategory/:id", CustomerCategory.deleteCustomerSubCategory);
    
}