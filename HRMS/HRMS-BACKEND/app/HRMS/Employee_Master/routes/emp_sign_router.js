const emp_sign_controller=require("../controllers/emp_sign_controller")
const {upload}=require("../../../middleware/uploadDocs")

module.exports=app=>{
    app.post("/api/v1/create_employee_sign/:id",upload.single(""),emp_sign_controller.create_emp_sign)
    app.get("/api/v1/get_employee_sign_by_id/:id",emp_sign_controller.get_emp_document_by_id)
    app.get("/api/v1/get_all_employee_sign",emp_sign_controller.get_all_employee_sign)
    app.patch("/api/v1/update_employee_sign/:id",upload.single(""),emp_sign_controller.update_emp_sign)
    app.delete("/api/v1/emplooye_sign_inactive/:id",emp_sign_controller.Inactive_employee_sign)
    app.delete("/api/v1/delete_employee_sign/:id",emp_sign_controller.delete_employe_sign)
}
