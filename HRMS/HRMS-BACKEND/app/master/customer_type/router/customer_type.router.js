const customer_typeController = require("../controller/customer_type.controller");


module.exports = app => {
    app.post("/api/v1/create_customer_type", customer_typeController.create_customer_type );
    app.put("/api/v1/edit_customer_type/:id", customer_typeController.edit_customer_type);
    app.get("/api/v1/get_ById_customer_type/:id", customer_typeController.get_ById_customer_type);
    app.get("/api/v1/getAll_customer_type", customer_typeController.getAll_customer_type);
    app.delete("/api/v1/delete_customer_type/:id", customer_typeController.delete_customer_type)
}