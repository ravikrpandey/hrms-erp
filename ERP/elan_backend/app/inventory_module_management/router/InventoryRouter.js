const warehouseController = require("../controller/warehouseController");
const warehouseBifurcationController = require("../controller/warehouseBifurcation");
const receivedStockTrransfer = require("../controller/receiveStockTransfer");
const goodsInventory = require("../controller/goodsInventory");
module.exports = (app) => {
  // createWarehouseMaster
  app.get(
    "/api/v1/get_all_warehouse_list/:entity_id/:financial_year_id",
    warehouseController.getAllWarehouseList,
  );
  app.get(
    "/api/v1/getAllNewWarehouseList/:entity_id/:financial_year_id",
    warehouseController.getAllNewWarehouseList,
  );
  app.get(
    "/api/v1/get_all_active_warehouse_list/:entity_id/:financial_year_id",
    warehouseController.getAllActiveWarehouseList,
  );
  app.post(
    "/api/v1/create_warehouse/:entity_id/:financial_year_id",
    warehouseController.createWarehouse,
  );
  app.get(
    "/api/v1/get_warehouse_code",
    warehouseController.generateWareHouseCode,
  );
  app.delete(
    "/api/v1/delete_warehouseById/:id",
    warehouseController.deleteWarehouseById,
  );
  app.get(
    "/api/v1/getwarehouseById/:id",
    warehouseController.getWarehouseByIdData,
  );
  app.put(
    "/api/v1/updateWarehouseByid/:id",
    warehouseController.updatewarehouseByid,
  );
  app.get(
    "/api/v1/getAllWarehouseWithoutId/:warehouse_id",
    warehouseController.getAllWarehouseWithoutId,
  );

  app.get(
    "/api/v1/getAllmainWarehouseList/:entity_id/:vpId",
    warehouseController.getAllmainWarehouseList,
  );

  // STOCK TRANSFER MODULE ROUTING

  // Received StockTransfer MODULE ROUTING
  app.get(
    "/api/v1/get_receivedStockTransfer_List/:entity_id",
    receivedStockTrransfer.getAllReceivedStockTransfer,
  );
  app.get(
    "/api/v1/generate_random_receiverd_stockId",
    receivedStockTrransfer.generateRandomReceivedStockId,
  );
  app.post(
    "/api/v1/create_received_stockTransfer/:entity_id",
    receivedStockTrransfer.createReceivedStockTransfer,
  );
  app.get(
    "/api/v1/getAllRecieveStockTransfer_new",
    receivedStockTrransfer.getAllRecieveStockTransferNew,
  );

  // goodsInventory MODULE ROUTING
  app.get("/api/v1/generate_batch_number", goodsInventory.generateBatchNumber);
  app.get(
    "/api/v1/getAll_goodsInventory/:entity_id",
    goodsInventory.getAllGoodsInventory,
  );
  app.post(
    "/api/v1/create_goodsInventory/:entity_id",
    goodsInventory.createGoodsInventory,
  );
  app.get(
    "/api/v1/get_goodsInventory_history/:item_id",
    goodsInventory.getGoodsInventoryHistory,
  );

  // goods Inventory Dtashboard
  app.get(
    "/api/v1/get_warehouse_dashboard/:entity_id",
    goodsInventory.getWarehouseDashboard,
  );
  app.get(
    "/api/v1/getAllInventoryRegister",
    goodsInventory.getAllInventoryRegister,
  );
  app.get(
    "/api/v1/employeeDetail/:entity_id/:branch_id",
    warehouseBifurcationController.employeeDetail,
  );
};
