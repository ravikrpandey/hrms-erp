module.exports = app => {
    const courseCategoryController = require("../controller/category-controller");

    // 
app.post("/api/v1/lms/course-categories/create", courseCategoryController.createCourseCategory);
app.get("/api/v1/lms/course-categories/list", courseCategoryController.getAllCourseCategory);
app.get("/api/v1/lms/course-categories/id/:category_id", courseCategoryController.getByIdCourseCategory);
app.put("/api/v1/lms/course-categories/update/:category_id", courseCategoryController.editCourseCategory);
app.put("/api/v1/lms/course-categories/update-status/:category_id/status", courseCategoryController.updateCourseCategoryStatus);
app.delete("/api/v1/lms/course-categories/delete/:category_id", courseCategoryController.deleteCourseCategory);

}