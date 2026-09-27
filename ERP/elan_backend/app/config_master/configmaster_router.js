const config_master_controller=require("./config_master_controller")

module.exports=app=>{
    app.get("/api/v1/get_all_role_submenu_data/:id",config_master_controller.get_role_data)
    app.get("/api/v1/get_all_submenu_rolewise",config_master_controller.get_master_submenus)
}