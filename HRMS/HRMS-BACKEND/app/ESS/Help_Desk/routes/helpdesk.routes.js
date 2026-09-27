const helpDeskController = require("../controllers/helpdesk.controller");

module.exports = app => {
   app.post("/api/v1/createHelpDesk", helpDeskController.createHelpDesk);
   app.put("/api/v1/editHelpDesk/:id", helpDeskController.editHelpDesk);
   app.get("/api/v1/getAllHelpDesk", helpDeskController.getAllHelpDesk);
   app.get("/api/v1/getByIdAllHelpDesk/:id", helpDeskController.getByIdAllHelpDesk);
   app.get("/api/v1/getUniqueNumber", helpDeskController.get_Unique_Req_No);
   app.get("/api/v1/getUniqueNumber/:id", helpDeskController.get_Unique_Req_No_Patch);
   app.get("/api/v1/getByIdHelpDesk/:id", helpDeskController.getByIdHelpDesk);
   app.delete("/api/v1/deleteHelpDesk/:id", helpDeskController.deleteHelpDesk);

 



   //START THE API TO HELP DESK NEW REQUIREMENT
      app.get("/api/v1/get_Department_Help_Desk", helpDeskController.get_Department_newhelp_desk);
      app.get('/api/v1/category_code', helpDeskController.get_Categoey_code)
      app.post("/api/v1/create_ticket_category", helpDeskController.create_Category_master)
      app.get("/api/v1/all_category_master_data",helpDeskController.getAll_data_tikcet_category)
      app.put("/api/v1/updateTicketCategory/:id",helpDeskController.updateTicketCategory);
      app.delete("/api/v1/deletedTikcetCategorydata/:id",helpDeskController.deleteCHECKLIST);
      app.put("/api/v1/CHECKLISTStatus/:id",helpDeskController.CHECKLISTStatus);
      app.get('/api/v1/get_single_user_ticketcategory/:id', helpDeskController.gettheSingleRecordTicketcategory)



    // start the myticket and allocated api

    app.post('/api/v1/create_myticket_allocatedTicket', helpDeskController.createTicket)
    app.get("/api/v1/ticket_list",helpDeskController.get_all_ticket_list);
    app.post("/api/v1/create_allocated_ticket",helpDeskController.create_allocated_Ticket);
    app.post("/api/v1/update_ticket_status",helpDeskController.update_ticketstatus);
    app.delete('/api/v1/delete_Record_alloacted_ticket/:id', helpDeskController.deleteAllocatedticket)
    app.put("/api/v1/update_Record_alloacted_ticket/:id",helpDeskController.updateTicket);
    app.get("/api/v1/getAllocateddataById/:id",helpDeskController.getAllocateddataById)
    app.put("/api/v1/update_Allocated_ticket_status/:id",helpDeskController.checklistUpdateAlloactedTicket);
    app.post('/api/v1/employe-list-ticket',helpDeskController.employeData)
    app.get('/api/v1/getReportingmanger/:id',helpDeskController.getreportingManager )
    app.get('/api/v1/get_allocated_ticket_LIST', helpDeskController.get_allocated_ticketLIST)
    app.get('/api/v1/get_all_managers', helpDeskController.getAllManagers)

    //new api write the Get the status open or close My ticket
    app.get('/api/v1/getStatusWiseOpenOrCloseddata',helpDeskController.getStatusWiseOpenOrCloseddata)
}