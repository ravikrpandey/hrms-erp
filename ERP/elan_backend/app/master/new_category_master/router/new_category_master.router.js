const new_category_masterController = require("../controller/new_category_master.controller");


module.exports = app => {
    app.post("/api/v1/create_new_category_master", new_category_masterController.create_new_category_master );
    app.put("/api/v1/edit_new_category_master/:id", new_category_masterController.edit_new_category_master);
    app.get("/api/v1/get_ById_new_category_master/:id", new_category_masterController.get_ById_new_category_master);
    app.get("/api/v1/getAll_new_category_master", new_category_masterController.getAll_new_category_master);
    app.delete("/api/v1/delete_new_category_master/:id", new_category_masterController.delete_new_category_master);
    app.get("/api/v1/get_BysegmentId_new_category_master/:id", new_category_masterController.get_BysegmentId_new_category_master)
}