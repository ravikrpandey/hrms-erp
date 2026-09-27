const ctrl = require('./common.controller');
const uploaderCtrl = require('./data.uploader.controller');
const { dynamicUploader } = require('../../app/middleware/uploadFiles');
const {uploadDocuments}=require('../common/shippingDocumentUploads')
// const multer = require("multer");
// const upload = multer({ storage });
module.exports = app => {
    app.get("/api/v1/getPostOfficeByPincode/:pincode", ctrl.getPostOfficeByPincode);

    // Upload employee data from Excel file
    // Accepts: multipart/form-data with Excel file
    // Optional query params: ?sheetName=SheetName&folderName=excel_uploads
    app.post("/api/v1/uploadEmployeeFromExcel",
        dynamicUploader('excel_uploads'),
        uploaderCtrl.uploadEmployeeFromExcel
    );

    app.post('/api/v1/upload-documents',dynamicUploader('cha_documents'),uploadDocuments);
}