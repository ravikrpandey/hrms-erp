const vendorController = require("../controller/vendorController");

module.exports = app => {
    app.post("/api/v1/createVendor_Details",vendorController.createVendor_Details);
    app.get("/api/v1/get_all_vendor",vendorController.get_all_vendor);
    app.get("/api/v1/get_all_vendor_name",vendorController.get_all_vendor_name);
    app.get("/api/v1/get_by_vendorID/:id",vendorController.get_by_vendorID);
    app.get("/api/v1/get_vendor_bank_details",vendorController.get_vendor_bank_details);
    app.get("/api/v1/Code_create_cc/:id",vendorController.Code_create_cc);
    app.get("/api/v1/Code_create_sns/:id",vendorController.Code_create_sns);
    app.get("/api/v1/Code_create_pg/:id",vendorController.Code_create_pg);
    app.get("/api/v1/vendor_auto_code",vendorController.vendor_auto_code);
    app.delete("/api/v1/delete_vendor_basic/:id",vendorController.delete_vendor_basic);
    app.delete("/api/v1/delete_vendor_bank/:id",vendorController.delete_vendor_bank);
    app.delete("/api/v1/delete_vendor_doc/:id",vendorController.delete_vendor_doc);
    app.get("/api/v1/getAll_Vendor_type",vendorController.getAll_Vendor_type);
    app.get("/api/v1/getAll_Vendor_by_Type",vendorController.getAll_Vendor_by_Type);
    app.get("/api/v1/get_Chart_Of_Account_List_vendor/:id", vendorController.get_Chart_Of_Account_List_vendor);
    app.get("/api/v1/getVendorAddressInfoById/:id", vendorController.getVendorAddressInfoById);
    app.post("/api/v1/createVendorAddressInfo", vendorController.createVendorAddressInfo);

    // advance
    app.post("/api/v1/createVendorAdvanceAmount", vendorController.createVendorAdvanceAmount);
    app.get("/api/v1/advanceVendorPaymentById", vendorController.advanceVendorPaymentById);
    
}