const issueController=require('../controller/issuecontroller');

module.exports = app => {
    app.post("/api/v1/create_issueType", issueController.create_issueType);
    app.get("/api/v1/getAll_IssueType",issueController.getAll_IssueType);
    app.put("/api/v1/Issue_changeStatus",issueController.Issue_changeStatus);
    app.get("/api/v1/getIssueby_Id",issueController.getIssueby_Id);
    app.put("/api/v1/update_Issue",issueController.update_Issue);
    app.get("/api/v1/getActive_IssueType",issueController.getActive_IssueType);
    
}