const express = require('express')
const router = express.Router()

const financeProfitCenterController  = require('../controller/financeProfitCenter');

router.post("/api/v1/createProfitCenter", financeProfitCenterController.createProfitCenter);
router.get("/api/v1/getAllProfitCenter", financeProfitCenterController.getAllProfitCenter);
router.get("/api/v1/getAllProfitCenterIsGroup", financeProfitCenterController.getAllProfitCenterIsGroup);
router.get("/api/v1/getProfitCenterHierarchyViewData", financeProfitCenterController.getProfitCenterHierarchyViewData);
router.get("/api/v1/getProfitCenterById", financeProfitCenterController.getProfitCenterById);
router.post("/api/v1/updateProfitCenter/:id", financeProfitCenterController.updateProfitCenter);
router.delete("/api/v1/deleteProfitCenter/:id", financeProfitCenterController.deleteProfitCenter);
module.exports = router;