 const faceDetectionController = require("../controller/face_detectionController");
const { upload } = require("../../../middleware/uploadDocs");

module.exports = app => {
 app.post("/api/v1/patient/search-by-photo",upload.single("photo"),faceDetectionController.searchPatientByPhoto);
}