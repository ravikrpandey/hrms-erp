const challanController = require('../controllers/deliveryChallanController');

module.exports = app => {
    app.post('/api/v1/create_delivery_challan/:entity_id/:financial_year_id', challanController.createDeliverychallan);

    app.get("/api/v1/getCustomerDetailsById/:id", challanController.getCustomerDetailsById);
    app.get("/api/v1/getAllDeliveryChallan/:entity_id/:financial_year_id", challanController.getAllDeliveryChallan);
    app.get("/api/v1/getSOListFORInvoice/:id", challanController.getSOListFORInvoice);
    
}