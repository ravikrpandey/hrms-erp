const express = require('express');
const router = express.Router();
const salesDashboardController = require('../controller/salesDashboard');

router.post('/api/v1/salesDashboard/:entity_id',salesDashboardController.salesDashboard );
router.post('/api/v1/getTotalSalesProductWise/:entity_id',salesDashboardController.getTotalSalesProductWise );
router.post('/api/v1/getTotalSalesEmployeeWise/:entity_id',salesDashboardController.getTotalSalesEmployeeWise );
router.get('/api/v1/getRevenueTrends/:entity_id/:financial_id',salesDashboardController.getRevenueTrends );
router.get('/api/v1/getSalesTrends/:entity_id',salesDashboardController.getSalesTrends );
router.post('/api/v1/getSalesForecasting/:entity_id',salesDashboardController.getSalesForecasting );
module.exports = router;