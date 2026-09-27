const express = require("express");
const router = express.Router();

const billingController = require("../controllers/billingController");

router.get('/api/v1/billingList', billingController.billingList);
router.post('/api/v1/createBilling', billingController.createBilling);
router.get('/api/v1/getUpdatedAddress', billingController.getUpdatedAddress);


module.exports = router;
