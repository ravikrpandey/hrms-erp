const ServicesCategory = require('../controller/servicescontroller');
module.exports = app => {
    app.post("/api/v1/createServies", ServicesCategory.createServies);
    app.get("/api/v1/serviesgetallcategroy", ServicesCategory.serviesgetallcategroy);
    app.get("/api/v1/activeserviesgetallcategroy", ServicesCategory.activeserviesgetallcategroy);
    app.get("/api/v1/serviesgetallcategroy_id/:id", ServicesCategory.serviesgetallcategroy_id);
    app.put("/api/v1/update_servies/:id", ServicesCategory.update_servies);
    app.delete("/api/v1/delete_servies/:id", ServicesCategory.delete_servies);
    app.put("/api/v1/serviesStatus/:id", ServicesCategory.serviesStatus);
}