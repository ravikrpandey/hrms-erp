const scheduleTrip = require('../controller/scheduleTripController')
const { upload } = require("../../../../app/middleware/uploadDocs");


module.exports=app=>{
    app.post('/api/v1/createScheduleTrip',upload.fields([{ name: 'upload_document', maxCount: 10 },
  { name: 'lr_copy', maxCount: 1 }]),scheduleTrip.createSchedule)
    app.get('/api/v1/get_scheduled_trip/:entity_id',scheduleTrip.getScheduledTrip)
    app.get('/api/v1/get_scheduled_trip_by_Id',scheduleTrip.getScheduledTripById)
    app.put('/api/v1/status_change/:id',scheduleTrip.statusChange)
    app.get('/api/v1/get_live_trips/:entity_id',scheduleTrip.getLiveTrips)
    app.get('/api/v1/get_live_trips_by_id/:id',scheduleTrip.getLiveTripById)
    app.post('/api/v1/create_expense_info', upload.single('file'), scheduleTrip.createExpeseInfo);
    app.get('/api/v1/all-expenses-info/:trip_id',scheduleTrip.getAllExpenseInfo )
    app.delete('/api/v1/delete_expenses_info/:id',scheduleTrip.deleteExpense )
    app.get('/api/v1/getCompletedTrip/:entity_id',scheduleTrip.getCompletedTrips) ;
    app.get('/api/v1/get_live_tripData',scheduleTrip.getLiveTripInfoDataById)
    app.post('/api/v1/complete_trip',upload.single('upload_pod'),scheduleTrip.tripComplete) ;
}