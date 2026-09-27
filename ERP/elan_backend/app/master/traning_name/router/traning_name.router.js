const traning_nameController = require("../controller/traning_name.controller");


module.exports = app => {
    app.post("/api/v1/create_traning_name", traning_nameController.create_traning_name );
    app.put("/api/v1/edit_traning_name/:id", traning_nameController.edit_traning_name);
    app.get("/api/v1/get_ById_traning_name/:id", traning_nameController.get_ById_traning_name);
    app.get("/api/v1/getAll_traning_name", traning_nameController.getAll_traning_name);
    app.delete("/api/v1/delete_traning_name/:id", traning_nameController.delete_traning_name)
}