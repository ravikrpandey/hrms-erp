module.exports = app => {
    const submenu_masterController = require("../controller/submenuMaster.controller");
 
    app.post("/api/v1/createSubmenuMaster", submenu_masterController.createsubmenuMaster);
    app.get("/api/v1/getAllSubmenuMaster", submenu_masterController.getAllsubmenuMaster);
    app.get("/api/v1/getByIdSubmenuMaster/:submenu_master_id", submenu_masterController.getByIdsubmenuMaster);
    app.put("/api/v1/editSubmenuMaster/:submenu_master_id", submenu_masterController.editsubmenuMaster);  
    app.delete("/api/v1/deleteSubmenuMaster/:submenu_master_id", submenu_masterController.deletesubmenuMaster);

 
}