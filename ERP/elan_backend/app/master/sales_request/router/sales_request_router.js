const sales_request = require("../controller/sales_request_controller");

module.exports = app => {
    app.post("/api/v1/create_sales_request", sales_request.create_sales_request );
    // sales_Request_notification
    app.post("/api/v1/sales_Request_notification", sales_request.sales_Request_notification );
    // updateSalesRequestbyId
    app.put("/api/v1/updateSalesRequestbyId/:id", sales_request.updateSalesRequestbyId );
    app.put("/api/v1/updateSalesRequestbyIdusingbrorstage", sales_request.updateSalesRequestbyIdusingbrorstage );



    // create_sales_request1
    app.post("/api/v1/create_sales_requestone", sales_request.create_sales_requestone );
    // getbyleadandemployeeid_sales_requestone
    app.post("/api/v1/getbyleadandemployeeid_sales_requestone", sales_request.getbyleadandemployeeid_sales_requestone );


    app.post("/api/v1/create_auditor_booking", sales_request.create_auditor_booking);
    // create_auditor_bookingattaskorder
    app.post("/api/v1/create_auditor_bookingattaskorder", sales_request.create_auditor_bookingattaskorder);
    app.get("/api/v1/getbyidauditorbookingtaskorder/:br_number" , sales_request.getByidauditorbookingtaskorder)
    app.post("/api/v1/auditor_bookingtaskorderList", sales_request.auditor_bookingtaskorderList);


    app.get("/api/v1/getAll_salesrequest", sales_request.getAll_salesrequest)
    app.get("/api/v1/getbyidauditorbooking/:lead_genration_id" , sales_request.getByidauditorbooking)
    app.get("/api/v1/getbyid_salesreqauditor_bookingsuest/:sales_request_id", sales_request.getbyId_salesrequest)
    app.get("/api/v1/getbyid_salesrequest_location/:sales_request_id", sales_request.getbyid_salesrequest_location)

    app.get("/api/v1/get_auditor_data_by_id/:id",sales_request.auditors_Data)
    app.get("/api/v1/getbyidauditorchildbooking/:lead_genration_id" , sales_request.getByidchildauditorbooking)

  
}