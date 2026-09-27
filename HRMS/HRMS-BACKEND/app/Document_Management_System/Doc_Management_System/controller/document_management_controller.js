const db = require("../../../models/index");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads/documents';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + sanitizedOriginalName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only ${allowedExtensions.join(', ')} files are allowed.`), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 10
    },
    fileFilter: fileFilter
}).array('documents', 10);

exports.create_document_management_system = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            let errorMessage = 'File upload error';
            if (err.code === 'LIMIT_FILE_SIZE') {
                errorMessage = 'File size exceeds 50MB limit';
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                errorMessage = 'Maximum 10 files allowed';
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                errorMessage = 'Unexpected field in form data';
            }
            return res.status(400).json({
                code: 400,
                message: errorMessage,
            });
        } else if (err) {
            return res.status(400).json({
                code: 400,
                message: err.message,
            });
        }

        try {
            const {
                id,
                entity_id,
                employee_id,
                department_id,
                designation_id,
                states_id,
                document_category,
                uploaded_date,
                uploaded_by,
                version
            } = req.body;

            console.log('✅ Received request body:', req.body);

            // Basic validation
            if (!document_category) {
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                }
                return res.status(400).json({
                    code: 400,
                    message: "Document category is required",
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    code: 400,
                    message: "At least one document file is required",
                });
            }

            if (!entity_id) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                return res.status(400).json({
                    code: 400,
                    message: "Entity ID is required",
                });
            }

            // ✅ Category-specific validation - Accept '0' as valid
            const categoryValidation = {
                "Employee-related": ['department_id', 'employee_id'],
                "Company Policies": ['department_id', 'designation_id'],
                "Compliance Documents": ['states_id', 'designation_id'],
                "Training & Performance": ['department_id', 'employee_id']
            };

            if (categoryValidation[document_category]) {
                const requiredFields = categoryValidation[document_category];
                const missingFields = requiredFields.filter(field => {
                    const value = req.body[field];
                    // ✅ Field is missing only if undefined, null, or empty string (0 is valid)
                    return value === undefined || value === null || value === '';
                });

                if (missingFields.length > 0) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                    return res.status(400).json({
                        code: 400,
                        message: `Missing required fields for ${document_category}: ${missingFields.join(', ')}`,
                    });
                }
            }

            // Process uploaded files
            const uploadedDocuments = req.files.map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                path: file.path.replace(/\\/g, '/'),
                size: file.size,
                mimetype: file.mimetype,
                uploadedAt: new Date().toISOString()
            }));

            // ✅ Build document data with proper type conversion
            const documentData = {
                entity_id: parseInt(entity_id),
                document_category,
                uploaded_date: uploaded_date || new Date(),
                uploaded_by,
                upload_document: JSON.stringify(uploadedDocuments),
                version: version || '1.0',
                // ✅ Convert to integer or null (NOT 0)
                employee_id: employee_id && employee_id !== '0' ? parseInt(employee_id) : null,
                department_id: department_id && department_id !== '0' ? parseInt(department_id) : null,
                designation_id: designation_id && designation_id !== '0' ? parseInt(designation_id) : null,
                states_id: states_id && states_id !== '0' ? parseInt(states_id) : null
            };

            console.log('✅ Document data to be saved:', documentData);

            let responseMessage = "";
            let documentRecord;

            if (id) {
                // Update existing record
                const existingRecord = await db.document_management_system.findOne({
                    where: { id }
                });

                if (!existingRecord) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });

                    return res.status(404).json({
                        code: 404,
                        message: "Document record not found",
                    });
                }

                // Delete old files
                if (existingRecord.upload_document) {
                    try {
                        const oldFiles = JSON.parse(existingRecord.upload_document);
                        if (Array.isArray(oldFiles)) {
                            oldFiles.forEach(oldFile => {
                                if (fs.existsSync(oldFile.path)) {
                                    fs.unlinkSync(oldFile.path);
                                }
                            });
                        }
                    } catch (parseError) {
                        console.error('Error parsing old documents:', parseError);
                    }
                }

                // Update with new data
                documentData.updated_at = new Date();

                // ✅ Use validate: false to bypass Sequelize NOT NULL validation
                await existingRecord.update(documentData, { validate: false });

                documentRecord = existingRecord;
                responseMessage = "Document updated successfully!";
            } else {
                // Create new record
                documentData.created_at = new Date();
                documentData.updated_at = new Date();

                // ✅ Use validate: false to bypass Sequelize NOT NULL validation
                documentRecord = await db.document_management_system.create(documentData, { validate: false });
                responseMessage = "Document uploaded successfully!";
            }

            console.log('✅ Document saved successfully:', documentRecord.id);

            return res.status(200).json({
                code: 200,
                message: responseMessage,
                data: {
                    id: documentRecord.id,
                    document_category: documentRecord.document_category,
                    version: documentRecord.version,
                    uploaded_date: documentRecord.uploaded_date,
                    files_count: uploadedDocuments.length,
                    documents: uploadedDocuments.map(doc => ({
                        filename: doc.originalname,
                        size: doc.size,
                        type: doc.mimetype
                    }))
                }
            });
        } catch (error) {
            // Cleanup on error
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        try {
                            fs.unlinkSync(file.path);
                        } catch (unlinkError) {
                            console.error('Error deleting file:', unlinkError);
                        }
                    }
                });
            }

            console.error('❌ Error in create_document_management_system:', error);

            // Handle specific database errors
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    code: 400,
                    message: 'Validation error: ' + error.errors.map(e => e.message).join(', ')
                });
            }

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({
                    code: 409,
                    message: 'Duplicate entry found'
                });
            }

            return res.status(500).json({
                code: 500,
                message: error.message || "Internal server error!",
            });
        }
    });
};

