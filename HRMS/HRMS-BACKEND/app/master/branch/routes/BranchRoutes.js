const Branchmater = require('../controller/BranchController');

module.exports = app => {
    app.post("/api/v1/create_branchSetup", Branchmater.create_Branch);
    app.get("/api/v1/branchSetup_get/:id?", Branchmater.branch_get);
    app.get("/api/v1/branchSetup_get_active/:id?", Branchmater.branch_get_active);
    app.put("/api/v1/update_branchSetup/:id", Branchmater.update_branch);
    app.delete("/api/v1/delete_branchSetup/:id", Branchmater.delete_branch);
    app.put("/api/v1/branchStatus/:id", Branchmater.branchStatus);
}