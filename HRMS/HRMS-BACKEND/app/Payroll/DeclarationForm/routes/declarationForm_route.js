const declarationFormController = require("../controller/declarationForm_controller");
const { upload }  = require("../../../middleware/uploadDocs");

module.exports = app => {
    app.post("/api/v1/createDeclarationForm", upload.array('file', 1),  declarationFormController.createDeclarationForm)
    app.get("/api/v1/getAllDeclarationForm_by_loginId", declarationFormController.getAllDeclarationForm_by_loginId)
    app.put("/api/v1/editDeclarationForm/:id", declarationFormController.editDeclarationForm)
    app.get("/api/v1/getByIdDeclarationForm/:id", declarationFormController.getByIdDeclarationForm)
    app.delete("/api/v1/deleteDeclarationForm/:id", declarationFormController.deleteDeclarationForm)

    
    app.get("/api/v1/getAllDeclarationForm_approvalData/:approver", declarationFormController.getAllDeclarationForm_approvalData)
    app.get("/api/v1/getAllDeclarationForm_pendingData/:approver", declarationFormController.getAllDeclarationForm_pendingData)
    app.get("/api/v1/getAllDeclarationForm_rejectedData/:approver", declarationFormController.getAllDeclarationForm_rejectedData)
    app.post("/api/v1/payroll_DeclarationForm_approval_status", declarationFormController.payroll_DeclarationForm_approval_status)

     app.get("/api/v1/getAllDeclarationType", declarationFormController.getAllDeclarationType)
     app.post("/api/v1/createDeclarations",upload.any() ,declarationFormController.createOrUpdateDeclarations)
     app.get("/api/v1/getAllDeductionChapter/:employee_id", declarationFormController.getAllDeductionChapter)
     app.post("/api/v1/createHousesOnRent", declarationFormController.createOrUpdateHouses)
     app.get("/api/v1/getHousesOnRent/:employee_id", declarationFormController.getHousesOnRent)
     app.post("/api/v1/createHouseProperty", declarationFormController.createHouseProperty)
     app.get("/api/v1/getAllHouseProperties/:employee_id", declarationFormController.getAllHouseProperties)
     app.get("/api/v1/getAllSectionTotal/:employee_id", declarationFormController.getAllSectionTotal)

}