module.exports = (app) => {
    const controller = require("../business_unit/business_unit_controller");

    app.post("/api/v1/createBusinessUnit", controller.createBusinessUnit);
    app.get("/api/v1/businessUnitList", controller.businessUnitList);
    app.get("/api/v1/businessUnitById/:business_unit_id", controller.businessUnitById);
    app.put("/api/v1/businessUnitUpdate/:business_unit_id", controller.businessUnitUpdate);
    app.put("/api/v1/updateBusinessUnitStatus/:business_unit_id", controller.updateBusinessUnitStatus);
    app.delete("/api/v1/deleteBusinessUnitById/:business_unit_id", controller.deleteBusinessUnitById);
    app.get("/api/v1/getActiveBusinessUnit", controller.getActiveBusinessUnit);
};
