const Complain_type_Controller = require("../controller/compain_type_controller")

module.exports = app =>{
 app.post("/api/v1/create_complaint_type",Complain_type_Controller.create_complaint_type);
 app.get("/api/v1/get_all_complaint_type",Complain_type_Controller.get_all_complaint_type);
 app.get("/api/v1/get_all_complaint_typeActive",Complain_type_Controller.get_all_complaint_typeActive);
 app.get("/api/v1/get_complaint_type_byId",Complain_type_Controller.get_complaint_type_byId);
 app.put("/api/v1/update_complaint_type",Complain_type_Controller.update_complaint_type)
}