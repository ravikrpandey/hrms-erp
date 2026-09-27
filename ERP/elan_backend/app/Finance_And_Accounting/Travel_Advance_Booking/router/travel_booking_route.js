const Travel_Advance_Booking = require('../controllers/travel_booking_controller')


module.exports = app => {
    
    app.get("/api/v1/get_approved_travel_request/:financial_year_id/:entity_id", Travel_Advance_Booking.getAllApprovedTravelRequests);
    app.post("/api/v1/create_advance_booking", Travel_Advance_Booking.createTravelAdvanceBooking);
    app.post("/api/v1/get_all_advance_travel_booking", Travel_Advance_Booking.getAllTravelAdvanceBooking);

}