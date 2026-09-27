

module.exports = app => {
    const warehouseManagementController = require('../controllers/warehouseManagementController')
    const verifyAuthToken = require("../../../middleware/AuthVerifyToken")
    const { upload } = require("../../../middleware/uploadDocs");

    app.post('/api/v1/createWarehouseManagement', upload.single('serialNumber'), verifyAuthToken, warehouseManagementController.createWarehouseManagement);
    // app.get('/api/v1/WarehouseManagementList',warehouseManagementController.WarehouseManagementList);
    // app.get('/api/v1/WarehouseManagementList', verifyAuthToken,warehouseManagementController.WarehouseManagementList);
    app.get('/api/v1/getWarehouseForDisatch', warehouseManagementController.getWarehouseForDisatch);
    app.get('/api/v1/getRowForDisatch', warehouseManagementController.getRowForDisatch);
    app.get('/api/v1/getShelfForDisatch', warehouseManagementController.getShelfForDisatch);
    app.get('/api/v1/getSectionForDisatch', warehouseManagementController.getSectionForDisatch);
    app.get('/api/v1/getsSerialNo', warehouseManagementController.getSerialNoBySection);
    app.post('/api/v1/dispatchedOrder', warehouseManagementController.dispatchedOrder);
    app.patch('/api/v1/proceedToDispatched/:id', warehouseManagementController.proceedToDispatched);
    app.get('/api/v1/viewItemSerialNo', warehouseManagementController.viewItemSerialNo);
    // app.post('/api/v1/createAddStock',upload.single('serialNumber'),  warehouseManagementController.createAddStock);
    app.get("/api/v1/get_all_user_warehouse_roles", warehouseManagementController.allwarehouseuserlist);
}