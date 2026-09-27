module.exports = app => {
    const courseCategoryController = require("../controller/category-controller");

    app.post("/api/v1/createCourseCategory", courseCategoryController.createCourseCategory);
    app.get("/api/v1/getAllCourseCategory", courseCategoryController.getAllCourseCategory);
    app.get("/api/v1/getByIdCourseCategory/:category_id", courseCategoryController.getByIdCourseCategory);
    app.delete("/api/v1/deleteCourseCategory/:category_id", courseCategoryController.deleteCourseCategory);  
    app.put("/api/v1/editCourseCategory/:category_id", courseCategoryController.editCourseCategory);
    app.put("/api/v1/updateCourseCategoryStatus/:category_id", courseCategoryController.updateCourseCategoryStatus);
}