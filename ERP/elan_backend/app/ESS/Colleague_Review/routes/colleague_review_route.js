const colleagueController = require("../controller/colleague_review_controller");

module.exports = app => {
    app.get("/api/v1/get_assessment_by_year", colleagueController.get_assessment_by_year)
    app.get("/api/v1/get_employee_by_assessment_id", colleagueController.get_employee_by_assessment_id)
    app.post("/api/v1/create_colleague_review", colleagueController.create_colleague_review)
    app.get("/api/v1/get_colleague_review_list", colleagueController.get_colleague_review_list)
    app.get("/api/v1/get_user_ranking", colleagueController.get_user_ranking)
   
}