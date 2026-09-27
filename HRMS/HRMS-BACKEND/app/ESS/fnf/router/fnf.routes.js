const fnfController = require("../controler/fnf.controller");
const multer = require("multer");
const path = require("path");

// Setup multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = app => {
  app.post('/api/v1/fnf/submit', fnfController.createFnfFullData);
  app.put('/api/v1/fnf/update/:employee_id', fnfController.updateFnfFullData);
  app.get('/api/v1/fnf/getFnfFullDataById/:employee_id', fnfController.getFnfFullDataById);
  app.get('/api/v1/fnf/list', fnfController.getMinimalFnfList);
  app.post('/api/v1/fnf/send_fnf_email', upload.single('pdf'), fnfController.sendMailFnf);
};
