const express = require('express');

const router = express.Router();

const salesOrderController = require('../controller/salesOrderController')
const pdfController= require("../../utils/pdfController/pdf")

router.get('/api/v1/pdfSalesOrder',salesOrderController.pdfSalesOrder);
router.get("/api/v1/salesOrderDownload/:fileName",pdfController.download)
router.post("/api/v1/SalesOrderMail",salesOrderController.pdfSalesOrderMail)
router.get('/api/v1/orderList',salesOrderController.orderList);
router.get('/api/v1/orderListById',salesOrderController.orderListById);
module.exports= router;