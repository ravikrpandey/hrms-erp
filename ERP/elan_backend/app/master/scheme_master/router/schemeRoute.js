const schemeController = require("../controllers/schemeController");

module.exports = app => {

    app.post("/api/v1/create_scheme", schemeController.create_scheme);
    app.get("/api/v1/getAll_scheme", schemeController.getAll_scheme);
    app.get("/api/v1/getAll_active_scheme", schemeController.getAll_active_scheme);
    app.get("/api/v1/getById_scheme/:id", schemeController.getById_scheme);
    app.delete("/api/v1/delete_scheme/:id", schemeController.delete_scheme);
    app.put("/api/v1/update_scheme/:id", schemeController.update_scheme);
    app.put("/api/v1/update_scheme_status/:id", schemeController.update_scheme_status);
    app.post("/api/v1/add_promo_item", schemeController.add_promo_item);
    app.post("/api/v1/add_proposal_promo_item", schemeController.add_proposal_promo_item);
    app.post("/api/v1/remove_promo_item", schemeController.remove_promo_item);
}