const multer = require("multer")
const path = require("path")
const location = path.join("uploaded_files")
const crypto = require('crypto');
var storage = multer.diskStorage({
  destination: "uploaded_files/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

module.exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100mb
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/PNG" ||
      file.mimetype == "image/JPG" ||
      file.mimetype == "image/JPEG" ||
      file.mimetype == "image/GIF" ||
      file.mimetype == "application/vnd.openxmlformats" ||
      file.mimetype == "application/pdf" ||
      file.mimetype == "application/msword" ||
      file.mimetype == "text/csv" ||
      file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (xlsx)" ||
      file.mimetype == "application/xhtml+xml" ||
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheetml") ||
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/mpeg" ||
      file.mimetype == "video/avi" ||
      file.mimetype == "video/x-matroska" || 
      file.mimetype == "video/quicktime" ||
      file.mimetype == "audio/mpeg" ||       
      file.mimetype == "audio/wav" ||        
      file.mimetype == "audio/ogg" ||        
      file.mimetype == "audio/mp4" ||        
      file.mimetype == "audio/aac"  
  ) {
      cb(null, true);
    } else {
      cb("Sorry, pick file ", false);
    }
  },
});

