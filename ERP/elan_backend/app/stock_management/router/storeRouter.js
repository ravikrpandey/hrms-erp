const goodsInventory = require("../controller/goodsInventory");
const stockTrransfer = require("../controller/stockTransfer");
module.exports = (app) => {
  // goodsInventory MODULE ROUTING
  app.get("/api/v1/generate_batch_number", goodsInventory.generateBatchNumber);
  app.post(
    "/api/v1/create_store_goodsInventory/:entity_id",
    goodsInventory.createGrnGoodsInventory,
  );
  app.get(
    "/api/v1/get_goodsInventory_list/:entity_id/:employee_id",
    goodsInventory.getAllGrnGoodsInventory,
  );
  app.get(
    "/api/v1/get_inventoryItem_bygrnid/:store_id",
    goodsInventory.getAllGrnGoodsInventoryByGrnId,
  );
  app.get("/api/v1/generate_grn_number", goodsInventory.generateGrnNumber);
  // goods Inventory Dtashboard
  app.get(
    "/api/v1/get_stock_dashboard/:entity_id/:employee_id",
    goodsInventory.getStockDashboard,
  );

  // stock transfer
  app.get(
    "/api/v1/getstore_stockTransfer_List",
    stockTrransfer.getAllStockTransfer,
  );
  app.post(
    "/api/v1/create_store_stockTransfer/:entity_id",
    stockTrransfer.createStockTransfer,
  );
  app.get("/api/v1/random_store_stockId", stockTrransfer.generateRandomStockId);
  app.get(
    "/api/v1/get_store_stockTransfer_byId/:id",
    stockTrransfer.getStockTransferById,
  );
  app.get(
    "/api/v1/get_assigned_store_list/:entity_id/:financeId/:employee_id/:role",
    stockTrransfer.getAssignedStoreList,
  );
  app.post(
    "/api/v1/get_target_store_list/:entity_id/:financeId",
    stockTrransfer.getTargetStockList,
  );
  // receive stock transfer
  app.get(
    "/api/v1/getAllRecieveStockTransfer",
    stockTrransfer.getAllRecieveStockTransfer,
  );
  app.post(
    "/api/v1/create_rec_store_stockTransfer/:entity_id",
    stockTrransfer.createReceivedStockTransfer,
  );
  app.get(
    "/api/v1/get_received_store_stockTransfer_byId/:id",
    stockTrransfer.getAllReceiveStockTransferById,
  );

  // stock Acknowledge
  app.get(
    "/api/v1/getAll_Store_transferList/:entity_id/:status",
    stockTrransfer.getAllStoreTransferList,
  );
  app.put("/api/v1/storeStockRequest", stockTrransfer.storeStockRequest);
  app.get(
    "/api/v1/stockTransferApprover/:store_id/:stock_transfer_id",
    stockTrransfer.stockTransferApprover,
  );
};
