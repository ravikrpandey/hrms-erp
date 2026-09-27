const hsnSacMaster = require('../controller/hsnSacController');

module.exports = app => {
    app.post("/api/v1/create_hsn_sac", hsnSacMaster.create_hsn_sac);
    app.get("/api/v1/getGSTRate", hsnSacMaster.getGSTRate);
    app.get("/api/v1/getHsnSacById/:id", hsnSacMaster.getHsnSacById);
    app.get("/api/v1/getHsnSacList", hsnSacMaster.getHsnSacList);
    app.delete("/api/v1/delete_HSN_SAC/:id", hsnSacMaster.delete_HSN_SAC);
//     app.put("/api/v1/update_branchSetup/:id", Branchmater.update_branch);
//     app.put("/api/v1/branchStatus/:id", Branchmater.branchStatus);
}