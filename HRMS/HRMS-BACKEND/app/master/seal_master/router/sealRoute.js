const sealController = require("../controllers/sealController");

module.exports = app => {

    app.post("/api/v1/create_sealType", sealController.create_sealType);
    app.get("/api/v1/getAll_active_sealType", sealController.getAll_active_sealType);
    app.get("/api/v1/getAll_sealType", sealController.getAll_sealType);
    app.get("/api/v1/getById_sealType/:id", sealController.getById_sealType);
    app.delete("/api/v1/delete_sealType/:id", sealController.delete_sealType);
    app.put("/api/v1/update_sealType/:id", sealController.update_sealType);
}