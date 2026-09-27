const stockTransferNew = require("../controller/stockTransfer_new");

module.exports = (app) => {
  app.get("/api/v1/generate_random_stockId", stockTransferNew.generateRandomStockId);
  app.post(
    "/api/v1/create_stockTransfer_new/:entity_id",
    stockTransferNew.createStockTransferNew
  );
  app.get("/api/v1/get_StockTransfer_List_new/:entity_id/:employee_id",stockTransferNew.getAllStockTransferNew);
  app.put(
    "/api/v1/update_stockTransfer_status/:id",
    stockTransferNew.updateStockTransferStatus
  );
  app.get(
    "/api/v1/get_available_serials_and_batches",
    stockTransferNew.getAvailableSerialsAndBatches
  );
  app.get(
    "/api/v1/getAllStockTransferById/:id",
    stockTransferNew.getStockTransferNewById
  );
};
