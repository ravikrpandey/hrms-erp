const express = require('express')
const router = express.Router();
const warehouseListController = require('../controllers/warehouseListController');



router.post('/api/v1/createWarehouse',warehouseListController.createWarehouse);
router.get('/api/v1/getWarehouseList/:employee_id',warehouseListController.getWarehouseList);
router.get('/api/v1/getWarehouseById/:id',warehouseListController.getWarehouseById);
router.put('/api/v1/editWarehouse',warehouseListController.editWarehouse);
router.get('/api/v1/getWarehouseByPlant/:plantId',warehouseListController.getWarehouseByPlant);
router.put("/api/v1/warehouseStatus/:id", warehouseListController.warehouseStatus);
router.delete("/api/v1/deleteWarehouse/:id", warehouseListController.deleteWarehouse);
router.get('/api/v1/warehouse/location-hierarchy',warehouseListController.getWarehouseLocationHierarchy);





router.post('/api/v1/getStockWarehouse',warehouseListController.getStockWarehouse);


module.exports = router;