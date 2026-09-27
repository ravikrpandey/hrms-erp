const multer = require('multer');
const authMiddleware = require('../../../middleware/auth.middleware');
const returnController = require('../controller/return.controller');

// Store file in memory so we can forward buffer to KDK API
const upload = multer({ storage: multer.memoryStorage() });

module.exports = app => {

    // Step 3: Add Return
    app.post(
        "/api/return/add",
        authMiddleware,
        returnController.addReturnController
    );

    // Step 4: Import Return
    app.post(
        "/api/return/import",
        authMiddleware,
        upload.single("file"),
        returnController.importReturnController
    );

    // Step 5: Get Return Status
    app.get(
        "/api/return/status",
        authMiddleware,
        returnController.getReturnStatusController
    );

    // Step 5: Download Error Report
    app.get(
        "/api/return/error-report",
        authMiddleware,
        returnController.downloadErrorReportController
    );

    // Step 6: Export Return Data
    app.get(
        "/api/return/export",
        authMiddleware,
        returnController.exportReturnDataController
    );

    // Step 8: Return Summary
    app.get(
        "/api/return/summary",
        authMiddleware,
        returnController.getReturnSummaryController
    );

    // Step 8: Return List
    app.get(
        "/api/return/list",
        authMiddleware,
        returnController.getReturnListController
    );

};