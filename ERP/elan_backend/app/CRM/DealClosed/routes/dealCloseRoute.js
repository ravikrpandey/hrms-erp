const express = require('express');

const router = express.Router();

const dealClosedController = require('../controller/dealClosedController')

router.post('/api/v1/createDealClosed',dealClosedController.createDealClosed);
router.get('/api/v1/getDealClosedList',dealClosedController.getDealClosedList);
router.get('/api/v1/dealCloseVersionByLeadId',dealClosedController.dealCloseVersionByLeadId);
router.get('/api/v1/getDealCloseById',dealClosedController.getDealCloseById);
router.get('/api/v1/getSalesOrderList',dealClosedController.getSalesOrderList);
module.exports= router;