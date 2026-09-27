const complaintController = require("../controllers/complaint.controller");
const { upload } = require("../../../middleware/uploadDocs");
module.exports = app => {
    app.post("/api/v1/createComplaint",upload.array('image_upload',15), complaintController.createComplaint)
    app.put("/api/v1/editComplaint/:id", complaintController.editComplaint)
    app.get("/api/v1/getByIdComplaint/:id", complaintController.getByIdComplaint)
    app.get("/api/v1/getByIdAllComplaint/:id", complaintController.getByIdAllComplaint)
    app.get("/api/v1/getAllComplaint", complaintController.getAllComplaint)
    app.get("/api/v1/getAll_against_complaint", complaintController.getAll_against_complaint)
    app.get("/api/v1/getAll_assigned_complaint", complaintController.getAll_assigned_complaint)
    app.delete("/api/v1/deleteComplaint/:id", complaintController.deleteComplaint)
    app.get("/api/v1/getall_employeeby_dept_id/:id", complaintController.getall_employeeby_dept_id)
}