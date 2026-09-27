const bulkExcelController = require("../controller/bulkExcelDataUpload.contoller");
const { upload } = require("../../../middleware/uploadDocs");

module.exports = (app) => {
  app.post('/api/v1/upload_employee_excelData',  upload.single('file', 1), bulkExcelController.upload_employee_excelData);
  app.post('/api/v1/upload_attendance_excelData',  upload.single('file', 1), bulkExcelController.upload_attendance_excelData);
  app.get('/api/v1/getAllEmployeeWithCode', bulkExcelController.getAllEmployeeWithCode)

};