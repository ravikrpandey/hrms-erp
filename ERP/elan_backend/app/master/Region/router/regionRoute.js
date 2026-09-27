const regionController = require("../controllers/regionController");

module.exports = app => {

    app.post("/api/v1/create_region", regionController.create_region);
    app.get("/api/v1/getAll_Active_Region", regionController.getAll_Active_Region);
    app.get("/api/v1/getAll_Region", regionController.getAll_Region);
    app.get("/api/v1/getById_Region/:id", regionController.getById_Region);
    app.delete("/api/v1/delete_Region/:id", regionController.delete_Region);
    app.put("/api/v1/update_region/:id", regionController.update_region);
}