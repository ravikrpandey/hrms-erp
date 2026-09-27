const craProvider = require("./craProviderController");

module.exports = (app) =>{
    app.get('/api/v1/getAllCraProvider',craProvider.getAllCraProviderList)
    app.post('/api/v1/createNpsScheme',craProvider.createOrUpdateNpsScheme)
    app.get('/api/v1/getAllNps',craProvider.getAllNps)
}