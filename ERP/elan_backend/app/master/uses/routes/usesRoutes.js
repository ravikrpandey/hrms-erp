
const usesController = require("../controller/usesController");

module.exports = app =>{
    app.get('/api/v1/getAllUses',usesController.getAllUses)
    app.get('/api/v1/getAllActiveUsageData',usesController.getAllActiveUsageData)
    app.put('/api/v1/updateUses/:id',usesController.updateUses)
    app.post('/api/v1/createUses',usesController.createUses)
    app.delete('/api/v1/deleteUses/:id',usesController.deleteUses)
    app.get('/api/v1/getAllUsesById/:id',usesController.getAllUsesById)
    app.put('/api/v1/update_usesStatus/:id',usesController.updateUsesStatus)
}
