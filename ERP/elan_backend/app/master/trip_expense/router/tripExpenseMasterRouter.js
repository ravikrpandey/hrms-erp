const expenseTripMaster = require('../controller/tripExpneseMasterController')
module.exports = app=>{
    app.post('/api/v1/tripExpenseMaster',expenseTripMaster.createTripExpenseMaster)
    app.get('/api/v1/getAlltripExpenseMaster',expenseTripMaster.getAllTripExpenseMaster)
    app.get('/api/v1/get_tripExpenseMaster_By_id/:id',expenseTripMaster.getTripExpenseMasterById)
    app.put('/api/v1/update_tripExpenseMaster_By_id/:id',expenseTripMaster.updateTripExpenseMaster)
    app.delete('/api/v1/delete_tripExpenseMaster_By_id/:id',expenseTripMaster.deleteTripExpenseMaster)
    app.put('/api/v1/status_update_tripExpenseMaster/:id',expenseTripMaster.TripExpenseStatus)

}