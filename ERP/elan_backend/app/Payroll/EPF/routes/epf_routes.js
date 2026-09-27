const EpfController = require('../controller/epf_controller');


module.exports = app => {
    app.post('/api/v1/createEpf', EpfController.createEpf);
    app.get('/api/v1/getAllEpf', EpfController.getAllEpf);
    app.get('/api/v1/getEpfById/:id', EpfController.getEpfById);
    app.put('/api/v1/updateEpf/:id', EpfController.updateEpf);
    app.put('/api/v1/updateEpfStatus/:id', EpfController.updateEpfStatus);
}