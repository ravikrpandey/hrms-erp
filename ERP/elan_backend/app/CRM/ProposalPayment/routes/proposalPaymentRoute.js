const express = require("express");
const router = express.Router();

const closedDealController= require("../controllers/proposalPaymentController");



router.post('/api/v1/createProposalPayment', closedDealController.createProposalPayment);
router.get('/api/v1/getProposalPaymentList/:proposal_id', closedDealController.getProposalPaymentList);
router.patch('/api/v1/updateProposalPayment', closedDealController.updateProposalPayment);
router.delete('/api/v1/deleteProposalPayment', closedDealController.deleteProposalPayment);

module.exports = router;
