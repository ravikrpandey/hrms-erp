const controller = require('../controller/taxcalculationController')

module.exports = (app) =>{
    app.post('/api/v1/createTaxMaster',controller.createTaxMaster);
    app.get('/api/v1/getAllTaxMasters',controller.getAllTaxMasters);
}