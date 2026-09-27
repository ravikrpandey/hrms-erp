const gstGlMappingController = require('../controller/gstGlAccountMappingController');

module.exports = app =>{
    app.post("/api/v1/addGSTGlMapping", gstGlMappingController.addGSTGlMapping);
    app.get("/api/v1/get_GST_Type",gstGlMappingController.get_GST_Type);
    app.get("/api/v1/get_GST_GL_Mapping_List/:entity_id",gstGlMappingController.get_GST_GL_Mapping_List);
    app.get("/api/v1/get_GST_GL_Mapping_By_Id/:id",gstGlMappingController.get_GST_GL_Mapping_By_Id);

    app.put("/api/v1/updateGstGlMapping/:id",gstGlMappingController.updateGstGlMapping);
    app.delete("/api/v1/deleteGstGlMappingById/:id",gstGlMappingController.deleteGstGlMappingById);
    // app.put("/api/v1/statusUpdatedAdditional/:id",additionalController.statusUpdateStatus);
    app.post("/api/v1/mapSalesCA", gstGlMappingController.mapSalesCA);
    app.get("/api/v1/get_mapped_sales_gl/:id",gstGlMappingController.get_mapped_sales_gl);



}