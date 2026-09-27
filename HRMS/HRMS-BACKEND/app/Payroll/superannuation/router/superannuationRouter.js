const superannuationController = require("../controller/superannuationController")


module.exports = (app) =>{
    app.get('/api/v1/getAllsuperannuationProvider',superannuationController.getsuperannuationProvider)
    app.post('/api/v1/createOrupdateSuperannuation',superannuationController.createOrUpdateSuperannuation)
    app.get('/api/v1/getAllSuperannuationScheme',superannuationController.getAllSuperannuationScheme)
    
}