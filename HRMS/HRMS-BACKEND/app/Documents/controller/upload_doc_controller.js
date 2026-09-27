const fs = require('fs');

module.exports.uploadDoc = async (req, res, next) => {
    try {
        if (req.file.path) {
            let file_path = req.file.path.replace(/\\/g, '/');
            // file_path = file_path.substring(file_path.lastIndexOf('/')+1);
            return res.status(200).send({
                code: 200,
                status: true,
                url: req.file.path.replace(/\\/g, '/')
            });

        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message });
    }
}
