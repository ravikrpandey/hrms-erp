module.exports = app => {
    const categoryController = require("../controller/category");

    app.post("/api/v1/createCategory", categoryController.createCategory);
    app.get("/api/v1/getAllCategory/:entity_id", categoryController.getAllCategory);
    app.get("/api/v1/getByIdCategory/:category_id", categoryController.getByIdCategory);
    app.delete("/api/v1/deleteCategory/:category_id", categoryController.deleteCategory);  
    app.put("/api/v1/editCategory/:category_id", categoryController.editCategory);
    app.put("/api/v1/updateCategoryStatus/:category_id", categoryController.updateCategoryStatus);
    app.get("/api/v1/getAllActiveCategory/:entity_id", categoryController.getAllActiveCategory);
    app.get("/api/v1/getAllActiveProduct/:category_id/:entity_id", categoryController.getAllActiveProduct);
}