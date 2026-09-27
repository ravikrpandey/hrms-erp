const StatutoryEsiController = require('../controller/statutory_controller');

module.exports = app => {
    app.post('/api/v1/createStatutory', StatutoryEsiController.createStatutory);
    app.get('/api/v1/getAllStatutory', StatutoryEsiController.getAllStatutory);
    app.get('/api/v1/getStatutoryById/:id', StatutoryEsiController.getStatutoryById);
    app.put('/api/v1/updateStatutory/:id', StatutoryEsiController.updateStatutory);
}