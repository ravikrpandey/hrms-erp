const customerDetails = require("../controllers/customerController");
const customerDashboard = require("../controllers/customerDashboardController");
const customerCreditLimit = require("../controllers/customerCreditLimit");
const { upload } = require("../../../middleware/uploadDocs")
module.exports = app => {
    /////Get all lists
    app.get("/api/v1/getAllActiveIndustryType", customerDetails.getAllActiveIndustryType);
    app.get("/api/v1/getAllCustomersList/", customerDetails.getAllCustomersList);
    app.get("/api/v1/getAllCustomersWithContactList", customerDetails.getAllCustomersWithContactList);
    app.post("/api/v1/createCustomerAddressInfo", customerDetails.createCustomerAddressInfo);
    app.post("/api/v1/createCustomerBusinessDetails", customerDetails.createCustomerBusinessDetails);
    app.put("/api/v1/customers/approve", customerDetails.approveSelectedCustomers);

    // Get by id
    app.post("/api/v1/getCustomerProfileById/:customer_id", customerDetails.getCustomerProfileById);
    app.get("/api/v1/getCustomerContactById/:customer_id", customerDetails.getAllCustomerContactsById);
    app.get("/api/v1/getCustomerAddressInfoById/:customer_id", customerDetails.getCustomerAddressInfoById);
    app.get("/api/v1/getCustomerBusinessDetailsById/:customer_id", customerDetails.getCustomerBusinessDetailsById);
    app.get("/api/v1/getCustomerDocumentsById/:customer_id", customerDetails.getCustomerDocumentsById);
    app.get("/api/v1/dealerByCustomer/:customer_id", customerDetails.dealerByCustomer);
    app.get("/api/v1/getsShippingAddress", customerDetails.getsCustomerShippingAddress);

    /////Delete

    app.delete("/api/v1/deleteCustomerById/:customer_id", customerDetails.deleteCustomerById);

    ////Create
    app.post("/api/v1/createCustomerProfile", customerDetails.createCustomerProfile);
    app.post("/api/v1/createCustomerbilling", customerDetails.createCustomerbilling);
    app.post("/api/v1/createCustomerdelivery", customerDetails.createCustomerdelivery);
    app.post("/api/v1/createCustomerBank", customerDetails.createCustomerBank);
    app.post("/api/v1/add_customer_document", customerDetails.addCustomerDocument);
    // app.post("/api/v1/createCustomerAddressInfo", customerDetails.createCustomerAddressInfo);
    app.get("/api/v1/getAllCustomerData", customerDetails.getAllCustomerData);
    app.get("/api/v1/getAllCustomerBiling/:id", customerDetails.getAllCustomerBiling);
    app.get("/api/v1/getAllCustomerdelivery/:id", customerDetails.getAllCustomerdelivery);
    app.get("/api/v1/getAllCustomerBank/:id", customerDetails.getAllCustomerBank);
    app.get("/api/v1/getAllCustomerdoc/:id", customerDetails.getAllCustomerdoc);
    app.delete("/api/v1/customer/doc/:id", customerDetails.deleteCustomerDoc);
    app.delete("/api/v1/deleteAllCustomerData/:id", customerDetails.deleteAllCustomerData);
    app.get("/api/v1/getAllCustomerById/:id", customerDetails.getAllCustomerById);
    app.put("/api/v1/updateCustomerProfile/:id", customerDetails.updateCustomerProfile);
    app.put("/api/v1/updateCustomerbilling/:id", customerDetails.updateCustomerbilling);
    app.put("/api/v1/updateCustomerdelivery/:id", customerDetails.updateCustomerdelivery);
    app.put("/api/v1/updateCustomerBank/:id", customerDetails.updateCustomerBank);
    app.put("/api/v1/updateCustomerDocument/:id", customerDetails.updateCustomerDocument);
    app.get("/api/v1/getAllParentIsGroupYes", customerDetails.getAllParentIsGroupYes);
    app.get("/api/v1/getCompanyTreeViewList", customerDetails.getCompanyTreeViewList);
    app.get("/api/v1/getPriceList", customerDetails.getPriceList);
    app.post("/api/v1/customerAccoutRecieableDetail", customerDetails.customerAccoutRecieableDetail);
    app.get("/api/v1/customerAccoutRecieableDetailById", customerDetails.customerAccoutRecieableDetailById);

    //  Third Party APi

    app.get("/api/v1/registerForGSTPortal", customerDetails.registerForGSTPortal);
    app.patch("/api/v1/customerItemName/:customer_id", customerDetails.customerItemName)
    app.get("/api/v1/getItemListForCustomer", customerDetails.getItemListForCustomer);
    app.get("/api/v1/getCustomerItems", customerDetails.getCustomerItems);
    app.post("/api/v1/verifyOtpForGSTPortal", customerDetails.verifyOtpForGSTPortal);


    // Customer Credit Limit
    app.get("/api/v1/getPaymentTermMasterList", customerCreditLimit.getPaymentTermMasterList);
    app.post("/api/v1/createPaymentTermMaster", customerCreditLimit.createPaymentTermMaster);
    app.put("/api/v1/updatePaymentTermMaster/:id", customerCreditLimit.updatePaymentTermMaster);
    app.delete("/api/v1/deletePaymentTermMaster/:id", customerCreditLimit.deletePaymentTermMaster);
    app.get("/api/v1/getPaymentTermMasterById/:id", customerCreditLimit.getPaymentTermMasterById);
    app.post("/api/v1/createUpdate_customerCreditLimit", customerCreditLimit.createUpdate_customerCreditLimit);
    app.get("/api/v1/getCreditLimitListByCustomerId", customerCreditLimit.getCreditLimitListByCustomerId);
    app.post("/api/v1/advanceCustomerReciept", customerCreditLimit.advanceCustomerReciept);
    app.get("/api/v1/advanceCustomerRecieptById", customerCreditLimit.advanceCustomerRecieptById);
    app.post("/api/v1/suspenseCustomerAccount", customerCreditLimit.suspenseCustomerAccount);
    app.get("/api/v1/suspenseCustomerAccountList", customerCreditLimit.suspenseCustomerAccountList);
    app.get("/api/v1/suspenseCustomerAccountById", customerCreditLimit.suspenseCustomerAccountById);
    app.get("/api/v1/getCustomerBillingList", customerCreditLimit.getCustomerBillingList);


app.get('/vendor-aging-report', customerCreditLimit.getVendorAgingReport);
app.get('/vendor-aging-details/:vendor_id', customerCreditLimit.getVendorAgingDetails);
app.get('/vendor-aging-summary', customerCreditLimit.getVendorAgingSummary);
app.get('/payment-terms-list', customerCreditLimit.getPaymentTermsList);
app.get('/export-vendor-aging-report', customerCreditLimit.exportVendorAgingReport);
app.get('/api/v1/getCustomerAdvanceHistory', customerCreditLimit.getCustomerAdvanceHistory);
app.get('/api/v1/customer-wise-sales-booking', customerDashboard.customerWiseSalesBooking);







}