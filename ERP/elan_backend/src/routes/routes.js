class Routes {
  initializeRoutes(app) {
    //////////////////////Routes will be listed here/////////////////////////
    //// here routes for shipping alert /////
    require("../../app/Purchase_AND_Inventory/shippingAlert/routes/shippingAlertRouter.js")(app);
    require("../../app/Finance_And_Accounting/Travel_Advance_Booking/router/travel_booking_route.js")(app);
    require("../../app/Finance_And_Accounting/Income_Statement/router/income_statement_routes.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Cost_Center/router/cost_center_routes.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Budget_Plan_Date/router/budget_plandate_routes.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Budget_Planning/router/budget_planning_routes.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Charts_Of_Accounts/router/chartOfAccountsRouter.js")(
      app
    );
    require("../../app/Finance_And_Accounting/PostingPeriod/routes/postingPeriodRoute.js")(
      app
    );
    require("../../app/Finance_And_Accounting/journal/router/financialAccount.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Bank/routes/bankRoute.js")(app);
    require("../../app/Finance_And_Accounting/BankAccount/routes/bankAccountRoute.js")(
      app
    );
    require("../../app/Finance_And_Accounting/cashBook/routes/cashBookRoute.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Trial_Balance/routes/trial_balance.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Dashboard/routes/dashboardRoutes.js")(
      app
    );
    // require('../../app/Finance_And_Accounting/fundTransfer/routes/fund_transfer_route.js')(app);
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/fundTransfer/routes/fund_transfer_route.js")
    );
    require("../../app/HRMS/Employee_Master/routes/user.routes")(app);
    require("../../app/HRMS/Employee_Master/routes/auth.routes")(app);
    require("../../app/HRMS/Employee_Master/routes/employmenttype.routes")(app);
    require("../../app/HRMS/Employee_Master/routes/maritalStatus.routes.js")(
      app
    );
    require("../../app/HRMS/RBAC/Role/routes/role.routes")(app);
    require("../../app/master/ItemCostCategory/routes/routes.js")(app);
    require("../../app/ESS/Help_Desk/routes/helpdesk.routes")(app);
    require("../../app/ESS/Complaint/routes/complaint.routes")(app);
    require("../../app/ESS/Leave/routes/leaveTypes.routes")(app);
    require("../../app/ESS/Leave/routes/leaveMaster.routes")(app);
    require("../../app/ESS/Resignation/routes/employeeResignation.routes")(app);
    require("../../app/HRMS/RBAC/role_back/role_master/routes/roleMaster.routes.js")(
      app
    );
    require("../../app/HRMS/RBAC/role_back/menu_master/routes/menuMaster.routes")(
      app
    );
    require("../../app/HRMS/RBAC/role_back/submenu_master/routes/submenuMaster.routes")(
      app
    );
    require("../../app/HRMS/RBAC/role_back/role_module_master/routes/role_module_master.routes")(
      app
    );
    require("../../app/HRMS/RBAC/role_back/role_menu_access/routes/roleMenuAccess.routes")(
      app
    );
    require("../../app/master/department/routes/department")(app);
    require("../../app/master/area/routes/areaRoute.js")(app);
    require("../../app/master/designation/routes/designation")(app);
    require("../../app/master/sales_request/router/sales_request_router")(app);
    require("../../app/master/new_region/router/new_region.router")(app);
    require("../../app/master/new_spa/router/new_spa.router")(app);
    require("../../app/master/traning_name/router/traning_name.router")(app);
    require("../../app/Company_Master/router/entity_mst_router.js")(app);
    require("../../app/master/location_mapping/pincode/routers/pincode_router")(
      app
    );
    require("../../app/master/location_mapping/country/routes/country.routes")(
      app
    );
    require("../../app/master/location_mapping/states/routers/states_router")(
      app
    );
    require("../../app/master/location_mapping/city/routers/city_router")(app);
    require("../../app/master/segment/router/segment.router")(app);
    require("../../app/master/Leave_Master/Leave_Master/routes/leave_master.routes")(
      app
    );
    require("../../app/master/Leave_Master/Attendance_Calendar/routes/attendance_calendar.routes")(
      app
    );
    require("../../app/master/Currency_Convert/routers/router.js")(app);
    require("../../app/config_master/configmaster_router")(app);
    require("../../app/HRMS/Employee_Master/routes/emp_sign_router.js")(app);
    require("../../app/master/branch/routes/BranchRoutes.js")(app);
    require("../../app/master/UOM/router/uom.router.js")(app);
    require("../../app/master/checklist/router/checklist.router.js")(app);
    require("../../app/master/location_mapping/states/routers/states_router.js")(
      app
    );
    require("../../app/master/Itemmaster/router/itemrouter.js")(app);
    require("../../app/master/servicecategory/router/servicesrouter.js")(app);
    require("../../app/master/servicemaster/router/servicemasterrouter.js")(
      app
    );
    require("../../app/Company_Master/router/entity_mst_router.js")(app);
    require("../../app/master/Financial_Year/router/financialRouter.js")(app);
    require("../../app/inventory_module_management/router/InventoryRouter.js")(
      app
    );
    require("../../app/master/area/routes/areaRoute.js")(app);
    require("../../app/stock_management/router/storeRouter.js")(app);
    require("../../app/master/Payroll/routes/employee_contribution.routes.js")(
      app
    );
    require("../../app/master/hsn-sac/routes/hsnSacRoutes.js")(app);
    require("../../app/master/scheme_master/router/schemeRoute.js")(app);

    // require("../../app/inventory_management/router/inv_store-router.js")(app);

    require("../../app/master/area/routes/areaRoute.js")(app);
    require("../../app/master/Municipality/router/municipalityRouter.js")(app);
    require("../../app/master/Contract/Router/ContractRouter.js")(app);
    require("../../app/master/assetcategory/router/assetrouter.js")(app);
    require("../../app/master/reason/router/reasonRouter.js")(app);
    require("../../app/master/sales_reason_master/router/sales_reason_routes.js")(
      app
    );
    require("../../app/ESS/job_request/routes/jobRoutes.js")(app);
    require("../../app/ESS/workFlow/routes/workFolwRoutes.js")(app);
    require("../../app/master/Region/router/regionRoute.js")(app);
    require("../../app/master/Budget_Category/router/budget_Category_Route.js")(
      app
    );
    require("../../app/master/Expense_Type/router/expenseRoute.js")(app);
    require("../../app/master/Need_Type/router/needRoute.js")(app);
    require("../../app/ESS/Travel_Request/Routes/travel_Request_Router.js")(
      app
    );
    require("../../app/Documents/router/upload_doc_routes.js")(app);
    require("../../app/Recruitment/Job_description/router/job_descripition.js")(
      app
    );
    require("../../app/ESS/Travel_Request/Routes/travel_Request_Router.js")(
      app
    );
    require("../../app/master/Allowance/router/allowanceRouter.js")(app);
    require("../../app/Documents/router/upload_doc_routes.js")(app);
    require("../../app/Recruitment/Job_description/router/job_descripition.js")(
      app
    );
    require("../../app/vendor/router/vendorRouter.js")(app);
    require("../../app/Business_Intelligence/forecast_revenue/router/forcast_revenue_routes.js")(
      app
    );
    require("../../app/Recruitment/Candidate_Profile/router/candidate_profile_routes.js")(
      app
    );
    require("../../app/Recruitment/dashboard/router/dashboardRoutes.js")(app);
    require("../../app/Recruitment/Reports/router/job_reports.js")(app);

    require("../../app/Purchase_AND_Inventory/purchase_request/router/purchaseRequestRouter.js")(
      app
    );


    require("../../app/Performance_Management/Yearly_Assessment_Setup/router/yearlyAssessmentRouter.js")(
      app
    );
    require("../../app/master/Shift/router/shiftrouter.js")(app);
    require("../../app/master/Leave_Master/Holiday/routes/holiday.route.js")(
      app
    );
    require("../../app/Performance_Management/Yearly_Assessment_Setup/router/yearlyAssessmentRouter.js")(
      app
    );
    require("../../app/ESS/Self_Assessment/router/self_AssessmentRouter.js")(
      app
    );
    require("../../app/ESS//Leave_Apply/routes/routes.js")(app);
    require("../../app/Recruitment/BGV/router/bgv_routes.js")(app);
    require("../../app/Recruitment/Candidate_onboarding/router/candidate_onboarding_routes.js")(
      app
    );
    require("../../app/Dashboard/routes/celebration_routes.js")(app);
    require("../../app/Purchase_AND_Inventory/purchase_order/router/purchaseOrderRouter.js")(
      app
    );
    require("../../app/Purchase_AND_Inventory/Grn/router/grnRouter.js")(app);
    require("../../app/Purchase_AND_Inventory/purchase_return/router/purchaseReturnRouter.js")(app);
    require("../../app/Purchase_AND_Inventory/RFP/router/rfpRouter.js")(app);
    require("../../app/Performance_Assessment/routes/all_assessment_route.js")(
      app
    );
    require("../../app/ESS/Colleague_Review/routes/colleague_review_route.js")(
      app
    );
    require("../../app/ESS/TimeSheet/routers/timesheetRoutes.js")(app);
    // -------------------------------------------
    require("../../app/master/product/router/productrouter.js")(app);
    require("../../app/master/plant/router/plantrouter.js")(app);
    require("../../app/master/productcategory/routes/category.js")(app);
    require("../../app/master/workstation/router/workstationrouter.js")(app);
    require("../../app/production/AddProduction/router/productionRouter.js")(
      app
    );
    require("../../app/master/quality/router/qualityrouter.js")(app);
    app.use("/", require("../../app/production/BOM/router/bomrouter.js"));
    app.use(
      "/",
      require("../../app/Warehouse/Dispatched/routes/dispatchedRoutes.js")
    );


    require("../../app/Warehouse/DeliveryManagement/routes/deliveryRoutes.js")(
      app
    );
    require("../../app/CRM/Dashboard/routes/dashboardRoutes.js")(app);

    /*************** Payroll routes Start from here ***************/
    require("../../app/Payroll/EPF/routes/epf_routes.js")(app);
    require("../../app/Payroll/ESI/routes/esi_route.js")(app);
    require("../../app/Payroll/Statutory/routes/statutory_route.js")(app);
    require("../../app/Payroll/SalaryComponents/Earnings/routes/earning_route")(
      app
    );
    require("../../app/Payroll/SalaryComponents/Reimbursement/routes/reimbursement_route.js")(
      app
    );
    require("../../app/Payroll/SalaryComponents/Deduction/routes/deduction_route")(
      app
    );
    require("../../app/Payroll/SalaryTemplate/routes/salary_template_route.js")(
      app
    );
    require("../../app/Payroll/Salary_Process_Details/router/payroll_routes.js")(
      app
    );
    require("../../app/Payroll/TaxSlab/routes/tax_route.js")(app);
    require("../../app/Payroll/DeclarationForm/routes/declarationForm_route.js")(
      app
    );

    require("../../app/master/sourceMaster/router/sourcerouter.js")(app);

    app.use(
      "/",
      require("../../app/production/SalesOrder/router/salesOrderRouter.js")
    );
    // -------------------------------------------

    app.use(
      "/",
      require("../../app/master/customerType/router/customerTypeRoutes.js.js")
    );
    app.use(
      "/",
      require("../../app/SalesManagement/superUser/routes/superUserRoutes.js")
    );
    app.use(
      "/",
      require("../../app/SalesManagement/deliveryOrders/routes/deliveryOrdersRoutes.js")
    );
    app.use(
      "/",
      require("../../app/SalesManagement/proforma/routes/proformaRoutes.js")
    );
    app.use(
      "/",
      require("../../app/SalesManagement/salesInvoice/routes/salesInvoiceRoutes.js")
    );
    app.use(
      "/",
      require("../../app/SalesManagement/dashboard/router/salesRoutes.js")
    );
    require("../../app/master/uses/routes/usesRoutes.js")(app);

    // ---------------------CRM------------------
    app.use("/", require("../../app/CRM/AddDO/routes/addDoRoute.js"));
    app.use("/", require("../../app/CRM/AssignUser/routes/assignUserRoute.js"));
    app.use("/", require("../../app/CRM/CreateLead/routes/createLeadRoute"));
    app.use(
      "/",
      require("../../app/CRM/CreateProposal/routes/createProposalRoutes.js")
    );
    require("../../app/CRM/DeliveryChalaan/routes/deliveryChallanRoutes.js")(
      app
    );
    app.use("/", require("../../app/CRM/DealClosed/routes/dealCloseRoute.js"));
    app.use(
      "/",
      require("../.././app/CRM/InvoiceProposal/routes/invoiceRoute.js")
    );
    app.use(
      "/",
      require("../../app/CRM/LeadFormSetup/routes/leadFormSetupRoute")
    );
    app.use(
      "/",
      require("../../app/CRM/LeadSummary/routes/leadSummaryRoutes.js")
    );
    app.use("/", require("../../app/CRM/MasterData/routes/masterRoute"));
    app.use(
      "/",
      require("../../app/CRM/ProposalPayment/routes/proposalPaymentRoute.js")
    );
    // sales invoice/////////////
    app.use(
      "/",
      require("../../app/CRM/salesInvoice/routes/salesInvoiceRoutes.js")
    );

    ///issue Master
    require("../../app/master/Issue_Type/router/issuerouter.js")(app);
    // ****lms route//

    ///issue Master
    require("../../app/master/Issue_Type/router/issuerouter.js")(app);
    require("../../app/master/voucher_master/routes/voucher_router.js")(app);
    require("../../app/master/PaymentAdiceVoucher/routes/PaymentAdviceRoute.js")(
      app
    );
    require("../../app/master/bankRecieptVoucher/routes/bankRecieptRoutes.js")(
      app
    );
    require("../../app/master/bankpaymentVoucher/routes/bankPaymentVoucherRoute.js")(
      app
    );
    // ****lms route//
    require("../../app/LMS/cource-category/router/index.js")(app);
    require("../../app/LMS/course/router/course.js")(app);
    //

    require("../../app/Service_CRM/RegisterComplain/routes/registerComplainRoute.js")(
      app
    );
    require("../../app/master/servicecenter/router/servicecenterrouter.js")(
      app
    );
    //breakdown management
    require("../../app/breakdown_Management/router/breakdownrouter.js")(app);

    //maintenance
    require("../../app/Maintenance_Management/router/maintenancerouter.js")(
      app
    );

    //master maintenance
    require("../../app/master/maintenance-master/router/maintenanceCheckrouter.js")(
      app
    );

    //vendor panel
    require("../../app/vendor/requirement/router/requirementrouter.js")(app);

    ///compaint type
    require("../../app/master/Complain_Type/router/complain_typerouter.js")(
      app
    );

    //master job
    require("../../app/master/Master_JOB/router/master_job_router.js")(app);
    ///compaint type
    require("../../app/master/Complain_Type/router/complain_typerouter.js")(
      app
    );

    // transport Management
    //........................
    ///vehical category...............
    require("../../app/Transport Management/Vehicle Category/router/vehical_categoryrouter.js")(
      app
    );
    //...............vehical Master
    require("../../app/Transport Management/Vehicle Master/router/vehical_masterrouter.js")(
      app
    );
    //.............vehicle Driver

    require("../../app/Transport Management/Driver Master/router/driver_masterrouter.js")(
      app
    );

    require("../../app/master/SubCategory/router/subrouter.js")(app);

    require("../../app/master/Customer Category/router/customer_category_router.js")(
      app
    );
    require("../../app/master/Customer_sub_category/router/customer_sub_category.js")(
      app
    );
    require("../../app/master/Customer_Micro_Category/router/customer_micro_router.js")(
      app
    );

    require("../../app/master/Customer/routes/customerRoute.js")(app);
    require("../../app/Purchase_AND_Inventory/Invoice/router/InvoiceRouter.js")(
      app
    );

    require("../../app/master/document_type/routes/documenttype.js")(app);
    require("../../app/Warehouse/WarehouseManagement/routes/warehouseManagementRoute.js")(
      app
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/FinanceProfitCenter/routes/financeProfitCenterRoute.js")
    );
    require("../../app/master/scheme_master/router/schemeRoute.js")(app);
    require("../../app/master/Price_master/router/priceMasterRoute.js")(app);
    require("../../app/master/LevelMaster/routes/levelType.js")(app);
    require("../../app/inventory_module_management/router/InventoryRouter_new.js")(
      app
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/PaymentAdvice/routes/paymentAdviceRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/BankReciept/routes/bankRecieptRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/BankPayment/routes/bankPaymentRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/SalesJournal/routes/salesJournalRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/PurchaseJournal/routes/purchaseJournalRoute.js")
    );
    app.use(
      "/",
      require("../../app/Warehouse/VehiclePlanning/router/vehicle_planning_routes")
    );
    require("../../app/Purchase_AND_Inventory/payment/router/paymentRouter.js")(
      app
    );
    require("../../app/Expenses/travel_expense/routes/expense_request_routes.js")(
      app
    );
    require("../../app/Finance_And_Accounting/Direct-Invoice/router/direct_invoice_routes.js")(
      app
    );
    require("../../app/Transport Management/Transport_Master/router/transport_router.js")(
      app
    );
    require("../../app/HRMS/RBAC/role_back/menu-management/menuManagement.routes.js")(
      app
    );
    require("../../app/HRMS/RBAC/rbac.module.permissions/routes.js")(app);
    require("../../app/master/trip_expense/router/tripExpenseMasterRouter.js")(
      app
    );
    require("../../app/Transport Management/Transport Request/router/transport_management_router.js")(
      app
    );
    require("../../app/Transport Management/Schedule Trip/router/scheduleTripRouter.js")(
      app
    );
    require("../../app/master/PerposalType/router/PerposalTypeRouter.js")(app);
    require("../../app/master/CustomerApproval/router/CustomerApproval.js")(
      app
    );
    require("../../app/master/CreditLimit/router/CreditLimit.js")(app);
    require("../../app/master/SanctionCreditLimit/router/SanctionCreditLimit.js")(
      app
    );
    require("../../app/master/EmployeeMapWithLevel/routes/EmployeeMapLevel.js")(
      app
    );
    require("../../app/master/QuotatioApproval/router/QuotationApproval.js")(
      app
    );
    require("../../app/master/additional-charge/router/additionalRouter.js")(
      app
    );
    require("../../app/master/gst-gl-account-mapping/router/gstGlAccountMappingRouter.js")(
      app
    );
    require("../common/common.routes.js")(app);
    require("../../app/master/expectedDeliveryDay/routes/expectedDaysRoutes.js")(
      app
    );
    app.use("/", require("../../app/master/TDS/routes/TDSRoutes.js"));
    require("../../app/master/travel-master/routes/travel-type.routes.js")(app);
    require("../../app/master/zone-type/routes/zoneType.router.js")(app);
    require("../../app/master/accessories_master/routes/accessories_router.js")(
      app
    );
    require("../../app/master/branding_master/routes/branding_router.js")(app);
    app.use(
      "/",
      require("../../app/Warehouse/WarehouseList/routes/warehouseRoute.js")
    );
    app.use(
      "/",
      require("../../app/Warehouse_Module/routes/warehouse_route.js")
    );
    app.use(
      "/",
      require("../../app/master/MasterVoucherMain/routes/voucherMainRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/CashReciept/routes/cashRecieptRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/cashPayment/routes/cashPaymentRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/vendorRecordPayment/routes/vendorRecordPaymentRoute.js")
    );
    app.use(
      "/",
      require("../../app/Finance_And_Accounting/customerRecordPayment/routes/customerRecordPaymentRoute.js")
    );
    require("../../app/master/basket/router/basketRouter.js")(app);
    require("../../app/master/financial_transaction_integration/router/financial.js")(
      app
    );
    require("../../app/Transport Management/router/allrouter.js")(app);
    require("../../app/inventory_management/router/inventory-router.js")(app);
    // Third Party Module Routes
    require("../app/third-party/routes.js")(app);

    require("../../app/Asset_Management/Depreciation/router/depreciation.routes.js")(app);
    require("../../app/Asset_Management/company_depreciationMaster/routes/company_depreciation_masterRoutes.js")(app)
    require("../../app/Asset Maintenance/Maintenance/router/asset_maintenanceRouter.js")(app)
    require("../../app/Asset Warranty/Asset Warranty List/routers/asset_warrantyListRouter.js")(app)
    require("../../app/Direct_Asset/router/assetRoutes.js")(app);
    app.use("/", require("../../app/Finance_And_Accounting/TransportVoucher/Route/TransportRoute.js"))

    app.use("/", require('../../app/Finance_And_Accounting/serviceVoucher/routes/serviceVoucherRoutes.js'))
    app.use("/",require("../../app/master/costProfitCenterType/routes/costProfitTypeRoute.js"));
    app.use("/",require("../../app/Finance_And_Accounting/paymentProgram/routes/paymentProgramRoute.js"));
    require("../../app/master/purchase-masters/routes.js")(app);
    // app.use("/", require("../../app/Finance_And_Accounting/bankClearence/routes/bankClearenceRoute.js"));
    app.use("/", require("../../app/SalesManagement/salesReturn/routes/salesReturnRoutes.js"));
    app.use("/", require("../../app/Finance_And_Accounting/bankClearence/routes/bankClearenceRoute.js"))
    app.use("/", require("../../app/Finance_And_Accounting/CreditDebitNote/routes/creditDebitNoteRoute.js"))
    app.use("/", require("../../app/Finance_And_Accounting/RCMReports/routes/RCMReportRoute.js"))
    require("../../app/sales-target-achievement/routes/allroutes.js")(app);
    app.use("/", require("../../app/Finance_And_Accounting/adjustmentJournal/router/adjustmentRouter.js"))
    app.use("/", require("../../app/Finance_And_Accounting/GSTReport/routes/gstReportRoutes.js"))
    app.use("/", require("../../app/Finance_And_Accounting/PurchaseServiceVoucher/routes/purchaseServiceRoute.js"))
    app.use("/", require("../../app/master/TransportChargeMaster/routes/transportChargeRoute.js"))
    require("../../app/master/BomKitMaster/routes/bomkitrouter.js")(app);
    // require("../../app/master/TransportChargeMaster/routes/transportChargeRoute.js")(app);
    app.use("/", require("../../app/Warehouse/Einvoice/routes/EinvoiceRoute.js"))
  }
}

module.exports = new Routes();
