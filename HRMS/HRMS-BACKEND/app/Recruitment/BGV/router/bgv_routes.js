const bgvController = require("../controller/bgv_controller");
const gradingConroller = require("../controller/rating-controller")

module.exports = app => {
    app.get("/api/v1/getAll_BGV_selectedcandidate/:jd_id", bgvController.getAll_BGV_selectedcandidate);
    app.post("/api/v1/create_company_details", bgvController.create_company_details);
    app.get("/api/v1/get_candidate_companyDetails", bgvController.get_candidate_companyDetails);
    app.post("/api/v1/create_company_quality_ratings", bgvController.create_company_quality_ratings);
    app.get("/api/v1/get_candidate_company_detailsBYID/:candidate_bgv_id", bgvController.get_candidate_company_detailsBYID);
    app.post("/api/v1/submit_employer_details", bgvController.submit_employer_details);
    app.put("/api/v1/update_bgv_statusDetails", bgvController.update_bgv_statusDetails);
    app.get("/api/v1/get_all_shortlisted_candidate", bgvController.get_all_shortlisted_candidate);
    app.get("/api/v1/get_shortlisted_candidateBYID/:candidate_id", bgvController.get_shortlisted_candidateBYID);
    app.post("/api/v1/create_candidate_offer_letter", bgvController.create_candidate_offer_letter);
    app.get("/api/v1/getAll_offerletters", bgvController.getAll_offerletters);
    app.get("/api/v1/getoffer_detailsBYID/:offer_id", bgvController.getoffer_detailsBYID);
    app.post("/api/v1/candidate_update_doc_mail", bgvController.candidate_update_doc_mail);
    app.post("/api/v1/upload_candidate_documents", bgvController.upload_candidate_documents);


    // self rating module 
    app.get("/api/v1/get_all_selfratings", bgvController.get_all_selfratings);
    app.get("/api/v1/ratings-master", gradingConroller.allRatings);
    app.post("/api/v1/ratings-master", gradingConroller.createRating);
    app.get("/api/v1/ratings-master/:id", gradingConroller.getRatingById);
    app.put("/api/v1/ratings-master/:id", gradingConroller.updateRatingById);
    app.delete("/api/v1/ratings-master/:id", gradingConroller.deleteRatingById);
}