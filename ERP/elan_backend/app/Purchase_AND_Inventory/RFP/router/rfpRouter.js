const rfpController = require("../controller/rfpController");
const negotiationController = require("../controller/negotiation.controller");
const { upload } = require("../../../middleware/item_master");

module.exports = app => {
    /////////////////rfp///////////////////////////////////////
    app.get("/api/v1/get_Approved_pr", rfpController.get_Approved_Pr);
    app.get("/api/v1/create_rfp_number", rfpController.generate_RfP_Number);
    app.get("/api/v1/get_All_Vendor_Management", rfpController.get_All_Vendor_Management);
    app.post("/api/v1/getAll_Product/:id", rfpController.getAll_Product);
    app.get("/api/v1/getAll_Product_ById/:id", rfpController.getAll_Product_ByID);
    app.post("/api/v1/get_ById_RFP", rfpController.get_ById_RFP);
    app.post("/api/v1/GetAll_liveRFP", rfpController.GetAll_liveRFP);
    app.get("/api/v1/get_ById_PR", rfpController.get_ById_PR);
    app.put("/api/v1/sendRFP", rfpController.sendRFP);
    app.post("/api/v1/GetAll_CloseRFP", rfpController.GetAll_CloseRFP);
    app.put("/api/v1/sendRFPforService", upload.single("file"), rfpController.sendRFP_for_Service);
    app.put("/api/v1/update_vendorData/:id", upload.fields([{ name: 'vendor_uploaded_document', maxCount: 1 }]), rfpController.update_vendorData);
    app.put("/api/v1/update_vendorDataforService/:id", upload.fields([{ name: 'vendor_uploaded_document', maxCount: 1 }]), rfpController.update_vendorData_for_service);
    app.get("/api/v1/getVendor_replyData", rfpController.getVendor_replyData)
    app.get("/api/v1/getVendor_replyDataforService", rfpController.getVendor_replyData_for_service)
    app.post("/api/v1/stopliverfp/:id", rfpController.stop_live_rfp);
    app.get("/api/v1/getItemByLowestPrice/:id", rfpController.getItemByLowestPrice);

    // ///////////////////////// vendor Mangement //////////////////////////////////
    app.post("/api/v1/get_sended_approval_data", rfpController.get_sended_approval_data);
    app.post("/api/v1/GetAll_Initiate_Nego", negotiationController.GetAll_Initiate_Nego);
    app.post("/api/v1/GetAll_liveNego", negotiationController.GetAll_live_Nego);
    app.get("/api/v1/generate_negotiation_id", negotiationController.generate_Negotiation_id);
    app.post("/api/v1/sendMailForNegotiation/:id", negotiationController.sendMailForNegotiation);
    app.get("/api/v1/getAllVendorsForNegotiation/:id", negotiationController.getAllVendorsForNegotiation);
    app.post("/api/v1/stop_live_negotiation/:id", negotiationController.stop_live_negotiation);
    app.post("/api/v1/GetAll_CloseNego", negotiationController.GetAll_CloseNego);
    app.post("/api/v1/getAllNegoData", negotiationController.getAllNegoData);
    app.get("/api/v1/generate_Nego_Approval_Id", negotiationController.generate_Nego_Approval_Id);
    app.get("/api/v1/getAllDataForApprovalNegotiation/:id", negotiationController.getAllDataForApprovalNegotiation);
    app.get("/api/v1/getVendrosDataById/:id", negotiationController.getVendrosDataById);
    app.post("/api/v1/updateVendorsBid/:id", negotiationController.updateVendorsBid);
    app.get("/api/v1/getItemByLowestPriceForNego/:id", negotiationController.getItemByLowestPriceForNego);
    app.post("/api/v1/get_ById_RFP_Renego_Vendors", rfpController.get_ById_RFP_Renego_Vendors);
    app.post("/api/v1/sendMailForRenegotiation/:id", rfpController.sendMailForRenegotiation);
    app.get("/api/v1/getVendrosDataByIdforRenegoItem/:id", rfpController.getVendrosDataByIdforRenegoItem);
    app.post("/api/v1/sendMailForNegotiation_service/:id", rfpController.sendMailForNegotiation_service);
    app.get("/api/v1/getVendor_replyData_for_service_Negotiation/:id", rfpController.getVendor_replyData_for_service_Negotiation);
    app.post("/api/v1/updateVendorsBidForService/:id", rfpController.updateVendorsBidForService);
    app.post("/api/v1/sendMailForRenegotiation_service/:id", rfpController.sendMailForRenegotiation_service);
    app.get("/api/v1/getVendor_replyData_for_service_ReNegotiation/:id", rfpController.getVendor_replyData_for_service_ReNegotiation);
    app.put("/api/v1/update_endDate_for_negotiation/:id", negotiationController.update_endDate_for_negotiation);
    app.put("/api/v1/update_endDate/:id", rfpController.update_endDate);
    app.post("/api/v1/getAllRfpList", rfpController.getAllRfpList);
    app.post("/api/v1/get_sended_approval_data/:id", rfpController.get_sended_approval_data);
    app.get("/api/v1/generate_Rfp_Approval_Id", rfpController.generate_Rfp_Approval_Id);
    app.get("/api/v1/getAllDataForApprovalRFP/:id", rfpController.getAllDataForApprovalRFP);
    app.post("/api/v1/Create_Approval_Data_For_RFP", rfpController.Create_Approval_Data_For_RFP);
    app.post("/api/v1/getAll_Levels_List/:id", rfpController.getAll_Levels_List);
    app.post("/api/v1/get_levels_to_be_approved_rfp/:id", rfpController.get_levels_to_be_approved_rfp);
    app.get("/api/v1/get_By_Id_Approval_Data/:id", rfpController.get_By_Id_Approval_Data);
    app.get("/api/v1/getVendorQuotationById/:id", rfpController.getVendorQuotationById);
    app.post("/api/v1/approve_levels_rfp/:id", rfpController.approve_levels_rfp);
    app.post("/api/v1/get_Approved_Approvals_rfp/:id", rfpController.get_Approved_Approvals_rfp);
    app.post("/api/v1/get_Rejected_Approvals_rfp/:id", rfpController.get_Rejected_Approvals_rfp);
    app.get("/api/v1/getRFPNegoQuotationDetails/:id", rfpController.getRFPNegoQuotationDetails);
    app.get("/api/v1/getAllRfpListForVendor", rfpController.getAllRfpListForVendor);
    app.get("/api/v1/getAllNegotiationListForVendor", rfpController.getAllNegotiationListForVendor);
}