const formSetupController = require("../controller/component_type_controller");
const dynamicFormSetController = require("../controller/dynamic_form_setup_controller");



module.exports = app => {
    app.post("/api/v1/createComponentSetup",  formSetupController.create_dynamic_component_type);
    app.get("/api/v1/get_component_type_by_id/:id",  formSetupController.get_component_type_by_id);
    app.get("/api/v1/get_all_component_type",  formSetupController.get_all_component_type);
    app.get("/api/v1/get_all_component_type_active",  formSetupController.get_all_component_type_active);
    app.put("/api/v1/edit_component_type/:id",  formSetupController.edit_component_type);
    app.delete("/api/v1/delete_component_type/:id",  formSetupController.delete_component_type);
    app.put("/api/v1/status_component_type/:id",  formSetupController.status_component_type);
   

    app.post("/api/v1/createfromSetup",  dynamicFormSetController.createFromSetup);
    app.get("/api/v1/getFormSetup/:id",  dynamicFormSetController.getFormSetup);
    app.get("/api/v1/getFormSetup_all",  dynamicFormSetController.getFormSetup_all);
    app.put("/api/v1/updateFormSetup",  dynamicFormSetController.updateFormSetup);
    app.put("/api/v1/formDynamicFieldValue",  dynamicFormSetController.formDynamicFieldValue);
    app.get("/api/v1/getDynamicFormDetails/:id",  dynamicFormSetController.getDynamicFormDetails);
    app.get("/api/v1/getStatusOfDynamicField/:id",  dynamicFormSetController.getStatusOfDynamicField);
   
   
} 