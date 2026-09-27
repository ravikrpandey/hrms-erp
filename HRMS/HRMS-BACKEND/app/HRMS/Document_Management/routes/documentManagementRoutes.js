const documentManagement = require("../controller/documentManagementController");

module.exports = app => {
    app.post("/api/v1/document-Management-create", documentManagement.saveOrUpdateDocument);
    app.get("/api/v1/document-Management-list", documentManagement.getAllDocuments);
    app.get("/api/v1/document-Management/:id", documentManagement.getDocumentById);
    app.put("/api/v1/document-Management/:id", documentManagement.updateDocument);
    app.delete("/api/v1/document-Management/:id", documentManagement.deleteDocument);
    app.get("/api/v1/users-list", documentManagement.usersList);
    app.post("/api/v1/document-Management-preview", documentManagement.documentManagementPreview);
    app.post("/api/v1/document-Management-send-mail", documentManagement.sendTemplateMail);
    app.get("/api/v1/template-assigned-user-list", documentManagement.getTemplatesAssignedByEmpId);
};