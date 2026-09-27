const multer = require("multer");
const doc_controller = require("../controller/upload_doc_controller");
const { upload } = require("../../middleware/uploadDocs");
const fs = require('fs');
const path = require('path');




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploaded_files"); 
    },
    filename: (req, file, cb) => {
        const originalname = file.originalname;
        const extension = path.extname(originalname);
        const basename = path.basename(originalname, extension);

        fs.readdir('./uploaded_files', (err, files) => {
            if (err) {
                console.error("Error reading uploaded_files directory:", err);
                cb(err);
                return;
            }

            let newFilename = originalname;
            let fileExists = files.includes(originalname);

           
            let i = 1;
            while (fileExists) {
                newFilename = `${basename}(${i})${extension}`;
                fileExists = files.includes(newFilename);
                i++;
            }

            cb(null, newFilename);
        });
    },
});

const upload_doc = multer({ storage: storage });

module.exports = app => {

    app.post("/WL/documents", upload.single('file'), doc_controller.uploadDoc);
    app.post("/WL/upload_document", upload_doc.single('file'), doc_controller.uploadDoc);
    app.post("/api/EL/complaintDocs", upload_doc.array('file'), doc_controller.uploadComplaintDoc);
};

