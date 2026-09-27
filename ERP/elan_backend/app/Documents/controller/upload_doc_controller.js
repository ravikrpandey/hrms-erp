const fs = require('fs');
const logger = require('../../../logger/index');

module.exports.uploadDoc = async (req, res, next) => {
    try {
        if (req.file.path) {
            let file_path = req.file.path.replace(/\\/g, '/');
            file_path = file_path.substring(file_path.lastIndexOf('/')+1);
            return res.status(200).send({ code: 200, status: true, url: file_path });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message });
    }
}


module.exports.uploadComplaintDoc = async (req, res, next) => {
    try {
        // Check if files are uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({
                code: 400,
                status: false,
                message: "No files uploaded"
            });
        }

        // Map over the uploaded files and generate their URLs
        const fileUrls = req.files.map(file => {
            let file_path = file.path.replace(/\\/g, '/'); // Normalize path separators

            // Construct the public URL for the uploaded file
            const fileName = file_path.substring(file_path.lastIndexOf('/') + 1);
            const fileUrl = `/uploads/${fileName}`; // Assuming '/uploads/' is the static path
            return fileUrl;
        });

        // Return a success response with the file URLs
        return res.status(200).send({
            code: 200,
            status: true,
            files: fileUrls
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message
        });
    }
};