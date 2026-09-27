const portCtrl = require('./port-master/port.controller');
const incotermCtrl = require('./incoterm-master/incoterm.controller');

module.exports = app => {
    // PORT MASTER
    app.post("/api/v1/create_port", portCtrl.createPort);
    app.get("/api/v1/getAll_port", portCtrl.getAllPorts);
    app.get("/api/v1/get_port_by_id/:id", portCtrl.getPortById);
    app.put("/api/v1/update_port/:id", portCtrl.updatePort);
    app.delete("/api/v1/delete_port/:id", portCtrl.deletePort);
    // INCOTERM MASTER
    app.post("/api/v1/create_incoterm", incotermCtrl.createIncoterm);
    app.get("/api/v1/getAll_incoterm", incotermCtrl.getAllIncoterms);
    app.get("/api/v1/get_incoterm_by_id/:id", incotermCtrl.getIncotermById);
    app.put("/api/v1/update_incoterm/:id", incotermCtrl.updateIncoterm);
    app.delete("/api/v1/delete_incoterm/:id", incotermCtrl.deleteIncoterm);
}