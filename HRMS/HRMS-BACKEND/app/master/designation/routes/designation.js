module.exports = app => {
    const designationController = require("../controller/designation");

    app.post("/api/v1/createDesignation", designationController.createDesignation);
    app.get("/api/v1/getAllDesignation", designationController.getAllDesignation);
    app.get("/api/v1/getByIdDesignation/:designation_id", designationController.getByIdDesignation);
    app.delete("/api/v1/deleteDesignation/:designation_id", designationController.deleteDesignation);  
    app.put("/api/v1/editDesignation/:designation_id", designationController.editDesignation);
    app.put("/api/v1/update_designation_status/:id", designationController.update_designationStatus);
    app.put("/api/v1/desStatus/:id", designationController.desStatus);
}