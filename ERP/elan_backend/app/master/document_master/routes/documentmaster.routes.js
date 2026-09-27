module.exports = app => {
    const documentMasterController = require("./documentmaster.controller");
    const { upload } = require("../middleware/uploadDocs");
 
    app.post("/api/v1/createDocumentMaster", upload.array('employee_photo'), documentMasterController.createDocumentMaster);
    app.patch("/api/v1/addUpdateDocumentMaster/:document_master_id", upload.array('employee_photo'), documentMasterController.addUpdateDocumentMaster);
    app.patch("/api/v1/updateDocumentMaster/:document_master_id", upload.single('employee_photo'), documentMasterController.updateDocumentMaster);
    app.get("/api/v1/getDocumentMaster", documentMasterController.viewsAllDocumentMaster);
    app.get("/api/v1/getByIdDocumentMaster/:document_master_id", documentMasterController.viewsByIdDocumentMaster);
    app.put("/api/v1/statusDocumentMaster/:document_master_id", documentMasterController.statusDocumentMaster);
    app.get("/api/v1/downloadDocumentMaster/:fileName", documentMasterController.downloadDocumentMaster);
    app.put("/api/v1/deleteDocumentMaster/:document_master_id", documentMasterController.deleteDocumentMaster);
    app.put("/api/v1/editDocumentMaster/:document_master_id", upload.array('employee_photo'), documentMasterController.edit_Document_Master);
     
}