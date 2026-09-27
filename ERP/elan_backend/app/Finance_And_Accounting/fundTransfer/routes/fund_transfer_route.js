
const express = require("express");
const router = express.Router();
const fundTransfer = require('../controllers/fund_transfer_controller')

    // app.get("/api/v1/getDepartmentById/:id", fundTransfer.getDepartmentById);
    router.post("/api/v1/requestCashbookRequest", fundTransfer.requestCashbookRequest);
    router.get("/api/v1/getAllFundRequest", fundTransfer.getAllFundRequest);
    router.get("/api/v1/generate_fr_no", fundTransfer.generateFundRequestNo);
    router.get("/api/v1/getAllFundTransferApprovalLevel/:fund_transfer_id", fundTransfer.getAllFundTransferApprovalLevel);
    router.get("/api/v1/getFundTransferById", fundTransfer.getFundTransferById);
    router.put('/api/v1/approvedFundTransferById/:fund_transfer_id', fundTransfer.approvedFundTransferById);
module.exports = router;