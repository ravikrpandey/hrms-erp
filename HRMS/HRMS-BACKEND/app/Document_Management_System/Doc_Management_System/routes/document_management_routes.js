const docum_manage_system_controller = require('../controller/document_management_controller');

module.exports = app => {
    // Create or Update document
    app.post("/api/v1/create_document_management_system",
        docum_manage_system_controller.create_document_management_system);

    // Get all documents (with optional filters)
    app.get("/api/v1/get_all_documents",
        docum_manage_system_controller.get_all_documents);

    app.get("/api/v1/get_document_by_id/:id/:filename",
        docum_manage_system_controller.get_document_by_id);

    // Download specific document file
    app.get("/api/v1/download_document/:id/:filename",
        docum_manage_system_controller.download_document);
}