const doc_controller = require("../controller/upload_doc_controller");
const { upload } = require("../../middleware/uploadDocs");

module.exports = app => {
    app.post("/documents", upload.single("file"), doc_controller.uploadDoc);
}