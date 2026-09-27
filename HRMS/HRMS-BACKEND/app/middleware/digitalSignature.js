const multer = require("multer")
const path = require("path")

var storage = multer.diskStorage({
  destination: "digital_signature/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

module.exports.digitalSignature = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/PNG" ||
      file.mimetype == "image/JPG" ||
      file.mimetype == "image/JPEG" 
    ) {
      cb(null, true);
    } else {
      cb("Sorry, pick image file ", false);
    }
  },
});