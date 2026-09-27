const express = require("express");
const router = express.Router();

const leadSummaryController = require("../controller/leadSummaryController");


router.get("/api/v1/getLeadSummaryData", leadSummaryController.getLeadSummaryData);
router.get("/api/v1/getLeadStatusData", leadSummaryController.getLeadStatusData);
router.post('/api/v1/createLeadSummary',leadSummaryController.createLeadSummary)


module.exports = router;