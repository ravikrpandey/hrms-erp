const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploaded_files/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 }, // 100 MB
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
      file.mimetype == "image/jfif" ||
      file.mimetype == "image/tiff" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
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
      cb("Sorry, unsupported file type", false);
    }
  },
});

module.exports = {
  upload,
  uploadMultiple: upload.fields([
    { name: "company_logo", maxCount: 1 },
    { name: "signature_logo", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
};

