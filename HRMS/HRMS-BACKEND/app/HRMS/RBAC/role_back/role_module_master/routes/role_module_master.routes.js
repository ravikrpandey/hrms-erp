module.exports = app => {
    const role_module_masterController = require("../controller/role_module_master.controller");
 
    app.post("/api/v1/createrole_module_master", role_module_masterController.createrole_module_master);
    app.get("/api/v1/getAllrole_module_master", role_module_masterController.getAllrole_module_master);
    app.get("/api/v1/getByIdrole_module_master/:role_module_master_id", role_module_masterController.getByIdrole_module_master);
    app.put("/api/v1/editrole_module_master/:role_module_master_id", role_module_masterController.editrole_module_master);  
    app.delete("/api/v1/deleterole_module_master/:role_module_master_id", role_module_masterController.deleterole_module_master);



    
}
