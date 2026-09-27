const express = require("express");
const router = express.Router();

const leadFormSetupController = require("../controllers/leadFormSetupController");

router.post("/api/v1/leadFormSetup", leadFormSetupController.createLeadFormSetup);
router.get("/api/v1/getLeadFormSetup/:entity_id/:financial_year_id", leadFormSetupController.getLeadFormSetup);
router.patch("/api/v1/updateLeadFormSetup", leadFormSetupController.updateLeadFormSetup);
router.post("/api/v1/createFormFieldValue", leadFormSetupController.formFieldValue);

module.exports = router;
