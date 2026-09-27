const authMiddleware = require('../../middleware/auth.middleware');
const filingController = require('../controller/filing.controller');

module.exports = app => {

    // Step 7a: Generate FVU
    app.get(
        "/api/filing/fvu/generate",
        authMiddleware,
        filingController.startGenerateFvuController
    );

    // Step 7b: Get FVU Status
    app.get(
        "/api/filing/fvu/status",
        authMiddleware,
        filingController.getFvuStatusController
    );

    // Step 7c: Download FVU
    app.get(
        "/api/filing/fvu/download",
        authMiddleware,
        filingController.downloadFvuController
    );

    // Get Return Filing Status
    app.get(
        "/api/filing/receipt",
        authMiddleware,
        filingController.getReturnFilingStatus
    );

    // Download PDF Receipt
    app.get(
        "/api/filing/receiptdownlaod",
        authMiddleware,
        filingController.downloadPdfReceiptController
    );

};