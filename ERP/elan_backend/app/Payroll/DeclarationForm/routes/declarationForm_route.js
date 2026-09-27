const declarationFormController = require("../controller/declarationForm_controller");
const { upload }  = require("../../../middleware/uploadDocs");

module.exports = app => {
    app.post("/api/v1/createDeclarationForm", upload.array('file', 1),  declarationFormController.createDeclarationForm)
    app.get("/api/v1/getAllDeclarationForm_by_loginId", declarationFormController.getAllDeclarationForm_by_loginId)
    app.put("/api/v1/editDeclarationForm/:id", declarationFormController.editDeclarationForm)
    app.get("/api/v1/getByIdDeclarationForm/:id", declarationFormController.getByIdDeclarationForm)
    app.delete("/api/v1/deleteDeclarationForm/:id", declarationFormController.deleteDeclarationForm)

    
    app.get("/api/v1/getAllDeclarationForm_approvalData", declarationFormController.getAllDeclarationForm_approvalData)
    app.get("/api/v1/getAllDeclarationForm_pendingData", declarationFormController.getAllDeclarationForm_pendingData)
    app.get("/api/v1/getAllDeclarationForm_rejectedData", declarationFormController.getAllDeclarationForm_rejectedData)
    app.post("/api/v1/payroll_DeclarationForm_approval_status", declarationFormController.payroll_DeclarationForm_approval_status)

}