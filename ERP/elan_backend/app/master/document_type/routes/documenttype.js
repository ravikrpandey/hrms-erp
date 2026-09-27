module.exports = app => {
    const documentTypeMasterController = require("../contollers/documenttype.controller");
    const verifyAuthToken = require('../../../middleware/AuthVerifyToken')
    app.post("/api/v1/createDocumentTypeMaster", verifyAuthToken,documentTypeMasterController.createDocumentType);
    app.get("/api/v1/getDocumentTypeMaster", verifyAuthToken,documentTypeMasterController.getAllDocumentType);
     
}