module.exports = app => {
    const ReviewController = require("../controller/customer_review");

    app.post("/api/v1/createReview", ReviewController.createReview);
    app.get("/api/v1/getAllReview", ReviewController.getAllReview);
    app.get("/api/v1/getByIdReview/:review_id", ReviewController.getByIdReview);
    app.delete("/api/v1/deleteReview/:review_id", ReviewController.deleteReview);  
    app.put("/api/v1/editReview/:review_id", ReviewController.editReview);
    app.put("/api/v1/update_review_status/:review_id", ReviewController.update_ReviewStatus);
    app.get("/api/v1/getActiveStatus", ReviewController.getActiveStatus);
}