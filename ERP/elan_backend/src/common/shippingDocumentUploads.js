exports.uploadDocuments = async (req, res) => {
    try {

        if (!req.files?.length) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded.'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path
        }));

        return res.status(200).json({
            success: true,
            message: 'Files uploaded successfully.',
            files: uploadedFiles,
            url: uploadedFiles.map(file => file.fileName)
        });

    } catch (error) {

        console.error('Upload Error:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong while uploading files.'
        });
    }
};