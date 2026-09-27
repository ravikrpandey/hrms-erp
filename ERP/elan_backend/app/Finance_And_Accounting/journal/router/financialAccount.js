
const financalBookJournalController = require('../controller/finacial_account_journal_controller');
const journalautoReapeatController = require('../controller/journal_auto_repeat_controller');
const { upload }  = require("../../../middleware/uploadDocs");
module.exports = app => {   
    app.post("/api/v1/addFinancialAccountJournal", upload.array('images',10), financalBookJournalController.addFinancialAccountJournal);
    app.get("/api/v1/generate_journal_number", financalBookJournalController.generate_journal_number);
    app.get("/api/v1/getsFinancialAccountJournal", financalBookJournalController.getsFinancialAccountJournal);
    app.put("/api/v1/deleteFinancialAccountJournal/:id", financalBookJournalController.deleteFinancialAccountJournal);
    app.put("/api/v1/updateFinancialAccountJournal/:id", financalBookJournalController.updateFinancialAccountJournal);
    app.post("/api/v1/filterJournalDetails/:entity_id",financalBookJournalController.filterJournalDetails);
    app.post("/api/v1/filterTradePayableJournalDetails/:entity_id",financalBookJournalController.filterTradePayableJournalDetails);
    
    app.get("/api/v1/get_Scheduled_Journals", financalBookJournalController.getScheduledJournals);
    app.get("/api/v1/get_Scheduled_Journals_details", financalBookJournalController.getScheduledJournalDetails);
    
       app.post("/api/v1/filterVendorLedgerReport/:entity_id", financalBookJournalController.vendorLedgerReportByVendorId);
    // app.post("/api/v1/getCustomerLedgerListByCustomerId/:entity_id",financalBookJournalController.getCustomerLedgerListByCustomerId);



    app.post("/api/v1/createDraftFrequency",journalautoReapeatController.createJournalRepeat);
    // app.post("/api/v1/addFinancialAccountJournal", journalautoReapeatController.autoPostFinancialAccountJournal);
    app.get("/api/v1/delete_Journal_Scheduling/:id", journalautoReapeatController.deleteJournalScheduling);
    // app.post("/api/v1/quickJournalEntry", financalBookuickJournalController.addFinancialAccountQuikEntry);
//     app.get("/api/v1/getAll_Active_Cost_Center", financalBookJournalController.getAll_Active_Cost_Center);
//     app.get("/api/v1/getAll_Cost_Center", financalBookJournalController.getAll_Cost_Center);
//     app.get("/api/v1/get_Cost_Center_ById/:id", financalBookJournalController.get_Cost_Center_ById);
//     app.put("/api/v1/update_cost_center/:id", financalBookJournalController.update_cost_center);
//     app.put("/api/v1/update_cost_center_status/:id", financalBookJournalController.update_cost_center_status);
//     app.delete("/api/v1/delete_Cost_Center_ById/:id", financalBookJournalController.delete_Cost_Center_ById);
//     app.get("/api/v1/get_all_cost/:dept_id", financalBookJournalController.get_all_cost);
app.get("/api/v1/getAssetByCustomerById/:customer_id", financalBookJournalController.getAssetByCustomerById)
app.get("/api/v1/getAssetByVendorById/:vendor_id", financalBookJournalController.getAssetByVendorById)
};   


// generate_journal_number

// module.exports = app => {   
//     app.post("/api/v1/addFinancialAccountJournal", financalBookJournalController.addFinancialAccountJournal);
//     app.put("/api/v1/deleteFinancialAccountJournal/:id", financalBookJournalController.deleteFinancialAccountJournal);
//     app.get("/api/v1/generate_journal_number", financalBookJournalController.generate_journal_number);
//     app.get("/api/v1/getsFinancialAccountJournal", financalBookJournalController.getsFinancialAccountJournal);
//     app.put("/api/v1/updateFinancialAccountJournal/:id", financalBookJournalController.updateFinancialAccountJournal);
//     app.post("/api/v1/filterJournalDetails", financalBookJournalController.filterJournalDetails);
    
//     app.get("/api/v1/get_Charts_Of_Account_Details_By_Id/:id", financalBookJournalController.get_Charts_Of_Account_Details_By_Id);
//     app.get("/api/v1/delete_Chart_Of_Accounts/:id", financalBookJournalController.delete_Chart_Of_Accounts);
//     app.get("/api/v1/get_Scheduled_Journals", financalBookJournalController.getScheduledJournals);
//     app.get("/api/v1/get_Scheduled_Journals_details", financalBookJournalController.getScheduledJournalDetails);
    
    
//     app.post("/api/v1/createDraftFrequency", journalautoReapeatController.createJournalRepeat);
//     app.get("/api/v1/delete_Journal_Scheduling/:id", journalautoReapeatController.deleteJournalScheduling);
// };   
