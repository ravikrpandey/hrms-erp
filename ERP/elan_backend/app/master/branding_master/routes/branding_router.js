const branding_controller = require("../controller/branding_controller");
const {upload} = require("../../../middleware/uploadDocs") 

module.exports = app =>{

    app.post("/api/v1/create_branding_master",upload.array("image", 6), branding_controller.create_branding_master);
    app.put("/api/v1/update_branding_master/:id",upload.array("image", 6),branding_controller.update_branding_master);

    app.get("/api/v1/getAll_branding_master",branding_controller.getAll_branding_master);
    app.get("/api/v1/getBrandingWithCustomerItem",branding_controller.getBrandingWithCustomerItem);
    app.get("/api/v1/getById_branding_master/:id",branding_controller.getById_branding_master);

    app.delete("/api/v1/delete_branding_master/:id",branding_controller.delete_branding_master);
}
 