exports.get_all_documents = async (req, res) => {
    try {
        const { entity_id, document_category, employee_id } = req.query;

        const whereClause = {};

        if (entity_id && entity_id !== 'null' && entity_id !== 'undefined') {
            whereClause.entity_id = entity_id;
        }

        if (document_category && document_category !== "null") {
            whereClause.document_category = document_category;
        }

        if (employee_id && employee_id !== "null") {
            whereClause.employee_id = employee_id;
        }

        const orderByColumn = db.document_management_system.rawAttributes.created_at
            ? 'created_at'
            : (db.document_management_system.rawAttributes.createdAt ? 'createdAt' : null);

        const documents = await db.document_management_system.findAll({
            where: whereClause,
            order: orderByColumn ? [[orderByColumn, 'DESC']] : undefined
        });

        const documentsWithFiles = documents.map(doc => {
            let files = [];

            try {
                files = JSON.parse(doc.upload_document || '[]');
            } catch (e) {
                console.error('Error parsing upload_document JSON:', e);
            }

            return {
                id: doc.id,
                entity_id: doc.entity_id,
                employee_id: doc.employee_id || null,
                department_id: doc.department_id || null,
                designation_id: doc.designation_id || null,
                states_id: doc.states_id || null,
                document_category: doc.document_category,
                version: doc.version,
                uploaded_date: doc.uploaded_date,
                uploaded_by: doc.uploaded_by || null,
                created_at: doc.created_at ?? doc.createdAt ?? null,
                files_count: files.length,
                files: files.map(f => ({
                    filename: f.filename,           // ✅ Server-generated filename (for API calls)
                    originalname: f.originalname,   // ✅ Original user filename (for display)
                    size: f.size,
                    type: f.mimetype,
                    mimetype: f.mimetype,           // Include both type and mimetype
                    path: f.path,                   // Optional: include path for debugging
                    uploadedAt: f.uploadedAt
                }))
            };
        });

        return res.status(200).json({
            code: 200,
            message: "Documents retrieved successfully",
            data: documentsWithFiles,
            total: documentsWithFiles.length
        });

    } catch (error) {
        console.error('Error in get_all_documents:', error);
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal server error!"
        });
    }
};

