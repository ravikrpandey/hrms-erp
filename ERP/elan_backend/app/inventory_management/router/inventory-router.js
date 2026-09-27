const InventoryController = require('../controller/inventory-controller');

module.exports = app => {
  app.get("/api/v1/getInventoryDashboardData", InventoryController.getDashboardData);
  app.get("/api/v1/getInventoryStockData", InventoryController.getInvStockData);
  app.get("/api/v1/getInvLedgerData", InventoryController.getInvLedgerData);
  app.get("/api/v1/getStockInTransit", InventoryController.getStockInTransit);
  app.get("/api/v1/getItemListForDirectInventory", InventoryController.getItemList);
  app.post('/api/v1/insertDirectInventory', InventoryController.insertDirectInventory);
}