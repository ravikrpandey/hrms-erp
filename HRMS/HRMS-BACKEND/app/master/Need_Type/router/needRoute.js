const needController = require("../controllers/needController");

module.exports = app => {

    app.post("/api/v1/create_need", needController.create_need);
    app.get("/api/v1/getAll_active_need", needController.getAll_active_need);
    app.get("/api/v1/getAll_need", needController.getAll_need);
    app.get("/api/v1/getById_need/:id", needController.getById_need);
    app.delete("/api/v1/delete_need/:id", needController.delete_need);
    app.put("/api/v1/update_need/:id", needController.update_need);
}