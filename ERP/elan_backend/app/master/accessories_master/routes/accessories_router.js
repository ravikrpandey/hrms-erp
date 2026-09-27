const accessories_controller = require("../controller/accessories_controller");
const {upload} = require("../../../middleware/uploadDocs") 

module.exports = app =>{
    app.post("/api/v1/create_accessories_master",upload.single("accessories_doc"), accessories_controller.create_accessories_master);
    app.get("/api/v1/getAll_accessories_master",accessories_controller.getAll_accessories_master);
    app.get("/api/v1/getAll_active_accessories",accessories_controller.getAll_active_accessories);

    app.get("/api/v1/getById_accessories_master/:id",accessories_controller.getById_accessories_master);
    app.delete("/api/v1/delete_accessories_master/:id",accessories_controller.delete_accessories_master);
    app.put("/api/v1/update_accessories_master",upload.single("accessories_doc"),accessories_controller.update_accessories_master);
    app.put("/api/v1/update_accessories_status/:id",accessories_controller.update_accessories_status);
    
    app.get("/api/v1/getAccessoriesBySubCategory/:accessories_cat_id/:sub_category_id", accessories_controller.getAccessoriesBySubCategory);
}
 