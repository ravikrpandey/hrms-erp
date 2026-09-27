const purchaseReturn = require("../controller/purchaseReturnController");

module.exports = app => {
    app.post("/api/v1/purchase-return", purchaseReturn.createReturn);
    app.get("/api/v1/purchase-return", purchaseReturn.getReturns);
    app.get("/api/v1/purchase-return-vendor", purchaseReturn.getReturns);
    app.get("/api/v1/purchase-return/vendors", purchaseReturn.getVendors);
    app.get("/api/v1/purchase-return/status-list", purchaseReturn.getStatusList);
    app.get("/api/v1/purchase-return/vendor/:vendor_id/grns", purchaseReturn.getGrnsByVendor);
    app.get("/api/v1/purchase-return/grn/:id/items", purchaseReturn.getGrnItemsForReturn);
    
    app.get("/api/v1/purchase-return/:id", purchaseReturn.getReturnById);
    app.put("/api/v1/purchase-return/:id", purchaseReturn.updateReturn);
    app.delete("/api/v1/purchase-return/:id", purchaseReturn.deleteReturn);
    
    app.post("/api/v1/purchase-return/:id/submit", purchaseReturn.submitReturn);
    app.post("/api/v1/purchase-return/:id/approve", purchaseReturn.approveReturn);
    app.post("/api/v1/purchase-return/:id/complete", purchaseReturn.completeReturn);
    app.post("/api/v1/purchase-return/:id/reject", purchaseReturn.rejectReturn);
    app.post("/api/v1/purchase-return/:id/cancel", purchaseReturn.cancelReturn);
};
