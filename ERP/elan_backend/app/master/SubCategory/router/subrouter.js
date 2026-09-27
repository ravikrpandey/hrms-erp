const subController = require("../controller/subcontroller");

module.exports = app => {
    app.post("/api/v1/createSubCategory", subController.createSubCategory);
    app.put("/api/v1/updateSubCategory/:id", subController.updateSubCategory);
    app.get("/api/v1/getAllSubCategory_id/:id", subController.getAllSubCategory_id);
    app.get("/api/v1/getAllSubCategory", subController.getAllSubCategory);
    app.delete("/api/v1/deleteSubCategory/:id", subController.deleteSubCategory)
    app.put("/api/v1/SubCategoryStatus/:id", subController.SubCategoryStatus)
    app.get("/api/v1/getAllItemCategory/:id", subController.getAllItemCategory)
}