const role_menu_accessController = require("../controller/roleMenuAccess.controller");

module.exports = app => {
    app.get("/api/v1/getAllroleMenuAccess", role_menu_accessController.getAllroleMenuAccess);
    app.patch("/api/v1/getByIdroleMenuAccess", role_menu_accessController.getByIdroleMenuAccess);
    app.put("/api/v1/editroleMenuAccess", role_menu_accessController.editroleMenuAccess); 
    app.get("/api/v1/getroleMenuAccessdetails", role_menu_accessController.getroleMenuAccess);
    app.post("/api/v1/assignaction", role_menu_accessController.crudFactionality)
    app.post("/api/v1/getassignactionfucntion", role_menu_accessController.getRolewise)
    app.post("/api/v1/searchMasterFilter", role_menu_accessController.searchMasterFilter);
}