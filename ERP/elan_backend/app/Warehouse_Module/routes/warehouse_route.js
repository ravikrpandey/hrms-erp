
const express = require('express')
const router = express.Router();
const warehouseController = require('../controllers/warehouse_controller');

router.get("/api/v1/getAll_ActiveWarehouseType", warehouseController.getAll_ActiveWarehouseType);
router.post('/api/v1/create_warehouse', warehouseController.create_warehouse);
router.get('/api/v1/getAllWarehouseMst', warehouseController.getAllWarehouseMst);
router.get("/api/v1/getByWarehouseMst/:id", warehouseController.getWarehouseById);
router.get("/api/v1/getWarehouseByIdWithBifurcation/:id", warehouseController.getWarehouseByIdWithBifurcation);
router.post('/api/v1/update_warehouse/:id', warehouseController.update_warehouse);
router.delete('/api/v1/delete_warehouse/:id', warehouseController.delete_warehouse);
router.post('/api/v1/create_warehouse_bifurcation', warehouseController.create_warehouse_bifurcation);
router.post('/api/v1/update_warehouse_bifurcation', warehouseController.update_warehouse_bifurcation);
router.post('/api/v1/update_warehouse_bifurcation/:id', warehouseController.update_warehouse_bifurcation);
router.get('/api/v1/getWarehouseBifurcationById/:id', warehouseController.getWarehouseBifurcationById);
router.get('/api/v1/getAllWarehouseBifurcation', warehouseController.getAllWarehouseBifurcation);
router.delete('/api/v1/delete_warehouse_bifurcation/:id', warehouseController.delete_warehouse_bifurcation);
router.post('/api/v1/find_location', warehouseController.find_location);
router.get('/api/v1/getWarehouseByBranch/:branch_id', warehouseController.getWarehouseByBranch);
router.get('/api/v1/getWarehouseByLocation/:location', warehouseController.getWarehouseByLocation);

router.get('/api/v1/getRecievingWarehouseData', warehouseController.getRecievingWarehouseData)
router.get('/api/v1/getAllZonesByWarehouseId', warehouseController.getAllZonesByWarehouseId)
router.get('/api/v1/getAllRacksByZoneId', warehouseController.getAllRacksByZoneId)
router.get('/api/v1/getAllShelfByRackId', warehouseController.getAllShelfByRackId)
router.get('/api/v1/getAllBinByShelfId', warehouseController.getAllBinByShelfId)
router.post('/api/v1/allocateItemInWarehouse', warehouseController.allocateItemInWarehouse);
router.get('/api/v1/getBulkStorageDataById', warehouseController.getBulkStorageDataById)

router.get("/api/v1/getWarehouseHierarchy", warehouseController.getWarehouseHierarchy);
router.get("/api/v1/getAllPendingGrnAllcation", warehouseController.getAllPendingGrnAllcation);
router.get("/api/v1/getPendingGrnAllcationById", warehouseController.getPendingGrnAllcationById);
router.get("/api/v1/getWarehouseBifurcationByTypeId", warehouseController.getWarehouseBifurcationByTypeId);
router.get("/api/v1/getAllStocksByStatus", warehouseController.getAllStocksByStatus);
router.put("/api/v1/updateStockStatus", warehouseController.updateStockStatus);
router.get("/api/v1/getsSerialNo/:grn_item_id", warehouseController.getsSerialNo);
router.get("/api/v1/getAllWarehouseList", warehouseController.getAllWarehouseList);

module.exports = router;