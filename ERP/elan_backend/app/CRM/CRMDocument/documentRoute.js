
const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const path = require("path");
const fs= require('fs')
router.use(fileUpload());

router.post("/uploadDoc", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send({ code: 400, message: "No files were uploaded." });
    }
    const uploadedFile = req.files.file;
    const backendFilePath = path.join(__dirname, '/upload', uploadedFile.name);
    const filename = path.basename(backendFilePath); // Extracting only the filename
    uploadedFile.mv(backendFilePath, async (data,err) => {
      if (err) {
        return res.status(500).send({ code: 500, message: "Error uploading file." });
      }
      const relativePath = filename.replace(/^.*[\\\/]/, '');
      return res.status(200).send({ code: 200, message: "File uploaded successfully.", backendUrl: relativePath });
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
})
 
  router.get('/uploadDoc/:filename', (req, res) => {
  const filename = req.params.filename;
  const backendFilePath = path.join(__dirname, '/upload', filename);
    if (fs.existsSync(backendFilePath)) {
      return res.sendFile(backendFilePath);
    } else {
      return res.status(404).send({ code: 404, message: 'File not found.' });
    }
});

  module.exports = router