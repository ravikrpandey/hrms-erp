  ///////////////////////// here route for get po details with vendor details for creating shipping alert  20/3/2026
    const shippingAlertController = require("../controller/shippingAlertController");

    module.exports=app=>{
      app.get("/api/v1/getPoWithVendorDetails/:po_id",shippingAlertController.getPoWithVendorDetails);
      app.post("/api/v1/createShippingAlert",shippingAlertController.createShippingAlert);
      app.get("/api/v1/getsShippingAlert",shippingAlertController.getsShippingAlert);
      app.get("/api/v1/getsShippingAlertHistory",shippingAlertController.getsShippingAlertHistory);
      app.get("/api/v1/getShippingAlertHistory/:id",shippingAlertController.getShippingAlertHistory);
      app.post("/api/v1/updateShippingAlertStatus",shippingAlertController.updateShippingAlertStatus);
      app.patch("/api/v1/updateBuyerStatus/:id",shippingAlertController.updateBuyerStatus);
      app.get("/api/v1/getVendorDashboard",shippingAlertController.getVendorDashboard);
      app.get("/api/v1/getPOListForVendor",shippingAlertController.getPOListForVendor);
    }
    
