const expectedDaysController = require('../controllers/expectedDayController')



module.exports = app => {
    app.post("/api/v1/createExpectedDays",expectedDaysController.expectedDay); 
    app.get("/api/v1/getExpectedDay",expectedDaysController.getExpectedDay);    
    app.patch("/api/v1/updateExpectedDeliveryDays/:id",expectedDaysController.updateExpectedDeliveryDays);    
} 