const PayrollEsiController = require('../controller/esi_controller');

module.exports = app => {
    app.post('/api/v1/createEsi', PayrollEsiController.createEsi);
    app.get('/api/v1/getAllEsi', PayrollEsiController.getAllEsi);
    app.get('/api/v1/getEsiById/:id', PayrollEsiController.getEsiById);
    app.put('/api/v1/updateEsi/:id', PayrollEsiController.updateEsi);
    app.put('/api/v1/updateEsiStatus/:id', PayrollEsiController.updateEsiStatus);
}