const new_regionController = require("../controller/new_region.controller");


module.exports = app => {
    app.post("/api/v1/create_new_region", new_regionController.create_new_region );
    app.put("/api/v1/edit_new_region/:id", new_regionController.edit_new_region);
    app.get("/api/v1/get_ById_new_region/:id", new_regionController.get_ById_new_region);
    app.get("/api/v1/getAll_new_region", new_regionController.getAll_new_region);
    app.post("/api/v1/getAll_new_regionfilterdata", new_regionController.getAll_new_regionfilterdata);

    app.delete("/api/v1/delete_new_region/:id", new_regionController.delete_new_region);
    app.get("/api/v1/get_BysegmentId_new_region/:id", new_regionController.get_BysegmentId_new_region);
    app.get("/api/v1/getAll_new_noduplicate_region", new_regionController.getAll_new_noduplicate_region);
}