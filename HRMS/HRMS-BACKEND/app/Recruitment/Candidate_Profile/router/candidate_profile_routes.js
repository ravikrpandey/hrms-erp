const candidateController = require("../controller/candidate_profile_controller");

module.exports = app => {
    app.get("/api/v1/getAll_candidate_profile", candidateController.getAll_candidate_profile);
    app.get("/api/v1/getAll_candidate_BY_JD_id", candidateController.getAll_candidate_BY_JD_id);
    app.post("/api/v1/create_new_candidate", candidateController.create_new_candidate_through_JD);
    app.put("/api/v1/update_candidate_profile", candidateController.update_candidate_profile);
    app.post("/api/v1/create_interview_schedule", candidateController.create_interview_schedule);
    app.get("/api/v1/get_scheduled_interview_list", candidateController.get_scheduled_interview_list);
    app.get("/api/v1/get_candidate_interview_details_by_id", candidateController.get_interview_details_by_id);
    app.put("/api/v1/update_candidate_interview_status", candidateController.update_candidate_interview_status);
    app.get("/api/v1/get_interview_round_details", candidateController.get_candidate_interview_round_details);
    app.get("/api/v1/get_candidates_interview_details", candidateController.get_candidates_interview_details);
    app.get("/api/v1/get_candidates_answer_details", candidateController.get_candidates_Answerdetails);
    app.get("/api/v1/get_interview_round_details_byID", candidateController.get_interview_round_details_byID);
    app.put("/api/v1/update_candidate_selection_status", candidateController.update_candidate_selection_status);
    app.get("/api/v1/get_cand_interviewer_details", candidateController.get_cand_interviewer_details);
    app.get("/api/v1/get_candidate_id_by_uuid/:uuid", candidateController.getCandidateIdByUuid);
}