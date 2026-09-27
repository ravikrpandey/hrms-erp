const candidateController = require("../controller/candidate_onboarding_controller");

module.exports = app => {
    app.put("/api/v1/approve_offer_letter", candidateController.approve_offer_letter);
    app.put("/api/v1/update_offer_letter", candidateController.update_offer_letter);
    app.get("/api/v1/generate_pdf", candidateController.generate_pdf);
    app.get("/api/v1/download_offer_letter/:candidate_id", candidateController.download_offer_letter);
    app.post("/api/v1/sendCandidate_offer_letter_link", candidateController.sendCandidate_offer_letter_link);
    app.get("/api/v1/getCandidateoffer_detailsBYID/:candidate_id", candidateController.getCandidateoffer_detailsBYID);
    app.put("/api/v1/updateCandidate_OfferStatus", candidateController.updateCandidate_OfferStatus);
    app.get("/api/v1/get_OnboardedEmployeeList/:entity_id", candidateController.get_OnboardedEmployeeList);
    app.post("/api/v1/sendmail_to_fill_candidate_details", candidateController.sendmail_to_fill_candidate_details);
    app.get("/api/v1/getCandidate_detailsByID/:candidate_id", candidateController.getCandidate_detailsByID);
    app.post("/api/v1/register_onboarded_employee", candidateController.register_onboarded_employee);
    app.put("/api/v1/update_onboarded_employee_status", candidateController.update_onboarded_employee_status);
    app.get("/api/v1/download_resume/:candidate_id", candidateController.download_resume);
    app.get("/api/v1/getcandiate_detailsBYID/:candidate_id", candidateController.getcandiate_detailsBYID);
}