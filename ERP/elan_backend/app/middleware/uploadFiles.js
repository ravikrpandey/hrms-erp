const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.dynamicUploader = (defaultFolderName = null) => {

    const isValidString = (v) =>
        typeof v === 'string' && v.trim().length > 0;

    const isTrue = (v) =>
        v === true || v === 'true';

    const storage = multer.diskStorage({

        destination: function (req, file, cb) {

            // Query params ONLY (reliable with multer)
            const folderFromReq = isValidString(req.query?.folderName) ? req.query.folderName : null;

            // fallback to default
            const folderName = folderFromReq ?? defaultFolderName;

            // basic security check
            if (folderName && folderName.includes('..')) {
                return cb(new Error('Invalid folder name'));
            }

            // default folder if folderName null
            const uploadPath = folderName
                ? path.resolve("uploaded_files", folderName)
                : path.resolve("uploaded_files");

            // Create folder if not exists
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },

        filename: function (req, file, cb) {

            const useOriginalName = req.query?.originalFileName === 'true';

            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext);

            const timestamp = Date.now();

            if (useOriginalName) {
                //  1707738452341-SO_Invoice.pdf
                return cb(null, `${timestamp}-${baseName}${ext}`);
            }

            // default behaviour
            const random = Math.round(Math.random() * 1e9);
            cb(null, `${timestamp}-${random}${ext}`);
        }

    });

    return multer({ storage }).any();
};
