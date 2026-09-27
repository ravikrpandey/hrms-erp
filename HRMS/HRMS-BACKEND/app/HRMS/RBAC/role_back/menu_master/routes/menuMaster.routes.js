module.exports = app => {
    const menu_masterController = require("../controller/menuMaster.controller");
 
    app.post("/api/v1/createMenuMaster", menu_masterController.createmenuMaster);
    app.get("/api/v1/getAllMenuMaster", menu_masterController.getAllmenuMaster);
    app.get("/api/v1/getByIdMenuMaster/:menu_master_id", menu_masterController.getByIdmenuMaster);
    app.put("/api/v1/editMenuMaster/:menu_master_id", menu_masterController.editmenuMaster);  
    app.delete("/api/v1/deleteMenuMaster/:menu_master_id", menu_masterController.deletemenuMaster);
    app.get("/api/v1/getAllMenuMasterChild", menu_masterController.getAllmenuMasterChild);
    app.get("/api/v1/getAllRoleMasterChild/:role_master_id", menu_masterController.getAllRoleMasterChild);


}