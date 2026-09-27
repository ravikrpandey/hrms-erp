module.exports = app => {
    const role_masterController = require("../controller/roleMaster.controller");

    app.post("/api/v1/createRoleMaster", role_masterController.createroleMaster);
    app.get("/api/v1/getAllRoleMaster/:role_name", role_masterController.getAllroleMaster);
    app.get("/api/v1/getByIdRoleMaster/:role_master_id", role_masterController.getByIdroleMaster);
    app.get("/api/v1/getByBranchIdroleMaster/:branch_id", role_masterController.getByBranchIdroleMaster);
    app.put("/api/v1/editRoleMaster/:role_master_id", role_masterController.editroleMaster);
    app.delete("/api/v1/deleteRoleMaster/:role_master_id", role_masterController.deleteroleMaster);


}