exports.get_document_by_id = async (req, res) => {
    try {
        const { id, filename } = req.params;

        const document = await db.document_management_system.findOne({
            where: { id }
        });

        if (!document) {
            return res.status(404).json({
                code: 404,
                message: "Document record not found"
            });
        }

        let files = [];
        try {
            files = JSON.parse(document.upload_document || '[]');
        } catch (e) {
            return res.status(500).json({
                code: 500,
                message: "Error parsing document data"
            });
        }

        const file = files.find(f => f.filename === filename);

        if (!file) {
            return res.status(404).json({
                code: 404,
                message: "File not found in document record"
            });
        }

        const filePath = file.path;
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                code: 404,
                message: "File not found on server"
            });
        }

        const stats = fs.statSync(filePath);

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');

        // Content headers for viewing
        res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalname)}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error in view_document:', error);
        if (!res.headersSent) {
            return res.status(500).json({
                code: 500,
                message: error.message || "Internal server error!"
            });
        }
    }
};

// Enhanced download_document with better debugging and CORS handling
exports.download_document = async (req, res) => {
    try {
        const { id, filename } = req.params;

        console.log('========================================');
        console.log('📥 Download Request Received');
        console.log('Document ID:', id);
        console.log('Filename:', filename);
        console.log('========================================');

        // Find document record
        const document = await db.document_management_system.findOne({
            where: { id }
        });

        if (!document) {
            console.error('❌ Document record not found in database');
            return res.status(404).json({
                code: 404,
                message: "Document record not found"
            });
        }

        console.log('✅ Document record found');

        // Parse files from JSON
        let files = [];
        try {
            files = JSON.parse(document.upload_document || '[]');
            console.log('📂 Total files in record:', files.length);
        } catch (e) {
            console.error('❌ Error parsing document data:', e);
            return res.status(500).json({
                code: 500,
                message: "Error parsing document data"
            });
        }

        // Find the specific file
        const file = files.find(f => f.filename === filename);

        if (!file) {
            console.error('❌ File not found in document record');
            console.log('Available files:', files.map(f => f.filename));
            return res.status(404).json({
                code: 404,
                message: "File not found in document record"
            });
        }

        console.log('✅ File found in record:', file.filename);
        console.log('File path:', file.path);
        console.log('File size:', file.size);
        console.log('File mimetype:', file.mimetype);

        // Check if file exists on disk
        const filePath = file.path;
        if (!fs.existsSync(filePath)) {
            console.error('❌ File not found on disk:', filePath);
            return res.status(404).json({
                code: 404,
                message: "File not found on server"
            });
        }

        console.log('✅ File exists on disk');

        // Get file stats
        const stats = fs.statSync(filePath);
        console.log('Actual file size on disk:', stats.size, 'bytes');

        // Set CORS headers (important for cross-origin requests)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');

        // Set content headers
        res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
        res.setHeader('Content-Length', stats.size);

        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalname)}"`);

        // For download, you might want to check a query parameter
        if (req.query.download === 'true') {
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalname)}"`);
        }

        console.log('✅ Headers set, starting file stream...');

        // Create read stream
        const fileStream = fs.createReadStream(filePath);

        // Handle stream events
        fileStream.on('open', () => {
            console.log('✅ File stream opened');
        });

        fileStream.on('error', (error) => {
            console.error('❌ Error streaming file:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    code: 500,
                    message: "Error streaming file"
                });
            }
        });

        fileStream.on('end', () => {
            console.log('✅ File stream completed successfully');
            console.log('========================================\n');
        });

        // Pipe file to response
        fileStream.pipe(res);

    } catch (error) {
        console.error('❌ Error in download_document:', error);
        console.error('Error stack:', error.stack);
        console.log('========================================\n');

        if (!res.headersSent) {
            return res.status(500).json({
                code: 500,
                message: error.message || "Internal server error!"
            });
        }
    }
};
