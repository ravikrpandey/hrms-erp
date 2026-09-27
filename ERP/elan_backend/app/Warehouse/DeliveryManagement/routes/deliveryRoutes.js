const deliveryController = require('../controllers/deliveryManagement');
module.exports = app => {
    app.get("/api/v1/getDeliveryList",deliveryController.getDeliveryList)
    app.post('/api/v1/updatePodStatus',deliveryController.updatePodStatus);
}