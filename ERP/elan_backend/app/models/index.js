const { FOREIGNKEYS } = require("sequelize/lib/query-types");
const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.port,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../HRMS/Employee_Master/models/user.model.js")(
  sequelize,
  Sequelize,
);
db.user_sessions = require("../HRMS/Employee_Master/models/user_sessions.js")(
  sequelize,
  Sequelize,
);
db.user_activity_logs =
  require("../HRMS/Employee_Master/models/user_activity_logs.js")(
    sequelize,
    Sequelize,
  );
db.user_login = require("../HRMS/Employee_Master/models/user_login_model.js")(
  sequelize,
  Sequelize,
);
db.user_entity = require("../HRMS/Employee_Master/models/user_entity_model.js")(
  sequelize,
  Sequelize,
);
db.uom = require("../master/UOM/model/uom.model.js")(sequelize, Sequelize);
db.role = require("../HRMS/RBAC/Role/models/role.model.js")(
  sequelize,
  Sequelize,
);
db.employmenttype =
  require("../HRMS/Employee_Master/models/employment.model.js")(
    sequelize,
    Sequelize,
  );
db.states =
  require("../master/location_mapping/states/models/states_models.js")(
    sequelize,
    Sequelize,
  );
db.maritalStatus =
  require("../HRMS/Employee_Master/models/maritalStatus.model.js")(
    sequelize,
    Sequelize,
  );
db.helpDesk = require("../ESS/Help_Desk/models/helpdesk.model.js")(
  sequelize,
  Sequelize,
);
db.complaint = require("../ESS/Complaint/models/complaint.model.js")(
  sequelize,
  Sequelize,
);
db.employeeResignation =
  require("../ESS/Resignation/models/employeeResignation.model.js")(
    sequelize,
    Sequelize,
  );
db.Resignation_approval =
  require("../ESS/Resignation/models/resignationApproval.js")(
    sequelize,
    Sequelize,
  );
db.All_Resignation_review = require("../ESS/Resignation/models/review.js")(
  sequelize,
  Sequelize,
);
db.All_Resignation_approval =
  require("../ESS/Resignation/models/allResignationApproval.js")(
    sequelize,
    Sequelize,
  );
db.documentMaster =
  require("../master/document_master/models/documentmaster.model.js")(
    sequelize,
    Sequelize,
  );
db.countryss =
  require("../master/location_mapping/country/model/country.model.js")(
    sequelize,
    Sequelize,
  );
db.country_codes =
  require("../master/location_mapping/country/model/country_code_model.js")(
    sequelize,
    Sequelize,
  );
db.city = require("../master/location_mapping/city/models/city_models.js")(
  sequelize,
  Sequelize,
);
db.pincode =
  require("../master/location_mapping/pincode/models/pincode_models.js")(
    sequelize,
    Sequelize,
  );
db.sales_request =
  require("../master/sales_request/model/sales_request_model.js")(
    sequelize,
    Sequelize,
  );
db.notification_sales_request =
  require("../master/sales_request/model/notification_sales_model.js")(
    sequelize,
    Sequelize,
  );
db.customer_category =
  require("../master/Customer Category/model/customer_category_model.js")(
    sequelize,
    Sequelize,
  );
db.role_master =
  require("../HRMS/RBAC/role_back/role_master/model/roleMaster.model.js")(
    sequelize,
    Sequelize,
  );
db.menu_master =
  require("../HRMS/RBAC/role_back/menu_master/model/menuMaster.model.js")(
    sequelize,
    Sequelize,
  );
db.role_menu_access =
  require("../HRMS/RBAC/role_back/role_menu_access/model/roleMenuAccess.model.js")(
    sequelize,
    Sequelize,
  );
db.role_module_master =
  require("../HRMS/RBAC/role_back/role_module_master/model/role_module_master.model.js")(
    sequelize,
    Sequelize,
  );
db.submenu_master =
  require("../HRMS/RBAC/role_back/submenu_master/model/submenuMaster.model.js")(
    sequelize,
    Sequelize,
  );
db.area = require("../master/area/model/areaModel.js")(sequelize, Sequelize);
db.segment = require("../master/segment/model/segment.model.js")(
  sequelize,
  Sequelize,
);
db.new_certificate_type =
  require("../master/certificate_type/model/certificate_type.model.js")(
    sequelize,
    Sequelize,
  );
db.new_region = require("../master/new_region/model/new_region.model.js")(
  sequelize,
  Sequelize,
);
db.new_category_master =
  require("../master/new_category_master/model/new_category_master.model.js")(
    sequelize,
    Sequelize,
  );
db.new_spa = require("../master/new_spa/model/new_spa.model.js")(
  sequelize,
  Sequelize,
);
db.traning_name = require("../master/traning_name/model/traning_name.model.js")(
  sequelize,
  Sequelize,
);
db.leavePolicyDetail =
  require("../master/Leave_Master/Leave_Master/model/leave_master.model.js")(
    sequelize,
    Sequelize,
  );
db.attendanceCalendarDetail =
  require("../master/Leave_Master/Attendance_Calendar/model/attendance_calendar.model.js")(
    sequelize,
    Sequelize,
  );
db.currency_convert = require("../master/Currency_Convert/models/model.js")(
  sequelize,
  Sequelize,
);
db.screenOnOffDetail =
  require("../master/Leave_Master/Attendance_Calendar/model/screen_on_off.model.js")(
    sequelize,
    Sequelize,
  );
db.read_write_access =
  require("../HRMS/RBAC/role_back/role_menu_access/model/read_write_access.js")(
    sequelize,
    Sequelize,
  );
db.entityMaster = require("../Company_Master/models/entity_mst_model.js")(
  sequelize,
  Sequelize,
);
db.otpVerificationEntity = require("../Company_Master/models/OtpVerificationEntity.js")(
  sequelize,
  Sequelize,
);
db.entityManagement = require("../Company_Master/models/managementDetails.js")(
  sequelize,
  Sequelize,
);
db.entityStake = require("../Company_Master/models/entity_stakeholder.js")(
  sequelize,
  Sequelize,
);
db.auditor_booking =
  require("../master/sales_request/model/auditor_booking_model.js")(
    sequelize,
    Sequelize,
  );
db.emp_sign_data = require("../HRMS/Employee_Master/models/emp_sign_model.js")(
  sequelize,
  Sequelize,
);
db.financial_year = require("../master/Financial_Year/model/financialModel.js")(
  sequelize,
  Sequelize,
);
db.poPayment = require("../Purchase_AND_Inventory/Invoice/models/poPayment.js")(
  sequelize,
  Sequelize,
);
db.PaymentModel = require("../Purchase_AND_Inventory/payment/model/payment.js")(
  sequelize,
  Sequelize,
);
db.proposal_branding = require("../CRM/CreateProposal/model/proposal_branding")(
  sequelize,
  Sequelize,
);
db.proposal_customisation_data =
  require("../CRM/CreateProposal/model/proposal_customisation_data.js")(
    sequelize,
    Sequelize,
  );
db.proposal_customisation_type =
  require("../CRM/CreateProposal/model/proposal_customisation_type.js")(
    sequelize,
    Sequelize,
  );
db.createAdditionalPostingPeriodMonth =
  require("../Finance_And_Accounting/PostingPeriod/model/createPostingPeriodAdditionalMonths.js")(
    sequelize,
    Sequelize,
  );
db.tbl_branch = require("../master/branch/models/BranchModels.js")(
  sequelize,
  Sequelize,
);
db.ItemMaster = require("../master/Itemmaster/model/Itemmodel.js")(
  sequelize,
  Sequelize,
);
db.imageDocument = require("../master/Itemmaster/model/imageDocument.js")(
  sequelize,
  Sequelize,
);
db.item_image = require("../master/Itemmaster/model/item-img.js")(
  sequelize,
  Sequelize,
);
db.ItemMasterCustomerType =
  require("../master/Itemmaster/model/customerTypeItem.js")(
    sequelize,
    Sequelize,
  );
db.itemSpecification =
  require("../master/Itemmaster/model/itemSpecificationModel.js")(
    sequelize,
    Sequelize,
  );
db.ItemGroup = require("../master/Itemmaster/model/ItemGroup.js")(
  sequelize,
  Sequelize,
);
db.scheme_master = require("../master/scheme_master/models/schemeModel.js")(
  sequelize,
  Sequelize,
);
db.scheme_master_selected_item =
  require("../master/scheme_master/models/schemeSelectedItemModel.js")(
    sequelize,
    Sequelize,
  );
db.scheme_master_promo_item =
  require("../master/scheme_master/models/schemePromoItemModel.js")(
    sequelize,
    Sequelize,
  );
db.proposal_performa_invoice =
  require("../CRM/CreateProposal/model/proposal_performa_invoice.js")(
    sequelize,
    Sequelize,
  );
db.proposal_documents =
  require("../CRM/CreateProposal/model/proposal_quotation_documents.js")(
    sequelize,
    Sequelize,
  );
db.salesReason =
  require("../master/sales_reason_master/models/sales_reason_model.js")(
    sequelize,
    Sequelize,
  );
db.salesSoProgressStatus =
  require("../SalesManagement/salesInvoice/model/salesSoProgrssStatus.js")(
    sequelize,
    Sequelize,
  );

//new warehouse
db.warehouse_type = require("../Warehouse_Module/model/warehouse_type.js")(
  sequelize,
  Sequelize,
);
db.warehouse = require("../Warehouse_Module/model/warehouse_model.js")(
  sequelize,
  Sequelize,
);
db.warehouse_bifurcation_zone =
  require("../Warehouse_Module/model/warehouse_bifurcation_zone.js")(
    sequelize,
    Sequelize,
  );
db.warehouse_doc = require("../Warehouse_Module/model/warehouse_documents.js")(
  sequelize,
  Sequelize,
);
db.WAREHOUSE_BAY = require("../Warehouse_Module/model/warehouse_bay_model.js")(
  sequelize,
  Sequelize,
);
db.WAREHOUSE_RACK =
  require("../Warehouse_Module/model/warehouse_rack_model.js")(
    sequelize,
    Sequelize,
  );
db.WAREHOUSE_BIN = require("../Warehouse_Module/model/warehouse_bins_model.js")(
  sequelize,
  Sequelize,
);
db.warehouseBifurcationRow = db.WAREHOUSE_BAY;
db.warehouseBifurcationSelf = db.WAREHOUSE_RACK;
db.warehouseBifurcationSection = db.WAREHOUSE_BIN;
db.level_master = require("../master/LevelMaster/model/level_type.js")(
  sequelize,
  Sequelize,
);
db.fiancialTransactionsIntegration =
  require("../master/financial_transaction_integration/model/financialTransactionIntegration.js")(
    sequelize,
    Sequelize,
  );
db.fiancialTransactionsIntegrationList =
  require("../master/financial_transaction_integration/model/financialTransactionList.js")(
    sequelize,
    Sequelize,
  );
db.portMaster =
  require("../master/purchase-masters/port-master/port-master.model.js")(
    sequelize,
    Sequelize,
  );
db.incotermMaster =
  require("../master/purchase-masters/incoterm-master/incoterm.model.js")(
    sequelize,
    Sequelize,
  );

db.grnVersion = require("../Purchase_AND_Inventory/Grn/model/grnVersion.js")(
  sequelize,
  Sequelize,
);
db.warehouse_type = require("../Warehouse_Module/model/warehouse_type.js")(
  sequelize,
  Sequelize,
);
db.warehouseAllocation =
  require("../Warehouse_Module/model/warehouseAllocation.js")(
    sequelize,
    Sequelize,
  );
db.receiveStockTransfer =
  require("../inventory_module_management/model/receivedStockTransferModel.js")(
    sequelize,
    Sequelize,
  );
db.receiveStockTransferList =
  require("../inventory_module_management/model/receiveStockTransferListModel.js")(
    sequelize,
    Sequelize,
  );
db.prodraiseindent =
  require("../production/AddProduction/model/prodraiseindent.js")(
    sequelize,
    Sequelize,
  );
db.asset = require("../master/assetcategory/model/assetmodel.js")(
  sequelize,
  Sequelize,
);
db.shift = require("../master/Shift/model/shiftmodel.js")(sequelize, Sequelize);
db.shiftAllocate = require("../master/Shift/model/allocateShiftmodel.js")(
  sequelize,
  Sequelize,
);
db.workStation = require("../master/workstation/model/workStation.js")(
  sequelize,
  Sequelize,
);
db.UploadDoc = require("../master/workstation/model/UploadDocument.js")(
  sequelize,
  Sequelize,
);
db.ServicesCategory =
  require("../master/servicecategory/model/servicesmodel.js")(
    sequelize,
    Sequelize,
  );
db.Service_master =
  require("../master/servicemaster/models/servicemastermodels.js")(
    sequelize,
    Sequelize,
  );
db.regionMaster = require("../master/Region/models/regionModel.js")(
  sequelize,
  Sequelize,
);
db.expenseType = require("../master/Expense_Type/models/expenseModel.js")(
  sequelize,
  Sequelize,
);
db.needType = require("../master/Need_Type/models/needModel.js")(
  sequelize,
  Sequelize,
);
db.createStore = require("../stock_management/model/storeModel.js")(
  sequelize,
  Sequelize,
);
db.store_assigned_employee =
  require("../stock_management/model/storeAssignedEmployee.js")(
    sequelize,
    Sequelize,
  );
db.store_stock_transfer = require("../stock_management/model/storeTransfer.js")(
  sequelize,
  Sequelize,
);
db.store_stock_transfer_list =
  require("../stock_management/model/stockTransferList.js")(
    sequelize,
    Sequelize,
  );
db.receive_store_stock_transfer =
  require("../stock_management/model/receiveStockTransfer.js")(
    sequelize,
    Sequelize,
  );
db.receive_store_stock_transfer_list =
  require("../stock_management/model/receiveStockTransferList.js")(
    sequelize,
    Sequelize,
  );

db.municipality_name =
  require("../master/Municipality/model/municipalityModel.js")(
    sequelize,
    Sequelize,
  );
db.master_municipality_log =
  require("../master/Municipality/model/logModel.js")(sequelize, Sequelize);
db.budgetCategory =
  require("../master/Budget_Category/models/budget_Category_Model.js")(
    sequelize,
    Sequelize,
  );

db.contract_types = require("../master/Contract/model/ContractModel.js")(
  sequelize,
  Sequelize,
);
db.reason_for = require("../master/reason/model/reasonModel.js")(
  sequelize,
  Sequelize,
);
db.Job_Request = require("../ESS/job_request/model/jobRequestModel.js")(
  sequelize,
  Sequelize,
);
db.WorkFlow_Master = require("../ESS/workFlow/model/workFlowModel.js")(
  sequelize,
  Sequelize,
);
db.WorkFlow_Map = require("../ESS/workFlow/model/workFlowMapModel.js")(
  sequelize,
  Sequelize,
);
db.Work_Flow_range = require("../ESS/workFlow/model/workFlowRange.js")(
  sequelize,
  Sequelize,
);
db.workFlowItems = require("../ESS/workFlow/model/workflowItems.js")(
  sequelize,
  Sequelize,
);
db.Job_approval = require("../ESS/job_request/model/jobApproval.js")(
  sequelize,
  Sequelize,
);
db.technical_assessment =
  require("../ESS/Self_Assessment/model/technical_assessment.js")(
    sequelize,
    Sequelize,
  );
db.allowance = require("../master/Allowance/model/allowanceModel.js")(
  sequelize,
  Sequelize,
);
db.user_allowance =
  require("../HRMS/Employee_Master/models/user_allowance_model.js")(
    sequelize,
    Sequelize,
  );
db.user_documents =
  require("../HRMS/Employee_Master/models/user_document_model.js")(
    sequelize,
    Sequelize,
  );
db.user_family =
  require("../HRMS/Employee_Master/models/user_family_details_model.js")(
    sequelize,
    Sequelize,
  );
db.user_prev_employer =
  require("../HRMS/Employee_Master/models/user_prev_employer_detail_model.js")(
    sequelize,
    Sequelize,
  );
db.user_salary = require("../HRMS/Employee_Master/models/user_salary_model.js")(
  sequelize,
  Sequelize,
);
db.work_flow_main = require("../ESS/workFlow/model/workflow_table.js")(
  sequelize,
  Sequelize,
);
db.job_descripition =
  require("../Recruitment/Job_description/model/job_descripition.js")(
    sequelize,
    Sequelize,
  );
db.job_descripition_skill =
  require("../Recruitment/Job_description/model/job_skill.js")(
    sequelize,
    Sequelize,
  );
db.job_descripition_question =
  require("../Recruitment/Job_description/model/job_question.js")(
    sequelize,
    Sequelize,
  );
db.job_descripition_email =
  require("../Recruitment/Job_description/model/job_email.js")(
    sequelize,
    Sequelize,
  );
db.requirements = require("../../app/vendor/model/vendorModel.js")(
  sequelize,
  Sequelize,
);
/////////////vendor
db.vendorShippingAddress =
  require("../../app/vendor/model/vendorShippingAddress.js")(
    sequelize,
    Sequelize,
  );
db.vendorBillingAddress =
  require("../../app/vendor/model/vendorBillingAddress.js")(
    sequelize,
    Sequelize,
  );
db.vendorContactPerson =
  require("../../app/vendor/model/vendorContactPerson.js")(
    sequelize,
    Sequelize,
  );
db.PROCUREMENT_PURCHASE_VENDOR_RFP =
  require("../Purchase_AND_Inventory/RFP/model/pr_vendor_rfp.model.js")(
    sequelize,
    Sequelize,
  );
db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION =
  require("../Purchase_AND_Inventory/RFP/model/pr_vendor_negotiation.model.js")(
    sequelize,
    Sequelize,
  );
db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM =
  require("../Purchase_AND_Inventory/RFP/model/pr_negotiation_item.model.js")(
    sequelize,
    Sequelize,
  );
db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION =
  require("../Purchase_AND_Inventory/RFP/model/pr_vendor_quotation.model.js")(
    sequelize,
    Sequelize,
  );
db.PROCUREMENT_PURCHASE_QUOTATION_ITEM =
  require("../Purchase_AND_Inventory/RFP/model/pr_vendor_quotation_item.model.js")(
    sequelize,
    Sequelize,
  );
db.vendor_basic_details = require("../../app/vendor/model/vendorModel")(
  sequelize,
  Sequelize,
);
db.vendor_bank_details_map =
  require("../../app/vendor/model/vendorBankDetailsMap.js")(
    sequelize,
    Sequelize,
  );
db.vendor_doc_details_map = require("../vendor/model/vendorDocMapp.js")(
  sequelize,
  Sequelize,
);
db.forcast_revenue =
  require("../Business_Intelligence/forecast_revenue/models/forcast_revenue_model.js")(
    sequelize,
    Sequelize,
  );
db.forcast_revenue_sealList =
  require("../Business_Intelligence/forecast_revenue/models/forcast_revenue_seal_List_model.js")(
    sequelize,
    Sequelize,
  );
db.asset_depreciation =
  require("../Asset_Management/Depreciation/models/depreciation_model.js")(
    sequelize,
    Sequelize,
  );

db.ESS_TRAVEL_PLAN =
  require("../ESS/Travel_Request/Model/travel_plan.model.js")(
    sequelize,
    Sequelize,
  );
db.ESS_TRAVEL_PLAN_DATA =
  require("../ESS/Travel_Request/Model/travel_plan_data.model.js")(
    sequelize,
    Sequelize,
  );
db.travel_request =
  require("../ESS/Travel_Request/Model/travel_Request_Model.js")(
    sequelize,
    Sequelize,
  );
db.travel_request_data =
  require("../ESS/Travel_Request/Model/travel_data_models.js")(
    sequelize,
    Sequelize,
  );
db.travel_journey_bifurcation =
  require("../ESS/Travel_Request/Model/travel_journey_bifurcation.model.js")(
    sequelize,
    Sequelize,
  );
db.travel_approval =
  require("../ESS/Travel_Request/Model/travel_approval_models.js")(
    sequelize,
    Sequelize,
  );
db.vendor_doc_details_map = require("../vendor/model/vendorDocMapp.js")(
  sequelize,
  Sequelize,
);
// Procurement Purchase Start
db.purchase_details =
  require("../Purchase_AND_Inventory/purchase_request/model/purchaseRequestModel.js")(
    sequelize,
    Sequelize,
  );
db.purchase_vendor =
  require("../Purchase_AND_Inventory/purchase_request/model/purchaseVendorModel.js")(
    sequelize,
    Sequelize,
  );
db.purchase_imgae =
  require("../Purchase_AND_Inventory/purchase_request/model/purchaseImageModel.js")(
    sequelize,
    Sequelize,
  );
db.purchase_item =
  require("../Purchase_AND_Inventory/purchase_request/model/purchaseItemModel.js")(
    sequelize,
    Sequelize,
  );
db.purchase_item_ques =
  require("../Purchase_AND_Inventory/purchase_request/model/purchaseItemQues.js")(
    sequelize,
    Sequelize,
  );

// PO
db.purchase_order =
  require("../Purchase_AND_Inventory/purchase_order/model/purchase_order_model.js")(
    sequelize,
    Sequelize,
  );
db.purchase_order_image =
  require("../Purchase_AND_Inventory/purchase_order/model/purchase_order_image.js")(
    sequelize,
    Sequelize,
  );
db.purchase_order_item =
  require("../Purchase_AND_Inventory/purchase_order/model/purchase_order_Item.js")(
    sequelize,
    Sequelize,
  );
db.purchase_order_service =
  require("../Purchase_AND_Inventory/purchase_order/model/purchase_order_service.js")(
    sequelize,
    Sequelize,
  );
db.purchase_order_approval =
  require("../Purchase_AND_Inventory/purchase_order/model/purchase_order_approval.js")(
    sequelize,
    Sequelize,
  );

// Procurement Purchase End
db.candidate_interviewer =
  require("../Recruitment/Candidate_Profile/model/candidate_interviewer.js")(
    sequelize,
    Sequelize,
  );
db.candidate_interview_round =
  require("../Recruitment/Candidate_Profile/model/candidate_interview_round.js")(
    sequelize,
    Sequelize,
  );
db.procurement_approval =
  require("../Purchase_AND_Inventory/purchase_request/model/purchaseApproval.js")(
    sequelize,
    Sequelize,
  );
db.candidate_interview_rating =
  require("../Recruitment/Candidate_Profile/model/candidate_interview_skills_rating.js")(
    sequelize,
    Sequelize,
  );

db.leave_master = require("../ESS/Leave_Apply/models/leave_models/leaveMaster.js")(
  sequelize,
  Sequelize,
);
db.leavePolicyDetailModel =
  require("../ESS/Leave_Apply/models/leave_models/leaveDetailModel.js")(
    sequelize,
    Sequelize,
  ); //New
db.leavePolicyRestrictions =
  require("../ESS/Leave_Apply/models/leave_models/restrictionsModel.js")(
    sequelize,
    Sequelize,
  );
db.leavePolicyEntitlement =
  require("../ESS/Leave_Apply/models/leave_models/leaveEntitlementModel.js")(
    sequelize,
    Sequelize,
  );
db.applicabilityAll =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/applicabilityAll.js")(
    sequelize,
    Sequelize,
  );
db.locationMaster =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/locationMaster.js")(
    sequelize,
    Sequelize,
  );
db.Master_basket = require("../master/basket/model/basketModel.js")(
  sequelize,
  Sequelize,
);

db.designation = require("../master/designation/model/designation.js")(
  sequelize,
  Sequelize,
);
db.department = require("../master/department/model/department.js")(
  sequelize,
  Sequelize,
);
db.appDepartment =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/applicabilityDepartment.js")(
    sequelize,
    Sequelize,
  );
db.appDesignation =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/applicabilityDesignation.js")(
    sequelize,
    Sequelize,
  );
db.appLocation =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/applicabilityLocation.js")(
    sequelize,
    Sequelize,
  );
db.appGender =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/applicabilityGender.js")(
    sequelize,
    Sequelize,
  );
db.appMarital =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/applicabilityMarital.js")(
    sequelize,
    Sequelize,
  );
db.restrictionsDurations =
  require("../ESS/Leave_Apply/models/leave_models/leavePolicySubModels/restrictionsDurations.js")(
    sequelize,
    Sequelize,
  );

db.essApplyLeaveDetail =
  require("../ESS/Leave_Apply/models/leaveAppliedModel.js")(
    sequelize,
    Sequelize,
  );
db.essLeavedaysDetail =
  require("../ESS/Leave_Apply/models/leaveapplydaysmodel.js")(
    sequelize,
    Sequelize,
  );
db.appliedLeaveDocuments =
  require("../ESS/Leave_Apply/models/appliedLeaveDocumentsModel.js")(
    sequelize,
    Sequelize,
  );

db.expense_request =
  require("../Expenses/travel_expense/model/expense_request_model.js")(
    sequelize,
    Sequelize,
  );
db.expense_approval =
  require("../Expenses/travel_expense/model/expense_approval_model.js")(
    sequelize,
    Sequelize,
  );
db.expense_request_data =
  require("../Expenses/travel_expense/model/expense_data_model.js")(
    sequelize,
    Sequelize,
  );
db.assessment =
  require("../Performance_Management/Yearly_Assessment_Setup/model/yearlyAssessmentModel.js")(
    sequelize,
    Sequelize,
  );
db.submitted_assessment =
  require("../Performance_Management/Yearly_Assessment_Setup/model/submitted_Assessment_Model.js")(
    sequelize,
    Sequelize,
  );
db.holidayCategory =
  require("../master/Leave_Master/Holiday/model/holidayCategory.model.js")(
    sequelize,
    Sequelize,
  );
db.holidayDetail =
  require("../master/Leave_Master/Holiday/model/holiday.model.js")(
    sequelize,
    Sequelize,
  );
db.holidayWithCategory =
  require("../master/Leave_Master/Holiday/model/holidayWithCategory.model.js")(
    sequelize,
    Sequelize,
  );
db.candidate_bgv = require("../Recruitment/BGV/model/candidate_bgv_model.js")(
  sequelize,
  Sequelize,
);
db.candidate_bgv_company =
  require("../Recruitment/BGV/model/candidate_bgv_company_details.js")(
    sequelize,
    Sequelize,
  );
db.self_rating = require("../Recruitment/BGV/model/selfrating_model.js")(
  sequelize,
  Sequelize,
);
db.behaviour =
  require("../ESS/Self_Assessment/model/behavioural_Assessment_Model.js")(
    sequelize,
    Sequelize,
  );
db.skillDevelopment =
  require("../ESS/Self_Assessment/model/skill_Development_plan_Model.js")(
    sequelize,
    Sequelize,
  );
db.suggest_skillDevelopment =
  require("../ESS/Self_Assessment/model/suggest_skill_development_plan.js")(
    sequelize,
    Sequelize,
  );
db.company_qual_rating =
  require("../Recruitment/BGV/model/cand_company_qualityrating.js")(
    sequelize,
    Sequelize,
  );
db.committee_assign_user =
  require("../ESS/Self_Assessment/model/committee_assign_userlist_Model.js")(
    sequelize,
    Sequelize,
  );
db.committee_assess_rating =
  require("../ESS/Self_Assessment/model/committee_approved_model.js")(
    sequelize,
    Sequelize,
  );
db.colleague_review =
  require("../ESS/Colleague_Review/models/colleague_review_model.js")(
    sequelize,
    Sequelize,
  );

db.candidate_offer_letter =
  require("../Recruitment/BGV/model/candidate_offer_letter_model.js")(
    sequelize,
    Sequelize,
  );
db.candidate_offer_allowance =
  require("../Recruitment/BGV/model/candidate_offer_allowance_model.js")(
    sequelize,
    Sequelize,
  );
db.candidate_offer_letter_doc =
  require("../Recruitment/Candidate_onboarding/model/candidate_oofer_letter_pdf_model.js")(
    sequelize,
    Sequelize,
  );
db.assessment =
  require("../Performance_Management/Yearly_Assessment_Setup/model/yearlyAssessmentModel.js")(
    sequelize,
    Sequelize,
  );
db.submitted_assessment =
  require("../Performance_Management/Yearly_Assessment_Setup/model/submitted_Assessment_Model.js")(
    sequelize,
    Sequelize,
  );
db.candidate_bgv = require("../Recruitment/BGV/model/candidate_bgv_model.js")(
  sequelize,
  Sequelize,
);
db.candidate_bgv_company =
  require("../Recruitment/BGV/model/candidate_bgv_company_details.js")(
    sequelize,
    Sequelize,
  );
db.self_rating = require("../Recruitment/BGV/model/selfrating_model.js")(
  sequelize,
  Sequelize,
);
db.behaviour =
  require("../ESS/Self_Assessment/model/behavioural_Assessment_Model.js")(
    sequelize,
    Sequelize,
  );
db.skillDevelopment =
  require("../ESS/Self_Assessment/model/skill_Development_plan_Model.js")(
    sequelize,
    Sequelize,
  );
db.suggest_skillDevelopment =
  require("../ESS/Self_Assessment/model/suggest_skill_development_plan.js")(
    sequelize,
    Sequelize,
  );
db.company_qual_rating =
  require("../Recruitment/BGV/model/cand_company_qualityrating.js")(
    sequelize,
    Sequelize,
  );

db.quotationApprovalLevel =
  require("../Purchase_AND_Inventory/RFP/model/rfp_nego_approval_data.js")(
    sequelize,
    Sequelize,
  );
db.credit_limit_approval_workflow =
  require("../master/EmployeeMapWithLevel/models/credit_limit_workflow.js")(
    sequelize,
    Sequelize,
  );

db.tbl_itemType = require("../master/Itemmaster/model/itemTypeModel.js")(
  sequelize,
  Sequelize,
);
db.product_image = require("../master/product/model/product_image.js")(
  sequelize,
  Sequelize,
);
db.SubCategory = require("../master/SubCategory/model/submodel.js")(
  sequelize,
  Sequelize,
);
db.productSubCategory =
  require("../master/product/model/productSubCategory.js")(
    sequelize,
    Sequelize,
  );
db.customerBilling =
  require("../master/Customer/model/customerBillingModel.js")(
    sequelize,
    Sequelize,
  );
db.customerShippingAddress =
  require("../master/Customer/model/customerShippingAddress.js")(
    sequelize,
    Sequelize,
  );
db.customerBillingAddress =
  require("../master/Customer/model/customerBillingAddress.js")(
    sequelize,
    Sequelize,
  );
db.customerDelivery =
  require("../master/Customer/model/customerDeliveryModel.js")(
    sequelize,
    Sequelize,
  );
db.customer_document = require("../master/Customer/model/customerDocModel.js")(
  sequelize,
  Sequelize,
);
db.customer_Product_Price =
  require("../master/product/model/customer_product_price_map")(
    sequelize,
    Sequelize,
  );
db.expectedDays =
  require("../master/expectedDeliveryDay/models/expectedDay.js")(
    sequelize,
    Sequelize,
  );

// asset managent
db.calculationMethod =
  require("../Asset_Management/company_depreciationMaster/models/company_depreciationCalculationMethodModel.js")(
    sequelize,
    Sequelize,
  );
db.depreciationCalculation =
  require("../Asset_Management/company_depreciationMaster/models/company_depreciation_masterModel.js")(
    sequelize,
    Sequelize,
  );
db.companyDepreciationDocs =
  require("../Asset_Management/company_depreciationMaster/models/company_depreciationDocModel.js")(
    sequelize,
    Sequelize,
  );
db.assetMaintenance =
  require("../Asset Maintenance/Maintenance/models/asset_maintenanceModel.js")(
    sequelize,
    Sequelize,
  );
db.assetWarranty =
  require("../Asset Warranty/Asset Warranty List/models/asset_warrantyListModel.js")(
    sequelize,
    Sequelize,
  );
db.assetMaintenanceMapping =
  require("../Asset Maintenance/Maintenance/models/asset_maintenanceMappingModel.js")(
    sequelize,
    Sequelize,
  );
db.depreciationCalculationYearLog =
  require("../Asset_Management/company_depreciationMaster/models/companyDepreciationCalculationYearWiseModal.js")(
    sequelize,
    Sequelize,
  );
db.depreciationCalculationMonthLog =
  require("../Asset_Management/company_depreciationMaster/models/companyDepreciationCalculationMonthWiseModal.js")(
    sequelize,
    Sequelize,
  );
db.repairCategory =
  require("../Asset Maintenance/Maintenance/models/repair_caregory_modal.js")(
    sequelize,
    Sequelize,
  );
db.assetMaintenanceRepairCategoryMapping =
  require("../Asset Maintenance/Maintenance/models/asset_mantainance_repairCategory_mapping.js")(
    sequelize,
    Sequelize,
  );
const { AssetHistory, AssetHistoryLog } =
  require("../Direct_Asset/model/create_asset_allocate.js")(
    sequelize,
    Sequelize.DataTypes,
  );
db.assetHistory = AssetHistory;
db.assetHistoryLog = AssetHistoryLog;
db.asset_specification = require("../Direct_Asset/model/specification.js")(
  sequelize,
  Sequelize,
);
db.asset_documents = require("../Direct_Asset/model/assetDocument.js")(
  sequelize,
  Sequelize,
);
db.AssetDisposition = require("../Direct_Asset/model/asset_disposition.js")(
  sequelize,
  Sequelize,
);
db.AssetDispositionItem =
  require("../Direct_Asset/model/asset_disposition_item.js")(
    sequelize,
    Sequelize,
  );
db.assetRevaluation = require("../Direct_Asset/model/asset_revaluation.js")(
  sequelize,
  Sequelize,
);
db.assetmaintenance =
  require("../Maintenance_Management/model/maintenanceAsset.js")(
    sequelize,
    Sequelize,
  );
db.FailedAsset = require("../Direct_Asset/model/failedAsset.js")(
  sequelize,
  Sequelize,
);
db.AssetStatus = require("../Direct_Asset/model/assetStatus.model.js")(
  sequelize,
  Sequelize,
);
db.AssetCompanyDepreciationDailyLog =
  require("../Direct_Asset/model/assetDailyLog.model.js")(sequelize, Sequelize);
db.acdl = require("../Direct_Asset/model/assetDailyLog.model.js")(
  sequelize,
  Sequelize,
);
db.asset_inventory = require("../Direct_Asset/model/asset_inventory_modal.js")(
  sequelize,
  Sequelize,
);
db.asset_transfer_note =
  require("../Direct_Asset/model/asset_transfer_node.js")(sequelize, Sequelize);
// end asset

db.grnVerion = require("../Purchase_AND_Inventory/Grn/model/grnVersion.js")(
  sequelize,
  Sequelize,
);
db.grnMaster = require("../Purchase_AND_Inventory/Grn/model/grnModel.js")(
  sequelize,
  Sequelize,
);
db.grnItem = require("../Purchase_AND_Inventory/Grn/model/grnItem.js")(
  sequelize,
  Sequelize,
);
db.grnItemStatus =
  require("../Purchase_AND_Inventory/Grn/model/grnItemStatus.js")(
    sequelize,
    Sequelize,
  );
db.purchaseReturn =
  require("../Purchase_AND_Inventory/purchase_return/model/purchaseReturn.js")(
    sequelize,
    Sequelize,
  );
db.purchaseReturnItem =
  require("../Purchase_AND_Inventory/purchase_return/model/purchaseReturnItem.js")(
    sequelize,
    Sequelize,
  );
db.purchaseReturnStatusLog =
  require("../Purchase_AND_Inventory/purchase_return/model/purchaseReturnStatusLog.js")(
    sequelize,
    Sequelize,
  );
db.checklist = require("../master/checklist/models/checklist.model.js")(
  sequelize,
  Sequelize,
);

db.fund_transfer =
  require("../Finance_And_Accounting/fundTransfer/model/fund_transfer_model.js")(
    sequelize,
    Sequelize,
  );
db.travel_advance_booking =
  require("../Finance_And_Accounting/Travel_Advance_Booking/models/travel_booking_model.js")(
    sequelize,
    Sequelize,
  );
db.income_statement_approval =
  require("../Finance_And_Accounting/Income_Statement/models/income_statement_approval.js")(
    sequelize,
    Sequelize,
  );
db.fundTransferApprovalLevel =
  require("../Finance_And_Accounting/fundTransfer/model/fund_transfer_approval_level.js")(
    sequelize,
    Sequelize,
  );
db.income_statement =
  require("../Finance_And_Accounting/Income_Statement/models/income_statement_model.js")(
    sequelize,
    Sequelize,
  );
db.budgetPlanDate =
  require("../Finance_And_Accounting/Budget_Plan_Date/models/budget_plandate_model.js")(
    sequelize,
    Sequelize,
  );
db.budgetPlanning =
  require("../Finance_And_Accounting/Budget_Planning/models/budget_planning_model.js")(
    sequelize,
    Sequelize,
  );
db.budgetPlanDateHistory =
  require("../Finance_And_Accounting/Budget_Plan_Date/models/budget_plandate_history_model.js")(
    sequelize,
    Sequelize,
  );
db.budget_approval =
  require("../Finance_And_Accounting/Budget_Planning/models/budget_approval.js")(
    sequelize,
    Sequelize,
  );
db.cost_center =
  require("../Finance_And_Accounting/Cost_Center/models/cost_center_model.js")(
    sequelize,
    Sequelize,
  );
db.cost_center_map =
  require("../Finance_And_Accounting/Cost_Center/models/costCenterMap.js")(
    sequelize,
    Sequelize,
  );
db.masterMonth =
  require("../Finance_And_Accounting/Charts_Of_Accounts/models/masterMonthModel.js")(
    sequelize,
    Sequelize,
  );
db.createPostingPeriod =
  require("../Finance_And_Accounting/PostingPeriod/model/createPostingPeriod.js")(
    sequelize,
    Sequelize,
  );
db.createPostingPeriodMonthList =
  require("../Finance_And_Accounting/PostingPeriod/model/createPostingPeriodMonthly.js")(
    sequelize,
    Sequelize,
  );
db.createChartOfAccounts =
  require("../Finance_And_Accounting/Charts_Of_Accounts/models/chartOfAccountsModel.js")(
    sequelize,
    Sequelize,
  );
db.Service_Center =
  require("../master/servicecenter/models/servicecentermodels.js")(
    sequelize,
    Sequelize,
  );
// journal
db.financial_And_Account_Journal =
  require("../Finance_And_Accounting/journal/model/financial_account_journal.js")(
    sequelize,
    Sequelize,
  );
db.financial_And_Account_Journal_List =
  require("../Finance_And_Accounting/journal/model/financial_account_journal_list.js")(
    sequelize,
    Sequelize,
  );
db.financial_And_Account_Journal_Schedule =
  require("../Finance_And_Accounting/journal/model/journal_auto_repeat.js")(
    sequelize,
    Sequelize,
  );
db.financial_And_Account_Journal_Document =
  require("../Finance_And_Accounting/journal/model/journalDocument.js")(
    sequelize,
    Sequelize,
  );
db.createBank = require("../Finance_And_Accounting/Bank/model/createBank.js")(
  sequelize,
  Sequelize,
);
db.customerBank = require("../master/Customer/model/customerBankdeltails.js")(
  sequelize,
  Sequelize,
);
db.createBankAccount =
  require("../Finance_And_Accounting/BankAccount/model/createBankAccount.js")(
    sequelize,
    Sequelize,
  );
db.financeProfitCenter =
  require("../Finance_And_Accounting/FinanceProfitCenter/model/financeProfitCenter.js")(
    sequelize,
    Sequelize,
  );
// cashbook
db.createCashBookMoneyIn =
  require("../Finance_And_Accounting/cashBook/model/cashBookMoneyIn.js")(
    sequelize,
    Sequelize,
  );
db.createCashBookMoneyOut =
  require("../Finance_And_Accounting/cashBook/model/cashBookMoneyOut.js")(
    sequelize,
    Sequelize,
  );
db.chartOfAccountTdsList =
  require("../Finance_And_Accounting/Charts_Of_Accounts/models/chartOfAccountTdsModel.js")(
    sequelize,
    Sequelize,
  );
//Customer Type///
db.customer_business_details =
  require("../master/Customer/model/customerBusinessDetailsModel.js")(
    sequelize,
    Sequelize,
  );
db.customerType = require("../master/customerType/model/customerType.js.js")(
  sequelize,
  Sequelize,
);
// sales
db.delivery_order =
  require("../SalesManagement/deliveryOrders/model/delivery_orders.js")(
    sequelize,
    Sequelize,
  );
db.proforma = require("../SalesManagement/proforma/model/proforma.js")(
  sequelize,
  Sequelize,
);
db.salesInvoice =
  require("../SalesManagement/salesInvoice/model/salesInvoice.js")(
    sequelize,
    Sequelize,
  );
db.proformaApprovalLevel =
  require("../SalesManagement/proforma/model/proforma_approval_level.js")(
    sequelize,
    Sequelize,
  );
db.salesInvoiceApprovalLevel =
  require("../SalesManagement/salesInvoice/model/salesInvoiceApprovalLevel.js")(
    sequelize,
    Sequelize,
  );
db.deliveryOrderApprovalLevel =
  require("../SalesManagement/deliveryOrders/model/deliveryOrderApprovalLevel.js")(
    sequelize,
    Sequelize,
  );
db.uses = require("../master/uses/model/uses.js")(sequelize, Sequelize);
db.timeSheet_request = require("../ESS/TimeSheet/models/timesheetModel.js")(
  sequelize,
  Sequelize,
);
db.customersubcategory =
  require("../master/Customer_sub_category/model/customer_sub_category.js")(
    sequelize,
    Sequelize,
  );
db.customer_item_list =
  require("../master/Customer/model/customerItemModel.js")(
    sequelize,
    Sequelize,
  );
db.customerPaymentTermMaster =
  require("../master/Customer/model/customerPaymentTermMaster.js")(
    sequelize,
    Sequelize,
  );
db.customerCreditLimit =
  require("../master/Customer/model/customerCreditLimit.js")(
    sequelize,
    Sequelize,
  );
db.customerCreditDebit =
  require("../SalesManagement/superUser/model/customerCreditDebit.js")(
    sequelize,
    Sequelize,
  );
// hsn-sac
db.hsn_sac_master = require("../master/hsn-sac/models/hsn_sac.js")(
  sequelize,
  Sequelize,
);
db.gst_rate_master = require("../master/hsn-sac/models/gst_rate.js")(
  sequelize,
  Sequelize,
);

//complaint
db.complaint_doc = require("../ESS/Complaint/models/complain_doc.model.js")(
  sequelize,
  Sequelize,
);

db.customermicrocategory =
  require("../master/Customer_Micro_Category/model/customer_micro_model.js")(
    sequelize,
    Sequelize,
  );

db.directInvoice =
  require("../Finance_And_Accounting/Direct-Invoice/models/direct_invoice_model.js")(
    sequelize,
    Sequelize,
  );
db.directInvoiceItems =
  require("../Finance_And_Accounting/Direct-Invoice/models/direct_invoice_items.js")(
    sequelize,
    Sequelize,
  );
db.direct_invoice_payment =
  require("../Finance_And_Accounting/Direct-Invoice/models/direct_invoice_payment.js")(
    sequelize,
    Sequelize,
  );
db.directInvoiceService =
  require("../Finance_And_Accounting/Direct-Invoice/models/direct_invoice_service.js")(
    sequelize,
    Sequelize,
  );

/* PAYROLL */
db.empContributionRate =
  require("../master/Payroll/model/employee_contribution.model")(
    sequelize,
    Sequelize,
  );
db.emplrContributionRate =
  require("../master/Payroll/model/employer_contribution_rate.model.js")(
    sequelize,
    Sequelize,
  );
db.earning_type = require("../master/Payroll/model/earning_type.js")(
  sequelize,
  Sequelize,
);
db.master_payroll_cycle =
  require("../master/Payroll/model/payroll_cycle_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_tax_slab = require("../Payroll/TaxSlab/model/tax_model.js")(
  sequelize,
  Sequelize,
);
db.payroll_epf = require("../Payroll/EPF/model/epf_model.js")(
  sequelize,
  Sequelize,
);
db.payroll_esi = require("../Payroll/ESI/model/esi_model.js")(
  sequelize,
  Sequelize,
);
db.payroll_statutory = require("../Payroll/Statutory/model/statutory_model.js")(
  sequelize,
  Sequelize,
);
db.payroll_salaryComponentEarning =
  require("../Payroll/SalaryComponents/Earnings/model/earning_model")(
    sequelize,
    Sequelize,
  );
db.payroll_salaryComponentReimbursement =
  require("../Payroll/SalaryComponents/Reimbursement/model/reimbursement_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_salaryComponentDeduction =
  require("../Payroll/SalaryComponents/Deduction/model/deduction_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_salary_template =
  require("../Payroll/SalaryTemplate/model/salary_template_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_pay_salary =
  require("../HRMS/Employee_Master/models/payroll_pay_salary_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_payslip =
  require("../Payroll/Salary_Process_Details/model/pay_slips_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_process =
  require("../Payroll/Salary_Process_Details/model/payroll_process_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_att_month =
  require("../Payroll/Salary_Process_Details/model/payslip_attendance_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_approval =
  require("../Payroll/Salary_Process_Details/model/payroll_approval_request_model.js")(
    sequelize,
    Sequelize,
  );
db.payroll_workflowrange =
  require("../Payroll/Salary_Process_Details/model/payroll_workflow_range")(
    sequelize,
    Sequelize,
  );
db.payroll_declaration_form =
  require("../Payroll/DeclarationForm/model/declarationForm_model")(
    sequelize,
    Sequelize,
  );

db.poPaymentAddtion =
  require("../Purchase_AND_Inventory/Invoice/models/poPayemntMap.js")(
    sequelize,
    Sequelize,
  );
db.zoneType = require("../master/zone-type/model/zoneType.model.js")(
  sequelize,
  Sequelize,
);
///////////////--------------------------------------///////////////

db.voucherMain = require("../master/MasterVoucherMain/model/VoucherMain.js")(
  sequelize,
  Sequelize,
);
db.voucherMainList =
  require("../master/MasterVoucherMain/model/VoucherMainList.js")(
    sequelize,
    Sequelize,
  );

// ---------------------------------------------------------------
db.productcategory = require("../master/productcategory/model/category.js")(
  sequelize,
  Sequelize,
);
db.voucherMaster = require("../master/voucher_master/models/voucher_master.js")(
  sequelize,
  Sequelize,
);
db.paymentAdviceVoucher =
  require("../master/PaymentAdiceVoucher/models/PaymentAdviceModel.js")(
    sequelize,
    Sequelize,
  );
db.bankPaymentVoucher =
  require("../master/bankpaymentVoucher/models/bankPaymentVoucherRoute.js")(
    sequelize,
    Sequelize,
  );
db.bankRecieptVoucher =
  require("../master/bankRecieptVoucher/models/bankRecieptVoucherModel.js")(
    sequelize,
    Sequelize,
  );
db.product__variant_master =
  require("../master/product/model/product_variant.js")(sequelize, Sequelize);
db.plantmaster = require("../master/plant/models/plantmodel.js")(
  sequelize,
  Sequelize,
);
// Production API
db.bom = require("../production/BOM/model/bom.js")(sequelize, Sequelize);
db.bomDetails = require("../production/BOM/model/bomDetails.js")(
  sequelize,
  Sequelize,
);
db.production = require("../production/AddProduction/model/addProduction.js")(
  sequelize,
  Sequelize,
);
db.productionMapping =
  require("../production/AddProduction/model/productionMapping.js")(
    sequelize,
    Sequelize,
  );
db.productionMappingshift =
  require("../production/AddProduction/model/productionshift.js")(
    sequelize,
    Sequelize,
  );
db.productionWorkStation =
  require("../production/AddProduction/model/productionworkstation.js")(
    sequelize,
    Sequelize,
  );
db.workstationmaintenance =
  require("../production/AddProduction/model/workstationmaintenance.js")(
    sequelize,
    Sequelize,
  );
db.prodraiseindent =
  require("../production/AddProduction/model/prodraiseindent.js")(
    sequelize,
    Sequelize,
  );
db.prodqualityControl =
  require("../production/AddProduction/model/prodqualityControl.js")(
    sequelize,
    Sequelize,
  );
db.prodqualityControlParameter =
  require("../production/AddProduction/model/prodqualityControlParameter.js")(
    sequelize,
    Sequelize,
  );
db.generateLabel =
  require("../production/AddProduction/model/generateLabel.js")(
    sequelize,
    Sequelize,
  );

db.quality_master = require("../master/quality/model/qualitymodel.js")(
  sequelize,
  Sequelize,
);
db.quality_parameter = require("../master/quality/model/qualityparameter.js")(
  sequelize,
  Sequelize,
);
db.stockLabelLocation =
  require("../production/AddProduction/model/stockLabelLocation.js")(
    sequelize,
    Sequelize,
  );
db.stockLocation =
  require("../production/AddProduction/model/stockLocation.js")(
    sequelize,
    Sequelize,
  );
db.stockAcknowledgedRack =
  require("../inventory_module_management/model/stockAcknowledgedRack.js")(
    sequelize,
    Sequelize,
  );
db.pochargesDetailsList =
  require("../Purchase_AND_Inventory/Invoice/models/chargesDetails.js")(
    sequelize,
    Sequelize,
  );

// -----------------------------------------------------------------

db.addDo = require("../CRM/AddDO/model/addDO.js")(sequelize, Sequelize);
db.salesIrnData = require("../CRM/AddDO/model/invoiceIRN.js")(
  sequelize,
  Sequelize,
);

db.ewayData = require("../CRM/AddDO/model/invoiceIRNEway.js")(
  sequelize,
  Sequelize,
);
db.ewayDatalIST = require("../CRM/AddDO/model/invoiceIRNEwayDataList.js")(
  sequelize,
  Sequelize,
);
db.gstInfo = require("../CRM/AddDO/model/gstInfo.js")(sequelize, Sequelize);
db.addDoItem = require("../CRM/AddDO/model/addDoItem.js")(sequelize, Sequelize);
db.assignEmployee = require("../CRM/AssignUser/model/assignEmployee.js")(
  sequelize,
  Sequelize,
);
db.assignUser = require("../CRM/AssignUser/model/assignUser.js")(
  sequelize,
  Sequelize,
);
db.billingData = require("../CRM/Billing/model/billing.js")(
  sequelize,
  Sequelize,
);
db.createLead = require("../CRM/CreateLead/model/createLead.js")(
  sequelize,
  Sequelize,
);
db.createDescription = require("../CRM/CreateLead/model/description.js")(
  sequelize,
  Sequelize,
);
db.proposalData = require("../CRM/CreateProposal/model/createProposal.js")(
  sequelize,
  Sequelize,
);
db.leadSource = require("../CRM/CreateProposal/model/leadSource.js")(
  sequelize,
  Sequelize,
);
db.deliveryTermAndUnloading =
  require("../CRM/CreateProposal/model/deliveryTermAndUnloading.js")(
    sequelize,
    Sequelize,
  );
db.paymentMainCategory =
  require("../CRM/CreateProposal/model/paymentMainCategory.js")(
    sequelize,
    Sequelize,
  );
db.paymentMainSubCategory =
  require("../CRM/CreateProposal/model/paymentMainSubCategory.js")(
    sequelize,
    Sequelize,
  );
db.crm_freight = require("../CRM/CreateProposal/model/freight.js")(
  sequelize,
  Sequelize,
);
db.crm_insurance = require("../CRM/CreateProposal/model/insurance.js")(
  sequelize,
  Sequelize,
);
db.addtionalContactDetails =
  require("../CRM/CreateProposal/model/addtionalContactDetails.js")(
    sequelize,
    Sequelize,
  );
db.proposalApprovel =
  require("../CRM/CreateProposal/model/proposalApproval.js")(
    sequelize,
    Sequelize,
  );
db.accessories_master =
  require("../master/accessories_master/model/accessories_model.js")(
    sequelize,
    Sequelize,
  );
db.accessories_mst_name =
  require("../master/accessories_master/model/accessoriesName_model.js")(
    sequelize,
    Sequelize,
  );

db.branding_master =
  require("../master/branding_master/model/branding_model.js")(
    sequelize,
    Sequelize,
  );
db.grossDiscountBreakup =
  require("../CRM/CreateProposal/model/gross_discount_item_perqty.js")(
    sequelize,
    Sequelize,
  );
db.proposalAddtionalCharges =
  require("../CRM/CreateProposal/model/proposalAddtionalCharges.js")(
    sequelize,
    Sequelize,
  );
db.proposalList = require("../CRM/CreateProposal/model/proposalList.js")(
  sequelize,
  Sequelize,
);
db.discountDetails = require("../CRM/CreateProposal/model/discountDetails.js")(
  sequelize,
  Sequelize,
);
db.paymentDetails = require("../CRM/CreateProposal/model/paymentDetails.js")(
  sequelize,
  Sequelize,
);
db.grossDiscountMaster =
  require("../CRM/CreateProposal/model/gross_discount_master.js")(
    sequelize,
    Sequelize,
  );
db.proposal_scheme_data = require("../CRM/CreateProposal/model/schemeData")(
  sequelize,
  Sequelize,
);
db.proposal_scheme_type =
  require("../CRM/CreateProposal/model/schemetypemodel.js")(
    sequelize,
    Sequelize,
  );
db.proposal_branding_scheme =
  require("../CRM/CreateProposal/model/brandingScheme.js")(
    sequelize,
    Sequelize,
  );
db.versionData = require("../CRM/CreateProposal/model/versionProposal.js")(
  sequelize,
  Sequelize,
);
db.dealClose = require("../CRM/DealClosed/model/dealClosed.js")(
  sequelize,
  Sequelize,
);
db.invoiceData = require("../CRM/InvoiceProposal/model/invoice.js")(
  sequelize,
  Sequelize,
);
db.fieldValue = require("../CRM/LeadFormSetup/model/fieldValue.js")(
  sequelize,
  Sequelize,
);
db.leadFormSetup = require("../CRM/LeadFormSetup/model/leadFormSetup.js")(
  sequelize,
  Sequelize,
);
db.leadSummary = require("../CRM/LeadSummary/model/leadSummary.js")(
  sequelize,
  Sequelize,
);
db.fieldType = require("../CRM/MasterData/models/fieldType.js")(
  sequelize,
  Sequelize,
);
db.crmModule = require("../CRM/MasterData/models/crmModule.js")(
  sequelize,
  Sequelize,
);
db.proposalPayment = require("../CRM/ProposalPayment/model/proposalPayment.js")(
  sequelize,
  Sequelize,
);
db.createLeadDetails = require("../CRM/CreateLead/model/createLeadDetails.js")(
  sequelize,
  Sequelize,
);
db.dynamicFieldValue =
  require("../master/dynamic_form_setup/model/dynamic_field_value.js")(
    sequelize,
    Sequelize,
  );
db.dynamicFieldName =
  require("../master/dynamic_form_setup/model/dynamic_field_name.js")(
    sequelize,
    Sequelize,
  );
db.dynamicFormSetup =
  require("../master/dynamic_form_setup/model/dynamic_form_setup_model.js")(
    sequelize,
    Sequelize,
  );
db.dynamicComponentType =
  require("../master/dynamic_form_setup/model/dynamic_component_type.js")(
    sequelize,
    Sequelize,
  );
/////sales invoice///// 27/05/2026
db.salesInvoiceData =
  require("../CRM/salesInvoice/models/salesInvoiceModel.js")(
    sequelize,
    Sequelize,
  );
db.salesInvoiceItem = require("../CRM/salesInvoice/models/salesInvoiceItem.js")(
  sequelize,
  Sequelize,
);
db.salesInvoiceCustomBranding =
  require("../CRM/salesInvoice/models/salesInvoiceCustomisation.js")(
    sequelize,
    Sequelize,
  );
db.salesDirectInvoiceItem =
  require("../CRM/salesInvoice/models/salesDirectInvoiceItem.js")(
    sequelize,
    Sequelize,
  );
db.salesDirectInvoiceCharges =
  require("../CRM/salesInvoice/models/salesDirectInvoiceAdditionalCharges.js")(
    sequelize,
    Sequelize,
  );

db.customerProfile =
  require("../master/Customer/model/customerProfileModel.js")(
    sequelize,
    Sequelize,
  );
db.advanceAmountCustomer =
  require("../master/Customer/model/AdvanceAmountCustomer.js")(
    sequelize,
    Sequelize,
  );
db.customerAddress = require("../master/Customer/model/customerAddress.js")(
  sequelize,
  Sequelize,
);
db.customerAddressContact =
  require("../master/Customer/model/customerAddressContact.js")(
    sequelize,
    Sequelize,
  );
db.prefix_mst = require("../CRM/CreateProposal/model/prefix_master.js")(
  sequelize,
  Sequelize,
);
db.customerProfile =
  require("../master/Customer/model/customerProfileModel.js")(
    sequelize,
    Sequelize,
  );
db.customerAddress = require("../master/Customer/model/customerAddress.js")(
  sequelize,
  Sequelize,
);
db.customerAddressContact =
  require("../master/Customer/model/customerAddressContact.js")(
    sequelize,
    Sequelize,
  );
db.prefix_mst = require("../CRM/CreateProposal/model/prefix_master.js")(
  sequelize,
  Sequelize,
);

db.dispatchOrder = require("../Warehouse/Dispatched/models/dispatchOrder.js")(
  sequelize,
  Sequelize,
);

db.sourceMaster = require("../master/sourceMaster/model/sourcemodel.js")(
  sequelize,
  Sequelize,
);

//issue master
db.issueMaster = require("../master/Issue_Type/model/issuetype.js")(
  sequelize,
  Sequelize,
);
db.grnItemCost = require("../Purchase_AND_Inventory/Grn/model/addITtemCost.js")(
  sequelize,
  Sequelize,
);

//breakdown management
db.addbreakdown = require("../breakdown_Management/model/breakdownIndent.js")(
  sequelize,
  Sequelize,
);
db.addbreakdownItem = require("../breakdown_Management/model/breakdownItem.js")(
  sequelize,
  Sequelize,
);
db.item_cost_category =
  require("../master/ItemCostCategory/model/itemCostCategory.js")(
    sequelize,
    Sequelize,
  );

//maintenance management
db.planmaintenance = require("../Maintenance_Management/model/maintenance.js")(
  sequelize,
  Sequelize,
);
db.assetmaintenance =
  require("../Maintenance_Management/model/maintenanceAsset.js")(
    sequelize,
    Sequelize,
  );
db.itemMaintenance =
  require("../Maintenance_Management/model/maintenanceItem.js")(
    sequelize,
    Sequelize,
  );
db.docMaintenance =
  require("../Maintenance_Management/model/maintenanceDoc.js")(
    sequelize,
    Sequelize,
  );
db.remarkMaintenance =
  require("../Maintenance_Management/model/maintenanceremark")(
    sequelize,
    Sequelize,
  );
db.maintenanceCheckList =
  require("../Maintenance_Management/model/maintenanceChecklist.js")(
    sequelize,
    Sequelize,
  );
db.ProductGroup = require("../master/product/model/product_group.js")(
  sequelize,
  Sequelize,
);
db.productType = require("../master/product/model/product_type.js")(
  sequelize,
  Sequelize,
);

///master maintenance
db.masterMaintenance =
  require("../master/maintenance-master/model/maintenanceCheckmodel.js")(
    sequelize,
    Sequelize,
  );
db.Manitenance_Type =
  require("../master/maintenance-master/model/maintenance_typemodel.js")(
    sequelize,
    Sequelize,
  );

//Complaint type
db.Master_Complaint =
  require("../master/Complain_Type/model/complain_Type_Model")(
    sequelize,
    Sequelize,
  );

//job description
db.job_descripition_share_type =
  require("../Recruitment/Job_description/model/job_share.js")(
    sequelize,
    Sequelize,
  );

/// Transport Management ....................
//vehical category....................
db.vehical_category =
  require("../Transport Management/Vehicle Category/model/vehical_categorymodel.js")(
    sequelize,
    Sequelize,
  );
db.fuelType_master = require("../Transport Management/model/fueltype_model.js")(
  sequelize,
  Sequelize,
);
db.vehicleType_master =
  require("../Transport Management/model/vehicletype_model.js")(
    sequelize,
    Sequelize,
  );
db.transporterType_master =
  require("../Transport Management/model/transportertype_model.js")(
    sequelize,
    Sequelize,
  );
db.transportType_master =
  require("../Transport Management/model/transporttype_model.js")(
    sequelize,
    Sequelize,
  );
db.drivers_mapping =
  require("../Transport Management/model/driversmapping_model.js")(
    sequelize,
    Sequelize,
  );
db.vehicles_mapping =
  require("../Transport Management/model/vehiclesmapping_model.js")(
    sequelize,
    Sequelize,
  );
db.rateAgreement_master =
  require("../Transport Management/model/rateagreement_model.js")(
    sequelize,
    Sequelize,
  );
db.rateAgreementDetails_mapping =
  require("../Transport Management/model/rateagreementdetails_model.js")(
    sequelize,
    Sequelize,
  );
db.agreementLevelType =
  require("../Transport Management/model/rateagreement_level_type.js")(
    sequelize,
    Sequelize,
  );

//............ vehicle master
db.vehicle_master =
  require("../Transport Management/Vehicle Master/model/vehical_mastermodel.js")(
    sequelize,
    Sequelize,
  );
db.close_trip =
  require("../Transport Management/Schedule Trip/model/closedTripModel")(
    sequelize,
    Sequelize,
  );
db.expense_trip =
  require("../Transport Management/Schedule Trip/model/expenseTripModel")(
    sequelize,
    Sequelize,
  );
db.scheduleTripDocument =
  require("../Transport Management/Schedule Trip/model/scheduleTripDocumentModel.js")(
    sequelize,
    Sequelize,
  );
db.scheduleTrip =
  require("../Transport Management/Schedule Trip/model/scheduleTripModel.js")(
    sequelize,
    Sequelize,
  );
//.......vehicle driver
db.vehicle_driver =
  require("../Transport Management/Driver Master/model/driver_mastermodel.js")(
    sequelize,
    Sequelize,
  );
db.transport_master =
  require("../Transport Management/Transport_Master/model/transport_model.js")(
    sequelize,
    Sequelize,
  );
db.transporterTds = require("../Transport Management/model/tdsTransporter.js")(
  sequelize,
  Sequelize,
);
db.transportRequest =
  require("../../app/Transport Management/Transport Request/model/transportRequest.js")(
    sequelize,
    Sequelize,
  );
db.transportReqProductDetail =
  require("../../app/Transport Management/Transport Request/model/requestProductDetails.js")(
    sequelize,
    Sequelize,
  );
db.transportApprovalLevel =
  require("../../app/Transport Management/Transport Request/model/transportApprovalLevel.js")(
    sequelize,
    Sequelize,
  );
db.transItemDetail =
  require("../../app/Transport Management/Transport Request/model/requestItemDetails.js")(
    sequelize,
    Sequelize,
  );
// db.transportVendor = require("../Transport Management/Vendor Master/model/transportVendor.js")(sequelize, Sequelize);
db.trip_expense_master =
  require("../master/trip_expense/model/tripExpenseModel.js")(
    sequelize,
    Sequelize,
  );
// ---------------------------------------------------------------
db.customerIndustryType =
  require("../master/customerType/model/Customer_Industry_Type.js")(
    sequelize,
    Sequelize,
  );
db.perposal_type = require("../master/PerposalType/models/PerposalModel.js")(
  sequelize,
  Sequelize,
);
db.customerApproval =
  require("../master/CustomerApproval/models/CustomerApproval.js")(
    sequelize,
    Sequelize,
  );
db.creditLimit = require("../master/CreditLimit/models/CreditLimit.js")(
  sequelize,
  Sequelize,
);
db.sanctionCreditLimit =
  require("../master/SanctionCreditLimit/models/SanctionCreditLimit.js")(
    sequelize,
    Sequelize,
  );
db.levelEmployee =
  require("../master/EmployeeMapWithLevel/models/EmployeeMapLevel.js")(
    sequelize,
    Sequelize,
  );

db.quotationApproval =
  require("../master/QuotatioApproval/models/QuotationApproval.js")(
    sequelize,
    Sequelize,
  );
db.quotationApprovalDetails =
  require("../master/QuotatioApproval/models/QuotationApprovalDetails.js")(
    sequelize,
    Sequelize,
  );

//////////////////////////////////////
//////////////////////////////// here code for shipping alert model assocciation
////////////////////////////////////////
db.createShippingAlert =
  require("../../app/Purchase_AND_Inventory/shippingAlert/models/createShippingAlert.js")(
    sequelize,
    Sequelize,
  );
db.shippingAlertItems =
  require("../../app/Purchase_AND_Inventory/shippingAlert/models/shippingAlertItems.js")(
    sequelize,
    Sequelize,
  );
db.shippingAlertDocuments =
  require("../../app/Purchase_AND_Inventory/shippingAlert/models/shippingAlertDocument.js")(
    sequelize,
    Sequelize,
  );
db.shippingTransportModeRoad =
  require("../Purchase_AND_Inventory/shippingAlert/models/shippingTransportModeRoad.js")(
    sequelize,
    Sequelize,
  );
db.shippingTransportModeAir =
  require("../Purchase_AND_Inventory/shippingAlert/models/shippingTransportModeAir.js")(
    sequelize,
    Sequelize,
  );
db.shippingTransportModeRail =
  require("../Purchase_AND_Inventory/shippingAlert/models/shippingTransportModeRail.js")(
    sequelize,
    Sequelize,
  );
db.shippingTransportModeSea =
  require("../Purchase_AND_Inventory/shippingAlert/models/shippingTransportModeSea.js")(
    sequelize,
    Sequelize,
  );
db.shippingTransportModeCourier =
  require("../Purchase_AND_Inventory/shippingAlert/models/shippingTransportModeCourier.js")(
    sequelize,
    Sequelize,
  );
db.shippingAlertHistory =
  require("../Purchase_AND_Inventory/shippingAlert/models/shippingAlertHistry.js")(
    sequelize,
    Sequelize,
  );
db.shippingBOEDetails =
  require("../Purchase_AND_Inventory/shippingAlert/models/shippingBOEDetails.js")(
    sequelize,
    Sequelize,
  );

////............ transType
db.transType = require("../CRM/CreateLead/model/transType.js")(
  sequelize,
  Sequelize,
);
db.documentType = require("../CRM/CreateLead/model/documentType.js")(
  sequelize,
  Sequelize,
);
db.supplyType = require("../CRM/CreateLead/model/supplyType.js")(
  sequelize,
  Sequelize,
);
// ---------------------------------------------------------------
db.creditDebitNote =
  require("../Finance_And_Accounting/CreditDebitNote/model/creditDebitNote.js")(
    sequelize,
    Sequelize,
  );
db.creditDebitNoteItem =
  require("../Finance_And_Accounting/CreditDebitNote/model/creditDebitNoteItem.js")(
    sequelize,
    Sequelize,
  );
db.transportChargesList =
  require("../Finance_And_Accounting/TransportVoucher/Models/TransportChargesList.js")(
    sequelize,
    Sequelize,
  );
db.purchaseServiceVoucher =
  require("../Finance_And_Accounting/PurchaseServiceVoucher/model/purchaseService.js")(
    sequelize,
    Sequelize,
  );
db.purchaseServiceVoucherAccount =
  require("../Finance_And_Accounting/PurchaseServiceVoucher/model/purchaseServiceAccount.js")(
    sequelize,
    Sequelize,
  );
db.transportChargeMst =
  require("../master/TransportChargeMaster/models/chargeMaster.js")(
    sequelize,
    Sequelize,
  );

//////////////////////////////////////
//////////////////////////////// here code for shipping alert model assocciation
////////////////////////////////////////
////// shipping main assocciation
db.entityMaster.hasMany(db.createShippingAlert, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.createShippingAlert.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.financial_year.hasMany(db.createShippingAlert, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.createShippingAlert.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
// User & Creator associations
db.user.hasMany(db.createShippingAlert, {
  foreignKey: "created_by",
  as: "shippingAlerts",
  onDelete: "RESTRICT",
});
db.createShippingAlert.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "creator",
  onDelete: "RESTRICT",
});

// PO & Vendor associations
db.purchase_order.hasMany(db.createShippingAlert, {
  foreignKey: "po_id",
  as: "shippingAlerts",
  onDelete: "RESTRICT",
});
db.createShippingAlert.belongsTo(db.purchase_order, {
  foreignKey: "po_id",
  as: "purchaseOrder",
  onDelete: "RESTRICT",
});

db.vendor_basic_details.hasMany(db.createShippingAlert, {
  foreignKey: "vendor_id",
  as: "shippingAlerts",
  onDelete: "RESTRICT",
});
db.createShippingAlert.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
  as: "vendor",
  onDelete: "RESTRICT",
});

// Shipping Items associations
db.createShippingAlert.hasMany(db.shippingAlertItems, {
  foreignKey: "shipping_alert_id",
  as: "items",
  onDelete: "RESTRICT",
});
db.shippingAlertItems.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

db.ItemMaster.hasMany(db.shippingAlertItems, {
  foreignKey: "item_master_id",
  as: "shippingItems",
  onDelete: "RESTRICT",
});
db.shippingAlertItems.belongsTo(db.ItemMaster, {
  foreignKey: "item_master_id",
  as: "itemMaster",
  onDelete: "RESTRICT",
});

db.purchase_order_item.hasMany(db.shippingAlertItems, {
  foreignKey: "po_item_id",
  as: "shippingItems",
  onDelete: "RESTRICT",
});
db.shippingAlertItems.belongsTo(db.purchase_order_item, {
  foreignKey: "po_item_id",
  as: "poItem",
  onDelete: "RESTRICT",
});

// Shipping Documents associations
db.createShippingAlert.hasMany(db.shippingAlertDocuments, {
  foreignKey: "shipping_alert_id",
  as: "documents",
  onDelete: "RESTRICT",
});
db.shippingAlertDocuments.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

// Transport Mode associations (Using descriptive aliases for clear fetching)
db.createShippingAlert.hasOne(db.shippingTransportModeRoad, {
  foreignKey: "shipping_alert_id",
  as: "roadDetails",
  onDelete: "RESTRICT",
});
db.shippingTransportModeRoad.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

db.createShippingAlert.hasOne(db.shippingTransportModeAir, {
  foreignKey: "shipping_alert_id",
  as: "airDetails",
  onDelete: "RESTRICT",
});
db.shippingTransportModeAir.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

db.createShippingAlert.hasOne(db.shippingTransportModeRail, {
  foreignKey: "shipping_alert_id",
  as: "railDetails",
  onDelete: "RESTRICT",
});
db.shippingTransportModeRail.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

db.createShippingAlert.hasOne(db.shippingTransportModeSea, {
  foreignKey: "shipping_alert_id",
  as: "seaDetails",
  onDelete: "RESTRICT",
});
db.shippingTransportModeSea.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.shippingTransportModeSea, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.shippingTransportModeSea.belongsTo(db.currency_convert, {
  foreignKey: "currency_id",
});
db.createShippingAlert.hasOne(db.shippingTransportModeCourier, {
  foreignKey: "shipping_alert_id",
  as: "courierDetails",
  onDelete: "RESTRICT",
});
db.shippingTransportModeCourier.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

db.createShippingAlert.hasMany(db.shippingAlertHistory, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlertHistory",
  onDelete: "RESTRICT",
});
db.shippingAlertHistory.belongsTo(db.createShippingAlert, {
  foreignKey: "shipping_alert_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.shippingAlertHistory, {
  foreignKey: "employee_id",
  as: "userDetail",
  onDelete: "RESTRICT",
});
db.shippingAlertHistory.belongsTo(db.user, {
  foreignKey: "employee_id",
  as: "userDetail",
  onDelete: "RESTRICT",
});

db.portMaster.hasOne(db.createShippingAlert, {
  foreignKey: "port_id",
  as: "shippingAlertTransMode",
  onDelete: "RESTRICT",
});
db.createShippingAlert.belongsTo(db.portMaster, {
  foreignKey: "port_id",
  as: "shippingAlert",
  onDelete: "RESTRICT",
});

db.createShippingAlert.hasOne(db.shippingBOEDetails, {
  foreignKey: "shipping_alert_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.shippingBOEDetails, {
  foreignKey: "lastUpdatedBy",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.shippingTransportModeRoad, {
  foreignKey: "lastUpdatedBy",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.shippingTransportModeCourier, {
  foreignKey: "lastUpdatedBy",
  onDelete: "RESTRICT",
});

//////////////////////////////////////// document type foreign key will be listed here ///////////////////
db.entityMaster.hasMany(db.documentType, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.documentType.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

///////////////////////////
/////////sales order
/////////////////

db.salesOrder = require("../SalesManagement/salesInvoice/model/salesOrder.js")(
  sequelize,
  Sequelize,
);
db.salesOrderItemList =
  require("../SalesManagement/salesInvoice/model/salesOrderItems.js")(
    sequelize,
    Sequelize,
  );
db.salesOrderPOItemList =
  require("../SalesManagement/salesInvoice/model/salesOrder_PO_Items.js")(
    sequelize,
    Sequelize,
  );
db.salesBooking =
  require("../SalesManagement/salesInvoice/model/salesBooking.js")(
    sequelize,
    Sequelize,
  );
db.salesBookingItem =
  require("../SalesManagement/salesInvoice/model/salesBookingItem.js")(
    sequelize,
    Sequelize,
  );
db.salesBookingDocs =
  require("../SalesManagement/salesInvoice/model/salesBookingDoc.js")(
    sequelize,
    Sequelize,
  );
///////////////////////////
/////////sales delivery challan
/////////////////
db.sales_delivery_challan =
  require("../CRM/DeliveryChalaan/model/deliveryChallanModel.js")(
    sequelize,
    Sequelize,
  );
db.sales_delivery_challan_returnable_item =
  require("../CRM/DeliveryChalaan/model/deliveryChallanReturnableItem.js")(
    sequelize,
    Sequelize,
  );
db.sales_delivery_challan_item =
  require("../CRM/DeliveryChalaan/model/deliveryChallanItem.js")(
    sequelize,
    Sequelize,
  );

///// Transaction ///////////////////////
db.paymentAdvice =
  require("../Finance_And_Accounting/PaymentAdvice/model/paymentAdvice.js")(
    sequelize,
    Sequelize,
  );
db.paymentAdviceAccount =
  require("../Finance_And_Accounting/PaymentAdvice/model/paymentAdviceAccount.js")(
    sequelize,
    Sequelize,
  );
db.bankReciept =
  require("../Finance_And_Accounting/BankReciept/model/bankReciept.js")(
    sequelize,
    Sequelize,
  );
db.bankRecieptAccount =
  require("../Finance_And_Accounting/BankReciept/model/bankRecieptAccount.js")(
    sequelize,
    Sequelize,
  );
db.paymentAdviceDoc =
  require("../Finance_And_Accounting/PaymentAdvice/model/paymentAdviceDoc.js")(
    sequelize,
    Sequelize,
  );
db.bankRecieptDoc =
  require("../Finance_And_Accounting/BankReciept/model/bankRecieptDocument.js")(
    sequelize,
    Sequelize,
  );
db.bankPayment =
  require("../Finance_And_Accounting/BankPayment/model/bankPayment.js")(
    sequelize,
    Sequelize,
  );
db.bankPaymentAccount =
  require("../Finance_And_Accounting/BankPayment/model/bankPaymentAccount.js")(
    sequelize,
    Sequelize,
  );
db.bankPaymentDoc =
  require("../Finance_And_Accounting/BankPayment/model/bankPaymentDocument.js")(
    sequelize,
    Sequelize,
  );
db.salesJournal =
  require("../Finance_And_Accounting/SalesJournal/model/salesJournal.js")(
    sequelize,
    Sequelize,
  );
db.salesJournalAccount =
  require("../Finance_And_Accounting/SalesJournal/model/salesJournalAccount.js")(
    sequelize,
    Sequelize,
  );
db.purchaseJournal =
  require("../Finance_And_Accounting/PurchaseJournal/model/purchaseJournal.js")(
    sequelize,
    Sequelize,
  );
db.purchaseJournalAccount =
  require("../Finance_And_Accounting/PurchaseJournal/model/purchaseJournalAccount.js")(
    sequelize,
    Sequelize,
  );
db.additionalCharge =
  require("../master/additional-charge/model/additionalModel.js")(
    sequelize,
    Sequelize,
  );

db.cashReciept =
  require("../Finance_And_Accounting/CashReciept/model/cashReciept.js")(
    sequelize,
    Sequelize,
  );
db.cashRecieptAccount =
  require("../Finance_And_Accounting/CashReciept/model/cashRecieptAccount.js")(
    sequelize,
    Sequelize,
  );
db.cashRecieptDoc =
  require("../Finance_And_Accounting/CashReciept/model/cashRecieptDocument.js")(
    sequelize,
    Sequelize,
  );

db.cashPayment =
  require("../Finance_And_Accounting/cashPayment/model/cashPayment.js")(
    sequelize,
    Sequelize,
  );
db.cashPaymentAccount =
  require("../Finance_And_Accounting/cashPayment/model/cashPaymentAccount.js")(
    sequelize,
    Sequelize,
  );
db.cashPaymentDoc =
  require("../Finance_And_Accounting/cashPayment/model/cashPaymentDocument.js")(
    sequelize,
    Sequelize,
  );
db.serviceVoucher =
  require("../Finance_And_Accounting/serviceVoucher/model/serviceVouchermodel.js")(
    sequelize,
    Sequelize,
  );
db.serviceVoucherList =
  require("../Finance_And_Accounting/serviceVoucher/model/serviceVoucherListmodel.js")(
    sequelize,
    Sequelize,
  );
db.paymentProgram =
  require("../Finance_And_Accounting/paymentProgram/model/paymentProgram.js")(
    sequelize,
    Sequelize,
  );
db.paymentProgramList =
  require("../Finance_And_Accounting/paymentProgram/model/paymentProgramList.js")(
    sequelize,
    Sequelize,
  );

///////////////////////////////////   TDS //////////////

db.tds = require("../master/TDS/model/TDS.js")(sequelize, Sequelize);
db.tdsList = require("../master/TDS/model/TDSList.js")(sequelize, Sequelize);
db.vendorTDS = require("../vendor/model/vendorTDS.js")(sequelize, Sequelize);
db.glMappingTransactions =
  require("../master/TDS/model/GLMappingTransaction.js")(sequelize, Sequelize);

db.costProfitCenterType =
  require("../master/costProfitCenterType/model/costProfitType.js")(
    sequelize,
    Sequelize,
  );
// Gst gl acc mapping
db.gstGlAccountMapping =
  require("../master/gst-gl-account-mapping/model/gstGlAccountMappingModel.js")(
    sequelize,
    Sequelize,
  );
db.gstType = require("../master/gst-gl-account-mapping/model/gstTypeModel.js")(
  sequelize,
  Sequelize,
);
db.mapSalesAccount =
  require("../master/gst-gl-account-mapping/model/mapSalesAccountModel.js")(
    sequelize,
    Sequelize,
  );
// Travel Type
db.TravelType =
  require("../../app/master/travel-master/model/travel-type.model.js")(
    sequelize,
    Sequelize,
  );
db.MASTER_TRAVEL_BUDGET_LIMIT =
  require("../../app/master/travel-master/model/travel-budget-limit.js")(
    sequelize,
    Sequelize,
  );
db.MASTER_TRAVEL_LOCAL_BUDGET =
  require("../../app/master/travel-master/model/travel-local-budget-limit.js")(
    sequelize,
    Sequelize,
  );
db.MASTER_TRAVEL_DOMESTIC_BUDGET =
  require("../../app/master/travel-master/model/travel-domestic-budget-limit.js")(
    sequelize,
    Sequelize,
  );
db.MASTER_REIMBURSEMENT_BUDGET =
  require("../../app/master/travel-master/model/reimbursement-budget.model.js")(
    sequelize,
    Sequelize,
  );

db.vendorRecordPayment =
  require("../Finance_And_Accounting/vendorRecordPayment/model/vendorRecordPayment.js")(
    sequelize,
    Sequelize,
  );
db.vendorRecordPaymentAccount =
  require("../Finance_And_Accounting/vendorRecordPayment/model/RecordPaymentChartOfAccount.js")(
    sequelize,
    Sequelize,
  );
db.customerRecordPayment =
  require("../Finance_And_Accounting/customerRecordPayment/model/customerRecordPayment.js")(
    sequelize,
    Sequelize,
  );

db.customerRecordPaymentAccount =
  require("../Finance_And_Accounting/customerRecordPayment/model/customerPaymentChartOfAccount.js")(
    sequelize,
    Sequelize,
  );
db.adjustmentJournal =
  require("../Finance_And_Accounting/adjustmentJournal/model/adjustmentModel.js")(
    sequelize,
    Sequelize,
  );
db.adjustmentJournalList =
  require("../Finance_And_Accounting/adjustmentJournal/model/adjustmentModelList.js")(
    sequelize,
    Sequelize,
  );
db.adjustmentJournalDocument =
  require("../Finance_And_Accounting/adjustmentJournal/model/adjustmentDocument.js")(
    sequelize,
    Sequelize,
  );
// New RBAC SYSTEM UPDATED FROM HERE
db.HRMS_RBAC_MODULE_MASTER =
  require("../HRMS/RBAC/rbac.module.permissions/model/Rbac_Module_master.js")(
    sequelize,
    Sequelize,
  );
db.HRMS_RBAC_ROLE_PERMISSION =
  require("../HRMS/RBAC/rbac.module.permissions/model/Rbac_Role_Permisions.js")(
    sequelize,
    Sequelize,
  );
db.HRMS_RBAC_USER_PERMISSION =
  require("../HRMS/RBAC/rbac.module.permissions/model/Rbac_User_Permissions.js")(
    sequelize,
    Sequelize,
  );

// RBAC Module Master Self-Relation (Fixed)

db.transportVoucher =
  require("../Finance_And_Accounting/TransportVoucher/Models/TransportModel.js")(
    sequelize,
    Sequelize,
  );
db.transportVoucherList =
  require("../Finance_And_Accounting/TransportVoucher/Models/TransportModelList.js")(
    sequelize,
    Sequelize,
  );

db.customerItemMapping =
  require("../../app/master/Customer/model/customerItemMapping.js")(
    sequelize,
    Sequelize,
  );
db.bankClearence =
  require("../Finance_And_Accounting/bankClearence/model/bankClearence.js")(
    sequelize,
    Sequelize,
  );
db.salesReturnMst =
  require("../SalesManagement/salesReturn/model/salesReturnMst.js")(
    sequelize,
    Sequelize,
  );
db.salesReturnItem =
  require("../SalesManagement/salesReturn/model/salesReturnItem.js")(
    sequelize,
    Sequelize,
  );
db.suspenseAccountCustomer =
  require("../master/Customer/model/SuspenseAccountCustomer.js")(
    sequelize,
    Sequelize,
  );
db.salesBookingAdvanceAmt =
  require("../SalesManagement/salesInvoice/model/salesBookingAdvanceAmt.js")(
    sequelize,
    Sequelize,
  );
db.salesReturnCharges =
  require("../SalesManagement/salesReturn/model/salesReturnCharges.js")(
    sequelize,
    Sequelize,
  );
db.salesReturnChargesMst =
  require("../SalesManagement/salesReturn/model/salesReturnChargeMst.js")(
    sequelize,
    Sequelize,
  );
db.advanceVendorAmount = require("../vendor/model/AdvanceVendorAmount.js")(
  sequelize,
  Sequelize,
);

db.otpVerificationCustomer =
  require("../master/Customer/model/OtpVerification.js")(sequelize, Sequelize);
db.generateIrn = require("../Warehouse/Einvoice/model/Einvoice.js")(
  sequelize,
  Sequelize,
);

((db.salesOrderItemNew =
  require("../SalesManagement/salesInvoice/model/salesOrderItemsNew.js")(
    sequelize,
    Sequelize,
  )),
  db.ItemMaster.hasMany(db.customerItemMapping, { foreignKey: "item_id" }));
db.customerItemMapping.belongsTo(db.ItemMaster, { foreignKey: "item_id" });
db.customerProfile.hasMany(db.customerItemMapping, {
  foreignKey: "customer_id",
});
db.customerItemMapping.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.HRMS_RBAC_MODULE_MASTER.hasMany(db.HRMS_RBAC_MODULE_MASTER, {
  foreignKey: "parentId",
  as: "children", // ✔ children modules
});

db.HRMS_RBAC_MODULE_MASTER.belongsTo(db.HRMS_RBAC_MODULE_MASTER, {
  foreignKey: "parentId",
  as: "parent", // ✔ parent module
});

// ================= ROLE PERMISSIONS ===================

// MODULE ----< ROLE_PERMISSION
db.HRMS_RBAC_MODULE_MASTER.hasMany(db.HRMS_RBAC_ROLE_PERMISSION, {
  foreignKey: "moduleId",
  as: "rolePermissions",
});

db.HRMS_RBAC_ROLE_PERMISSION.belongsTo(db.HRMS_RBAC_MODULE_MASTER, {
  foreignKey: "moduleId",
  as: "module",
});

// ROLE ----< ROLE_PERMISSION
db.role_master.hasMany(db.HRMS_RBAC_ROLE_PERMISSION, {
  foreignKey: "roleId",
  as: "rolePermissionList", // CHANGED
});

db.HRMS_RBAC_ROLE_PERMISSION.belongsTo(db.role_master, {
  foreignKey: "roleId",
  as: "role",
});

db.entityMaster.hasMany(db.HRMS_RBAC_ROLE_PERMISSION, {
  foreignKey: "entityId",
});

db.HRMS_RBAC_ROLE_PERMISSION.belongsTo(db.entityMaster, {
  foreignKey: "entityId",
});
// ================= USER PERMISSIONS ===================

// MODULE ----< USER_PERMISSION
db.HRMS_RBAC_MODULE_MASTER.hasMany(db.HRMS_RBAC_USER_PERMISSION, {
  foreignKey: "moduleId",
  as: "userPermissions", // CHANGED
});

db.HRMS_RBAC_USER_PERMISSION.belongsTo(db.HRMS_RBAC_MODULE_MASTER, {
  foreignKey: "moduleId",
  as: "module",
});

// USER ----< USER_PERMISSION
db.user.hasMany(db.HRMS_RBAC_USER_PERMISSION, {
  foreignKey: "userId",
  as: "userPermissionList", // CHANGED
});

db.HRMS_RBAC_USER_PERMISSION.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

// New RBAC SYSTEM UPDATED FROM HERE

// Third Party Module Start
db.ORG_TYPE_MASTER =
  require("../../src/app/third-party/models/org-type-master.js")(
    sequelize,
    Sequelize,
  );
db.THIRD_PARTY_ORGANIZATION =
  require("../../src/app/third-party/models/organization.models.js")(
    sequelize,
    Sequelize,
  );

db.ORG_TYPE_MASTER.hasMany(db.THIRD_PARTY_ORGANIZATION, {
  foreignKey: "orgTypeId",
  as: "organizationList", // CHANGED
});

db.THIRD_PARTY_ORGANIZATION.belongsTo(db.ORG_TYPE_MASTER, {
  foreignKey: "orgTypeId",
  as: "orgType",
});

db.THIRD_PARTY_ORGANIZATION.hasMany(db.user, {
  foreignKey: "organization_id",
  as: "organizationUserList", // CHANGED
});

db.user.belongsTo(db.THIRD_PARTY_ORGANIZATION, {
  foreignKey: "organization_id",
  as: "organization",
});

// Third Party Module End

// #region Sales Target & Achievement Module Start

db.salesTarget =
  require("../../app/sales-target-achievement/model/salestarget_model.js")(
    sequelize,
    Sequelize,
  );
db.salesTargetMapping =
  require("../../app/sales-target-achievement/model/salestargetmapping_model.js")(
    sequelize,
    Sequelize,
  );

db.user.hasMany(db.salesTarget, {
  foreignKey: "reporting_manager_id",
  onDelete: "RESTRICT",
});
db.salesTarget.belongsTo(db.user, {
  foreignKey: "reporting_manager_id",
  as: "reportingManagerUser",
});
db.user.hasMany(db.salesTarget, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});
db.salesTarget.belongsTo(db.user, {
  foreignKey: "createdBy",
  as: "createdByUser",
});
db.user.hasMany(db.salesTarget, {
  foreignKey: "approvedRejectedBy",
  onDelete: "RESTRICT",
});
db.salesTarget.belongsTo(db.user, {
  foreignKey: "approvedRejectedBy",
  as: "approvedByUser",
});
db.entityMaster.hasMany(db.salesTarget, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.salesTarget.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.financial_year.hasMany(db.salesTarget, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.salesTarget.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.salesTarget.hasMany(db.salesTargetMapping, {
  foreignKey: "sales_target_id",
  onDelete: "RESTRICT",
});
db.salesTargetMapping.belongsTo(db.salesTarget, {
  foreignKey: "sales_target_id",
});
db.user.hasMany(db.salesTargetMapping, {
  foreignKey: "sales_employee_id",
  onDelete: "RESTRICT",
});
db.salesTargetMapping.belongsTo(db.user, {
  foreignKey: "sales_employee_id",
  as: "salesUser",
});

// #endregion Sales Target & Achievement Module End

// #region Installation Kit BOM Module

db.BOM_KIT_GROUP =
  require("../../app/master/BomKitMaster/models/bomkitgroupModel.js")(
    sequelize,
    Sequelize,
  );
db.BOM_KIT_MASTER =
  require("../../app/master/BomKitMaster/models/bomkitmasterModel.js")(
    sequelize,
    Sequelize,
  );
db.BOM_KIT_ITEM =
  require("../../app/master/BomKitMaster/models/bomkititemModel.js")(
    sequelize,
    Sequelize,
  );
db.BOM_KIT_SUBSTITUTE_ITEM =
  require("../../app/master/BomKitMaster/models/bomkitsubstituteitemModel.js")(
    sequelize,
    Sequelize,
  );

db.entityMaster.hasMany(db.BOM_KIT_GROUP, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.BOM_KIT_GROUP.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  as: "entityMaster",
});

db.BOM_KIT_GROUP.hasMany(db.BOM_KIT_MASTER, {
  foreignKey: "bom_group_id",
  onDelete: "RESTRICT",
  as: "bomMasters",
});
db.BOM_KIT_MASTER.belongsTo(db.BOM_KIT_GROUP, {
  foreignKey: "bom_group_id",
  as: "bomGroup",
});
db.hsn_sac_master.hasMany(db.BOM_KIT_MASTER, {
  foreignKey: "hsn_id",
  onDelete: "RESTRICT",
});
db.BOM_KIT_MASTER.belongsTo(db.hsn_sac_master, {
  foreignKey: "hsn_id",
  as: "hsnCode",
});
db.user.hasMany(db.BOM_KIT_MASTER, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.BOM_KIT_MASTER.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "createUser",
});
db.user.hasMany(db.BOM_KIT_MASTER, {
  foreignKey: "approved_by",
  onDelete: "RESTRICT",
});
db.BOM_KIT_MASTER.belongsTo(db.user, {
  foreignKey: "approved_by",
  as: "approveUser",
});
db.financial_year.hasMany(db.BOM_KIT_MASTER, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.BOM_KIT_MASTER.belongsTo(db.financial_year, {
  foreignKey: "financial_id",
  as: "financeialMaster",
});

db.BOM_KIT_MASTER.hasMany(db.BOM_KIT_ITEM, {
  foreignKey: "bom_id",
  onDelete: "RESTRICT",
  as: "bomItems",
});
db.BOM_KIT_ITEM.belongsTo(db.BOM_KIT_MASTER, {
  foreignKey: "bom_id",
  as: "bomMaster",
});
db.ItemMaster.hasMany(db.BOM_KIT_ITEM, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.BOM_KIT_ITEM.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
  as: "itemMaster",
});

db.BOM_KIT_ITEM.hasMany(db.BOM_KIT_SUBSTITUTE_ITEM, {
  foreignKey: "bom_item_id",
  onDelete: "RESTRICT",
  as: "substituteItems",
});
db.BOM_KIT_SUBSTITUTE_ITEM.belongsTo(db.BOM_KIT_ITEM, {
  foreignKey: "bom_item_id",
  as: "bomItem",
});
db.ItemMaster.hasMany(db.BOM_KIT_SUBSTITUTE_ITEM, {
  foreignKey: "substitute_item_id",
  onDelete: "RESTRICT",
});
db.BOM_KIT_SUBSTITUTE_ITEM.belongsTo(db.ItemMaster, {
  foreignKey: "substitute_item_id",
  as: "itemSubstitute",
});

// #endregion Installation Kit BOM Module

// #region Installation Kit BOM Sales CRM
db.SALESCRM_BOM_KIT =
  require("../../app/CRM/CreateProposal/model/proposalBomKit.js")(
    sequelize,
    Sequelize,
  );
db.SALESCRM_BOM_KIT_ITEM =
  require("../../app/CRM/CreateProposal/model/proposalBomKitItem.js")(
    sequelize,
    Sequelize,
  );

db.SALESCRM_BOM_KIT_INSTANCE =
  require("../../app/CRM/CreateProposal/model/proposalBomKitInstance.js")(
    sequelize,
    Sequelize,
  );
db.SALESCRM_BOM_KIT_INSTANCE_ITEM =
  require("../../app/CRM/CreateProposal/model/proposalBomKItInstanceItem.js")(
    sequelize,
    Sequelize,
  );

db.proposalList.hasMany(db.SALESCRM_BOM_KIT, {
  foreignKey: "item_list_id",
  onDelete: "RESTRICT",
  as: "proposalBom",
});
db.SALESCRM_BOM_KIT.belongsTo(db.proposalList, {
  foreignKey: "item_list_id",
  as: "proposal",
});
db.BOM_KIT_MASTER.hasMany(db.SALESCRM_BOM_KIT, {
  foreignKey: "bom_id",
  onDelete: "RESTRICT",
  as: "salesBom",
});
db.SALESCRM_BOM_KIT.belongsTo(db.BOM_KIT_MASTER, {
  foreignKey: "bom_id",
  as: "bomData",
});

db.SALESCRM_BOM_KIT.hasMany(db.SALESCRM_BOM_KIT_ITEM, {
  foreignKey: "sc_bom_id",
  onDelete: "RESTRICT",
  as: "items",
});
db.SALESCRM_BOM_KIT_ITEM.belongsTo(db.SALESCRM_BOM_KIT, {
  foreignKey: "sc_bom_id",
  as: "bom",
});
db.BOM_KIT_ITEM.hasMany(db.SALESCRM_BOM_KIT_ITEM, {
  foreignKey: "bom_item_id",
  onDelete: "RESTRICT",
  as: "salesItems",
});
db.SALESCRM_BOM_KIT_ITEM.belongsTo(db.BOM_KIT_ITEM, {
  foreignKey: "bom_item_id",
  as: "bomItem",
});
db.BOM_KIT_SUBSTITUTE_ITEM.hasMany(db.SALESCRM_BOM_KIT_ITEM, {
  foreignKey: "bom_subitem_id",
  onDelete: "RESTRICT",
  as: "salesSubstituteItems",
});
db.SALESCRM_BOM_KIT_ITEM.belongsTo(db.BOM_KIT_SUBSTITUTE_ITEM, {
  foreignKey: "bom_subitem_id",
  as: "substituteItem",
});

db.SALESCRM_BOM_KIT.hasMany(db.SALESCRM_BOM_KIT_INSTANCE, {
  foreignKey: "bom_kit_id",
  onDelete: "RESTRICT",
  as: "instances",
});
db.SALESCRM_BOM_KIT_INSTANCE.belongsTo(db.SALESCRM_BOM_KIT, {
  foreignKey: "bom_kit_id",
  as: "bomKit",
});

db.SALESCRM_BOM_KIT_INSTANCE.hasMany(db.SALESCRM_BOM_KIT_INSTANCE_ITEM, {
  foreignKey: "instance_id",
  onDelete: "RESTRICT",
  as: "instanceItems",
});
db.SALESCRM_BOM_KIT_INSTANCE_ITEM.belongsTo(db.SALESCRM_BOM_KIT_INSTANCE, {
  foreignKey: "instance_id",
  as: "instance",
});

db.SALESCRM_BOM_KIT_ITEM.hasMany(db.SALESCRM_BOM_KIT_INSTANCE_ITEM, {
  foreignKey: "bom_item_id",
  onDelete: "RESTRICT",
  as: "instanceItems",
});
db.SALESCRM_BOM_KIT_INSTANCE_ITEM.belongsTo(db.SALESCRM_BOM_KIT_ITEM, {
  foreignKey: "bom_item_id",
  as: "bomItem",
});

db.ItemMaster.hasMany(db.SALESCRM_BOM_KIT_INSTANCE_ITEM, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
  as: "instanceItems",
});
db.SALESCRM_BOM_KIT_INSTANCE_ITEM.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
  as: "item",
});
// #endregion Installation Kit BOM Sales CRM

// #region Inventory Management Module Start
db.inventory_stock =
  require("../../app/inventory_management/model/InventoryStock.js")(
    sequelize,
    Sequelize,
  );
db.inventory_ledger =
  require("../../app/inventory_management/model/InventoryLedger.js")(
    sequelize,
    Sequelize,
  );
// Inventory Management Module Start
db.inventory_stock =
  require("../../app/inventory_management/model/InventoryStock.js")(
    sequelize,
    Sequelize,
  );
db.inventory_ledger =
  require("../../app/inventory_management/model/InventoryLedger.js")(
    sequelize,
    Sequelize,
  );

db.financial_year.hasMany(db.inventory_stock, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.inventory_stock.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
db.entityMaster.hasMany(db.inventory_stock, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.inventory_stock.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.warehouse.hasMany(db.inventory_stock, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.inventory_stock.belongsTo(db.warehouse, { foreignKey: "warehouse_id" });
db.ItemMaster.hasMany(db.inventory_stock, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.inventory_stock.belongsTo(db.ItemMaster, { foreignKey: "item_id" });

db.financial_year.hasMany(db.inventory_ledger, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.inventory_ledger.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
db.entityMaster.hasMany(db.inventory_ledger, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.inventory_ledger.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.warehouse.hasMany(db.inventory_ledger, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.inventory_ledger.belongsTo(db.warehouse, { foreignKey: "warehouse_id" });
db.ItemMaster.hasMany(db.inventory_ledger, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.inventory_ledger.belongsTo(db.ItemMaster, { foreignKey: "item_id" });
db.user.hasMany(db.inventory_ledger, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.inventory_ledger.belongsTo(db.user, { foreignKey: "created_by" });

// #endregion Inventory Management Module End

/////////////////////////////////
////////// here foreign key for set proposal approvel workflow
/////////////////
db.proposalData.hasMany(db.proposalApprovel, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.proposalData, { foreignKey: "proposal_id" });

db.user.hasMany(db.proposalData, {
  foreignKey: "created_by_id",
  as: "createdByData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.user, {
  foreignKey: "created_by_id",
  as: "createdByData",
});
db.leadSource.hasMany(db.proposalData, {
  foreignKey: "lead_source_id",
  as: "leadOfSourceData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.leadSource, {
  foreignKey: "lead_source_id",
  as: "leadOfSourceData",
});
db.financial_year.hasMany(db.leadSource, {
  foreignKey: "financial_year_id",
  as: "financialData",
  onDelete: "RESTRICT",
});
db.leadSource.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
  as: "financialData",
});
db.entityMaster.hasMany(db.leadSource, {
  foreignKey: "entity_id",
  as: "entityData",
  onDelete: "RESTRICT",
});
db.leadSource.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  as: "entityData",
});

db.deliveryTermAndUnloading.hasMany(db.proposalData, {
  foreignKey: "delivery_term_id",
  as: "deliveryTermData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.deliveryTermAndUnloading, {
  foreignKey: "delivery_term_id",
  as: "deliveryTermData",
});

db.proposalData.hasMany(db.discountDetails, {
  foreignKey: "proposal_id",
  as: "discountProposalData",
  onDelete: "RESTRICT",
});
db.discountDetails.belongsTo(db.proposalData, {
  foreignKey: "proposal_id",
  as: "discountProposalData",
});
db.versionData.hasMany(db.discountDetails, {
  foreignKey: "version_id",
  as: "proposalVersionData",
  onDelete: "RESTRICT",
});
db.discountDetails.belongsTo(db.versionData, {
  foreignKey: "version_id",
  as: "proposalVersionData",
});

db.grossDiscountMaster.hasMany(db.discountDetails, {
  foreignKey: "gross_discount_id",
  onDelete: "RESTRICT",
});

db.proposalData.hasMany(db.grossDiscountBreakup, {
  foreignKey: "proposal_id",
  onDelete: "CASCADE",
});
db.grossDiscountBreakup.belongsTo(db.proposalData, {
  foreignKey: "proposal_id",
});
db.versionData.hasMany(db.grossDiscountBreakup, {
  foreignKey: "version_id",
  onDelete: "CASCADE",
});
db.grossDiscountBreakup.belongsTo(db.versionData, { foreignKey: "version_id" });
db.proposalList.hasMany(db.grossDiscountBreakup, {
  foreignKey: "proposal_list_id",
  onDelete: "CASCADE",
});
db.grossDiscountBreakup.belongsTo(db.proposalList, {
  foreignKey: "proposal_list_id",
});
db.grossDiscountMaster.hasMany(db.grossDiscountBreakup, {
  foreignKey: "gross_discount_id",
  onDelete: "CASCADE",
});
db.grossDiscountBreakup.belongsTo(db.grossDiscountMaster, {
  foreignKey: "gross_discount_id",
});

db.deliveryTermAndUnloading.hasMany(db.proposalData, {
  foreignKey: "unloading_resp_id",
  as: "unloadingRespData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.deliveryTermAndUnloading, {
  foreignKey: "unloading_resp_id",
  as: "unloadingRespData",
});

db.paymentMainCategory.hasMany(db.proposalData, {
  foreignKey: "payment_main_id",
  as: "paymentMainCatData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.paymentMainCategory, {
  foreignKey: "payment_main_id",
  as: "paymentMainCatData",
});

db.paymentMainCategory.hasMany(db.paymentDetails, {
  foreignKey: "payment_id",
  onDelete: "RESTRICT",
});
db.paymentDetails.belongsTo(db.paymentMainCategory, {
  foreignKey: "payment_id",
});
db.proposalData.hasMany(db.paymentDetails, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.discountDetails.belongsTo(db.proposalData, { foreignKey: "proposal_id" });
db.versionData.hasMany(db.paymentDetails, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.discountDetails.belongsTo(db.versionData, { foreignKey: "version_id" });

db.paymentMainSubCategory.hasMany(db.proposalData, {
  foreignKey: "sub_payment_main_id",
  as: "SubPaymentMainData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.paymentMainSubCategory, {
  foreignKey: "sub_payment_main_id",
  as: "SubPaymentMainData",
});

db.crm_freight.hasMany(db.proposalData, {
  foreignKey: "freight_id",
  as: "freightData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.crm_freight, {
  foreignKey: "freight_id",
  as: "freightData",
});

db.crm_insurance.hasMany(db.proposalData, {
  foreignKey: "insurance_id",
  as: "insuranceData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.crm_insurance, {
  foreignKey: "insurance_id",
  as: "insuranceData",
});

db.locationMaster.hasMany(db.proposalData, {
  foreignKey: "location_id",
  as: "locationData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.locationMaster, {
  foreignKey: "location_id",
  as: "locationData",
});

db.warehouse.hasMany(db.proposalData, {
  foreignKey: "warehouse_id",
  as: "warehouseData",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouseData",
});

//--------------------
db.salesBooking.hasMany(db.credit_limit_approval_workflow, {
  foreignKey: "sales_booking_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.credit_limit_approval_workflow, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.versionData.hasMany(db.credit_limit_approval_workflow, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.sanctionCreditLimit.hasMany(db.credit_limit_approval_workflow, {
  foreignKey: "sanction_credit_id",
  onDelete: "RESTRICT",
});
db.customer_category.hasMany(db.sanctionCreditLimit, {
  foreignKey: "customer_category_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.credit_limit_approval_workflow, {
  foreignKey: "reporting_manager_id",
  onDelete: "RESTRICT",
});
db.credit_limit_approval_workflow.belongsTo(db.user, {
  foreignKey: "reporting_manager_id",
  as: "reportingManager",
});
db.user.hasMany(db.credit_limit_approval_workflow, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.credit_limit_approval_workflow.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "createdBy",
});
db.level_master.hasMany(db.credit_limit_approval_workflow, {
  foreignKey: "level_id",
  onDelete: "RESTRICT",
});
db.credit_limit_approval_workflow.belongsTo(db.level_master, {
  foreignKey: "level_id",
});

db.level_master.hasMany(db.creditLimit, {
  foreignKey: "level_id",
  onDelete: "RESTRICT",
});
db.creditLimit.belongsTo(db.level_master, { foreignKey: "level_id" });

// quotationApproval.js
db.quotationApproval.hasMany(db.quotationApprovalDetails, {
  foreignKey: "quotationApprovalId",
  as: "details",
});
// // quotationApprovalDetails.js
db.quotationApprovalDetails.belongsTo(db.quotationApproval, {
  foreignKey: "quotationApprovalId",
  as: "approval",
});

db.level_master.hasMany(db.quotationApprovalDetails, {
  foreignKey: "level_id",
  as: "quotationLevel",
});
db.quotationApprovalDetails.belongsTo(db.level_master, {
  foreignKey: "level_id",
  as: "quotationLevel",
});

db.SubCategory.hasMany(db.quotationApprovalDetails, {
  foreignKey: "sub_category_id",
  as: "subCategoryLevel",
});
db.quotationApprovalDetails.belongsTo(db.SubCategory, {
  foreignKey: "sub_category_id",
  as: "subCategoryLevel",
});
// gst gl account mapping

db.createChartOfAccounts.hasMany(db.gstGlAccountMapping, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.gstGlAccountMapping.belongsTo(db.createChartOfAccounts, {
  foreignKey: "chart_account_id",
});

db.gstType.hasMany(db.gstGlAccountMapping, {
  foreignKey: "gst_type_id",
  onDelete: "RESTRICT",
});
db.gstGlAccountMapping.belongsTo(db.gstType, { foreignKey: "gst_type_id" });

db.entityMaster.hasMany(db.gstGlAccountMapping, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.gstGlAccountMapping.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.createChartOfAccounts.hasMany(db.mapSalesAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.mapSalesAccount.belongsTo(db.createChartOfAccounts, {
  foreignKey: "chart_account_id",
});

db.entityMaster.hasMany(db.mapSalesAccount, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.mapSalesAccount.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.proposalData.hasMany(db.addtionalContactDetails, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
  as: "additionalContactDetails",
});
db.addtionalContactDetails.belongsTo(db.proposalData, {
  foreignKey: "proposal_id",
  as: "additionalContactDetails",
});

db.proposalData.hasMany(db.proposal_documents, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.versionData.hasMany(db.proposal_documents, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});

db.customerProfile.hasMany(db.proposalData, {
  foreignKey: "parent_customer_id",
  onDelete: "RESTRICT",
  as: "proposals", // 👈 alias
});

db.proposalData.belongsTo(db.customerAddressContact, {
  foreignKey: "contact_person_id",
  as: "contactPerson",
});
db.customerAddressContact.hasMany(db.proposalData, {
  foreignKey: "contact_person_id",
  onDelete: "RESTRICT",
  as: "contactPerson", // 👈 alias
});

db.user.hasMany(db.user_sessions, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_activity_logs, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});

db.proposalData.belongsTo(db.customerProfile, {
  foreignKey: "parent_customer_id",
  as: "parentCustomer",
});
db.financial_year.hasMany(db.proposalApprovel, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.financial_year, {
  foreignKey: "financial_id",
});

db.entityMaster.hasMany(db.proposalApprovel, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.user.hasMany(db.proposalApprovel, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.user, { foreignKey: "employee_id" });

db.department.hasMany(db.proposalApprovel, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.department, { foreignKey: "department_id" });

db.role_master.hasMany(db.proposalApprovel, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.role_master, { foreignKey: "role_id" });

db.WorkFlow_Master.hasMany(db.proposalApprovel, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.WorkFlow_Master, {
  foreignKey: "workflow_id",
});

db.versionData.hasMany(db.proposalApprovel, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.versionData, { foreignKey: "version_id" });

db.quotationApprovalDetails.hasMany(db.proposalApprovel, {
  foreignKey: "qa_detail_id",
  onDelete: "RESTRICT",
});
db.proposalApprovel.belongsTo(db.quotationApprovalDetails, {
  foreignKey: "qa_detail_id",
});

////********************* sales order foreign key ***************
/////////////////////////
//////////////////SALES REUTNR
///////////////////////////

db.entityMaster.hasMany(db.salesReturnMst, {
  foreignKey: "entity_id",
  as: "SALES_RETURN_ENTITY",
  onDelete: "RESTRICT",
});
db.salesReturnMst.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  as: "ENTITY_MASTER",
  onDelete: "RESTRICT",
});

db.financial_year.hasMany(db.salesReturnMst, {
  foreignKey: "financial_id",
  as: "SALES_RETURN_FINANCIAL_YEAR",
  onDelete: "RESTRICT",
});
db.salesReturnMst.belongsTo(db.financial_year, {
  foreignKey: "financial_id",
  as: "FINANCIAL_YEAR",
  onDelete: "RESTRICT",
});

db.salesOrder.hasMany(db.salesReturnMst, {
  foreignKey: "sales_order_id",
  as: "SALES_ORDER_RETURNS",
  onDelete: "RESTRICT",
});
db.salesReturnMst.belongsTo(db.salesOrder, {
  foreignKey: "sales_order_id",
  as: "SALES_ORDER",
  onDelete: "RESTRICT",
});

db.customerProfile.hasMany(db.salesReturnMst, {
  foreignKey: "customer_id",
  as: "CUSTOMER_RETURNS",
  onDelete: "RESTRICT",
});
db.salesReturnMst.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
  as: "CUSTOMER",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.salesReturnMst, {
  foreignKey: "created_by_id",
  as: "CREATED_SALES_RETURNS",
  onDelete: "RESTRICT",
});
db.salesReturnMst.belongsTo(db.user, {
  foreignKey: "created_by_id",
  as: "CREATED_BY",
  onDelete: "RESTRICT",
});

//
// SALES RETURN ITEMS RELATIONS
//

db.salesReturnMst.hasMany(db.salesReturnItem, {
  foreignKey: "sales_return_id",
  as: "SALES_RETURN_ITEMS",
  onDelete: "RESTRICT",
});
db.salesReturnItem.belongsTo(db.salesReturnMst, {
  foreignKey: "sales_return_id",
  as: "SALES_RETURN",
  onDelete: "RESTRICT",
});

db.ItemMaster.hasMany(db.salesReturnItem, {
  foreignKey: "item_id",
  as: "ITEM_RETURN_LIST",
  onDelete: "RESTRICT",
});
db.salesReturnItem.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
  as: "ITEM_MASTER",
  onDelete: "RESTRICT",
});
//
db.salesOrderItemNew.hasMany(db.salesReturnItem, {
  foreignKey: "so_item_id",
  as: "soReturnItemList",
  onDelete: "RESTRICT",
});
db.salesReturnItem.belongsTo(db.salesOrderItemNew, {
  foreignKey: "so_item_id",
  as: "soItemList",
  onDelete: "RESTRICT",
});
// SALES RETURN CHARGES RELATIONS
//

db.salesReturnMst.hasMany(db.salesReturnCharges, {
  foreignKey: "sales_return_id",
  as: "SALES_RETURN_CHARGES",
  onDelete: "RESTRICT",
});
db.salesReturnCharges.belongsTo(db.salesReturnMst, {
  foreignKey: "sales_return_id",
  as: "SALES_RETURN",
  onDelete: "RESTRICT",
});

db.city.hasMany(db.salesOrder, {
  foreignKey: "city_id",
  onDelete: "RESTRICT",
  as: "city",
});
db.salesOrder.belongsTo(db.city, { foreignKey: "city_id", as: "city" });
db.customerShippingAddress.hasMany(db.salesOrder, {
  foreignKey: "shipping_address_id",
  onDelete: "RESTRICT",
  as: "shippingAddress",
});
db.salesOrder.belongsTo(db.customerShippingAddress, {
  foreignKey: "shipping_address_id",
  as: "shippingAddress",
});

db.customerAddressContact.hasMany(db.salesOrder, {
  foreignKey: "customer_contact_id",
  onDelete: "RESTRICT",
});
db.salesOrder.belongsTo(db.customerAddressContact, {
  foreignKey: "customer_contact_id",
});

db.proposalData.hasMany(db.salesOrder, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
  as: "proposalData",
});
db.salesOrder.belongsTo(db.proposalData, {
  foreignKey: "proposal_id",
  as: "proposalData",
});

db.versionData.hasMany(db.salesOrder, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.salesOrder.belongsTo(db.versionData, { foreignKey: "version_id" });

db.financial_year.hasMany(db.salesOrder, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.salesOrder.belongsTo(db.financial_year, { foreignKey: "financial_id" });

db.entityMaster.hasMany(db.salesOrder, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.salesOrder.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.customerProfile.hasMany(db.salesOrder, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.salesOrder.belongsTo(db.customerProfile, { foreignKey: "customer_id" });

db.warehouse.hasMany(db.salesOrder, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
  as: "soData",
});
db.salesOrder.belongsTo(db.warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouseData",
});

db.salesOrder.hasMany(db.salesOrderItemList, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemList.belongsTo(db.salesOrder, {
  foreignKey: "sales_order_id",
});

db.salesBooking.hasMany(db.salesOrderItemList, {
  foreignKey: "sales_booking_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemList.belongsTo(db.salesBooking, {
  foreignKey: "sales_booking_id",
});

db.financeProfitCenter.hasMany(db.salesBooking, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
  as: "salesBooking",
});
db.salesBooking.belongsTo(db.financeProfitCenter, {
  foreignKey: "profit_center_id",
  as: "profitCenter",
});

db.cost_center.hasMany(db.salesBooking, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
  as: "salesBooking",
});
db.salesBooking.belongsTo(db.cost_center, {
  foreignKey: "cost_center_id",
  as: "costCenter",
});
db.salesBooking.hasMany(db.salesBookingDocs, {
  foreignKey: "sales_booking_id",
  onDelete: "RESTRICT",
  as: "salesBookingDocs",
});
db.salesBookingDocs.belongsTo(db.salesBooking, {
  foreignKey: "sales_booking_id",
  as: "salesBookingDocs",
});

db.versionData.hasMany(db.salesBooking, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.salesBooking.belongsTo(db.versionData, { foreignKey: "version_id" });

db.asset.hasMany(db.salesOrderItemList, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemList.belongsTo(db.asset, {
  foreignKey: "product_category_id",
});

db.SubCategory.hasMany(db.salesOrderItemList, {
  foreignKey: "product_sub_category_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemList.belongsTo(db.SubCategory, {
  foreignKey: "product_sub_category_id",
});

db.ItemMaster.hasMany(db.salesOrderItemList, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemList.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
});

db.proposal_customisation_type.hasMany(db.salesOrderItemList, {
  foreignKey: "customization_type_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemList.belongsTo(db.proposal_customisation_type, {
  foreignKey: "customization_type_id",
});

db.proposal_branding.hasMany(db.salesOrderItemList, {
  foreignKey: "branding_data_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemList.belongsTo(db.proposal_branding, {
  foreignKey: "branding_data_id",
});

db.salesOrder.hasMany(db.salesOrderPOItemList, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.salesOrderPOItemList.belongsTo(db.salesOrder, {
  foreignKey: "sales_order_id",
});

db.asset.hasMany(db.salesOrderPOItemList, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.salesOrderPOItemList.belongsTo(db.asset, {
  foreignKey: "product_category_id",
});

db.SubCategory.hasMany(db.salesOrderPOItemList, {
  foreignKey: "product_sub_category_id",
  onDelete: "RESTRICT",
});
db.salesOrderPOItemList.belongsTo(db.SubCategory, {
  foreignKey: "product_sub_category_id",
});

db.ItemMaster.hasMany(db.salesOrderPOItemList, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.salesOrderPOItemList.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
});

db.salesOrder.hasMany(db.salesOrderItemNew, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemNew.belongsTo(db.salesOrder, { foreignKey: "sales_order_id" });

db.salesOrderItemNew.hasMany(db.salesOrderItemNew, {
  foreignKey: "parent_item_id",
  as: "child_items",
  onDelete: "RESTRICT",
});
db.salesOrderItemNew.belongsTo(db.salesOrderItemNew, {
  foreignKey: "parent_item_id",
  as: "parent_item",
});

db.ItemMaster.hasMany(db.salesOrderItemNew, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemNew.belongsTo(db.ItemMaster, { foreignKey: "item_id" });

db.branding_master.hasMany(db.salesOrderItemNew, {
  foreignKey: "branding_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemNew.belongsTo(db.branding_master, {
  foreignKey: "branding_id",
});

db.proposalList.hasMany(db.salesOrderItemNew, {
  foreignKey: "item_list_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemNew.belongsTo(db.proposalList, {
  foreignKey: "item_list_id",
});

db.SALESCRM_BOM_KIT.hasMany(db.salesOrderItemNew, {
  foreignKey: "bom_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemNew.belongsTo(db.SALESCRM_BOM_KIT, {
  foreignKey: "bom_id",
});

db.SALESCRM_BOM_KIT_ITEM.hasMany(db.salesOrderItemNew, {
  foreignKey: "bom_item_id",
  onDelete: "RESTRICT",
});
db.salesOrderItemNew.belongsTo(db.SALESCRM_BOM_KIT_ITEM, {
  foreignKey: "bom_item_id",
});

////********************* sales order foreign key ***************

/*================================PRICE MASTER=================================== */
db.price_master = require("../master/Price_master/models/price_master.js")(
  sequelize,
  Sequelize,
);
db.priceMasterItem =
  require("../master/Price_master/models/priceMasterItem.js")(
    sequelize,
    Sequelize,
  );
db.price_master.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.price_master, { foreignKey: "entity_id" });

// Asset management Start
db.grnMaster.hasMany(db.assetHistory, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.hasMany(db.assetHistory, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.assetHistory, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.assetHistory, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.assetHistory, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.assetHistory, {
  foreignKey: "assign_by",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.asset_specification, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.hasMany(db.asset_specification, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.asset_documents, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.hasMany(db.asset_documents, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.asset_transfer_note.hasMany(db.assetHistory, {
  foreignKey: "transfer_note_id",
  onDelete: "RESTRICT",
});
db.assetHistory.belongsTo(db.asset_transfer_note, {
  foreignKey: "transfer_note_id",
});
db.grnMaster.hasMany(db.assetHistoryLog, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.hasMany(db.assetHistoryLog, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.assetHistoryLog, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.assetHistoryLog, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.assetHistoryLog, {
  foreignKey: "assign_by",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.assetHistoryLog, {
  foreignKey: "assigned_to",
  onDelete: "RESTRICT",
});
db.assetHistoryLog.belongsTo(db.user, { foreignKey: "assigned_to" });
db.user.hasMany(db.assetHistory, {
  foreignKey: "assigned_to",
  onDelete: "RESTRICT",
});
db.assetHistory.belongsTo(db.user, { foreignKey: "assigned_to" });
db.user.hasMany(db.grnItemStatus, {
  foreignKey: "assigned_to",
  onDelete: "RESTRICT",
});
db.grnItemStatus.belongsTo(db.user, { foreignKey: "assigned_to" });
db.entityMaster.hasMany(db.AssetDisposition, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.AssetDisposition, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.AssetDisposition.hasMany(db.AssetDispositionItem, {
  foreignKey: "disposition_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.AssetDispositionItem, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.AssetDisposition.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "disposition_id",
});
db.financial_And_Account_Journal_List.belongsTo(db.AssetDisposition, {
  foreignKey: "disposition_id",
});
db.grnMaster.hasMany(db.assetRevaluation, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.assetRevaluation, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.assetRevaluation, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.assetHistory, {
  foreignKey: "assigned_from",
  onDelete: "RESTRICT",
});
db.assetHistory.belongsTo(db.user, { foreignKey: "assigned_from" });
db.user.hasMany(db.assetHistoryLog, {
  foreignKey: "assigned_from",
  onDelete: "RESTRICT",
});
db.assetHistoryLog.belongsTo(db.user, { foreignKey: "assigned_from" });

db.user.hasMany(db.asset_transfer_note, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.asset_transfer_note.belongsTo(db.user, { foreignKey: "employee_id" });
db.tbl_branch.hasMany(db.asset_transfer_note, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.asset_transfer_note.belongsTo(db.tbl_branch, { foreignKey: "branch_id" });
db.user.hasMany(db.asset_transfer_note, {
  foreignKey: "assign_by",
  onDelete: "RESTRICT",
});

// ss

db.grnItemStatus.hasMany(db.depreciationCalculationYearLog, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.depreciationCalculationYearLog.belongsTo(db.grnItemStatus, {
  foreignKey: "grn_item_status_id",
});

db.grnItemStatus.hasMany(db.depreciationCalculationMonthLog, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.depreciationCalculationMonthLog.belongsTo(db.grnItemStatus, {
  foreignKey: "grn_item_status_id",
});

db.grnItemStatus.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "grn_status_id",
  onDelete: "RESTRICT",
});
db.financial_And_Account_Journal_List.belongsTo(db.grnItemStatus, {
  foreignKey: "grn_status_id",
});

db.depreciationCalculation.belongsTo(db.calculationMethod, {
  foreignKey: "id",
});
db.calculationMethod.hasMany(db.depreciationCalculation, {
  foreignKey: "id",
});

db.assetMaintenanceMapping.belongsTo(db.assetMaintenance, {
  foreignKey: "maintenanceMappingId",
  targetKey: "id",
});

db.assetMaintenance.hasMany(db.assetMaintenanceMapping, {
  foreignKey: "maintenanceMappingId",
  sourceKey: "id",
});

db.assetMaintenance.hasMany(db.assetMaintenanceRepairCategoryMapping, {
  foreignKey: "asset_maintainance_id",
  onDelete: "RESTRICT",
});
db.assetMaintenanceRepairCategoryMapping.belongsTo(db.assetMaintenance, {
  foreignKey: "asset_maintainance_id",
});
db.repairCategory.hasMany(db.assetMaintenanceRepairCategoryMapping, {
  foreignKey: "repair_category_id",
  onDelete: "RESTRICT",
});
db.assetMaintenanceRepairCategoryMapping.belongsTo(db.repairCategory, {
  foreignKey: "repair_category_id",
});
db.asset.hasMany(db.repairCategory, {
  foreignKey: "aaset_category_id",
  onDelete: "RESTRICT",
});
db.repairCategory.belongsTo(db.asset, {
  foreignKey: "aaset_category_id",
  as: "assetCategory",
});
db.entityMaster.hasMany(db.repairCategory, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
//direct asset associations
db.tbl_branch.hasMany(db.grnMaster, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.hsn_sac_master.hasMany(db.grnMaster, {
  foreignKey: "hsn_code_id",
  onDelete: "RESTRICT",
});
db.AssetStatus.hasMany(db.grnMaster, {
  foreignKey: "asset_status_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.hasMany(db.AssetCompanyDepreciationDailyLog, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.acdl, { foreignKey: "grn_id", onDelete: "RESTRICT" });
db.calculationMethod.hasMany(db.grnMaster, {
  foreignKey: "depreciationMethod",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.asset_inventory, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.asset_inventory, {
  foreignKey: "asset_category_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.asset_inventory, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});

// end

/*============================LEVEL MASTER======================================= */

db.level_master.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.level_master, { foreignKey: "entity_id" });

db.WorkFlow_Map.belongsTo(db.level_master, { foreignKey: "level_type_id" });
db.level_master.hasMany(db.WorkFlow_Map, { foreignKey: "level_type_id" });

db.Work_Flow_range.belongsTo(db.level_master, { foreignKey: "level_type_id" });
db.level_master.hasMany(db.Work_Flow_range, { foreignKey: "level_type_id" });

db.Work_Flow_range.belongsTo(db.tbl_branch, { foreignKey: "branch_id" });
db.tbl_branch.hasMany(db.Work_Flow_range, { foreignKey: "branch_id" });

/*=============================Discount level items====================================== */

db.workFlowItems.belongsTo(db.Work_Flow_range, {
  foreignKey: "workflow_range_id",
});
db.Work_Flow_range.hasMany(db.workFlowItems, {
  foreignKey: "workflow_range_id",
});

db.workFlowItems.belongsTo(db.asset, { foreignKey: "product_category_id" });
db.asset.hasMany(db.workFlowItems, { foreignKey: "product_category_id" });

db.workFlowItems.belongsTo(db.SubCategory, {
  foreignKey: "product_sub_category_id",
});
db.SubCategory.hasMany(db.workFlowItems, {
  foreignKey: "product_sub_category_id",
});

/*=============================STOCKET TRANSFER_NEW====================================== */
db.stockTransfernew =
  require("../inventory_module_management/model/stockTransferModel_New.js")(
    sequelize,
    Sequelize,
  );
db.stockTransferListnew =
  require("../inventory_module_management/model/stockTransferListModel_New.js")(
    sequelize,
    Sequelize,
  );
db.stockTransferSerialnew =
  require("../inventory_module_management/model/stockTransferSerial_New.js")(
    sequelize,
    Sequelize,
  );

db.stockTransfernew.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "createdByUser",
});
db.user.hasMany(db.stockTransfernew, {
  foreignKey: "created_by",
  as: "stockTransfers",
});
db.stockTransfernew.belongsTo(db.warehouse, {
  foreignKey: "source_warehouse_id",
  as: "sourceWarehouse",
});
db.stockTransfernew.belongsTo(db.warehouse, {
  foreignKey: "target_warehouse_id",
  as: "targetWarehouse",
});
db.stockTransfernew.hasMany(db.stockTransferListnew, {
  foreignKey: "stock_transfer_id",
  as: "itemDetails",
});
db.stockTransferListnew.belongsTo(db.stockTransfernew, {
  foreignKey: "stock_transfer_id",
});
db.stockTransferListnew.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
  as: "item",
});
db.ItemMaster.hasMany(db.stockTransferListnew, { foreignKey: "item_id" });
db.stockTransferListnew.hasMany(db.stockTransferSerialnew, {
  foreignKey: "stock_transfer_list_id",
  as: "serialDetails",
});
db.stockTransferSerialnew.belongsTo(db.stockTransferListnew, {
  foreignKey: "stock_transfer_list_id",
});

db.stockTransferSerialnew.belongsTo(db.grnItemStatus, {
  foreignKey: "grn_item_status_id",
  as: "grnItemStatus",
});

db.stockTransferListnew.belongsTo(db.grnItemStatus, {
  foreignKey: "grn_item_status_id",
  as: "grnItemStatus",
});

db.stockTransferListnew.belongsTo(db.salesOrder, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

db.stockTransferListnew.belongsTo(db.salesOrderItemNew, {
  foreignKey: "sales_order_item_id",
  as: "salesOrderItemList",
});

db.Work_Flow_range.belongsTo(db.level_master, { foreignKey: "level_type_id" });
db.level_master.hasMany(db.Work_Flow_range, { foreignKey: "level_type_id" });
// sales delivery challan
db.salesOrder.hasMany(db.sales_delivery_challan, {
  foreignKey: "so_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.salesOrder, { foreignKey: "so_id" });

db.sales_delivery_challan.hasMany(db.sales_delivery_challan_returnable_item, {
  foreignKey: "sales_delivery_challan_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.hasMany(db.sales_delivery_challan_item, {
  foreignKey: "sales_delivery_challan_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.sales_delivery_challan, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.sales_delivery_challan, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.customerProfile.hasMany(db.proposalData, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
  as: "customerData",
});
db.proposalData.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
  as: "customerData",
});

db.perposal_type.hasMany(db.proposalData, {
  foreignKey: "proposal_type_id",
  onDelete: "RESTRICT",
  as: "proposalType",
});
db.proposalData.belongsTo(db.perposal_type, {
  foreignKey: "proposal_type_id",
  as: "proposalType",
});

// ////customer Contact
db.customerProfile.hasMany(db.customerProfile, {
  foreignKey: "dealer_id",
  as: "dealerCustomers",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.customerProfile, {
  foreignKey: "dealer_id",
  as: "dealer",
});

// //// customer Address
db.customerProfile.hasMany(db.customerAddress, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customerAddress.belongsTo(db.customerProfile, { foreignKey: "customer_id" });

db.customerProfile.hasMany(db.customerAddressContact, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customerAddressContact.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.supplyType.hasMany(db.customerProfile, {
  foreignKey: "supply_type",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.supplyType, { foreignKey: "supply_type" });

db.countryss.hasMany(db.customerAddress, {
  foreignKey: "billing_country_id",
  onDelete: "RESTRICT",
});
db.customerAddress.belongsTo(db.countryss, {
  foreignKey: "billing_country_id",
});

db.states.hasMany(db.customerAddress, {
  foreignKey: "billing_state_id",
    sourceKey: "states_id",
  onDelete: "RESTRICT",
});
db.customerAddress.belongsTo(db.states, { foreignKey: "billing_state_id",targetKey: "states_id" });

db.city.hasMany(db.customerAddress, {
  foreignKey: "billing_city_id",
  onDelete: "RESTRICT",
});
db.customerAddress.belongsTo(db.city, { foreignKey: "billing_city_id" });

db.countryss.hasMany(db.customerAddress, {
  foreignKey: "shipping_country_id",
  onDelete: "RESTRICT",
});
db.customerAddress.belongsTo(db.countryss, {
  foreignKey: "shipping_country_id",
});

db.states.hasMany(db.customerAddress, {
  foreignKey: "shipping_state_id",
    sourceKey: "states_id",
  onDelete: "RESTRICT",
});
db.customerAddress.belongsTo(db.states, { foreignKey: "shipping_state_id",targetKey: "states_id" });

db.city.hasMany(db.customerAddress, {
  foreignKey: "shipping_city_id",
  onDelete: "RESTRICT",
});
db.customerAddress.belongsTo(db.city, { foreignKey: "shipping_city_id" });
//////////////////////////////
db.countryss.hasMany(db.sales_delivery_challan, {
  foreignKey: "billing_country_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.countryss, {
  foreignKey: "billing_country_id",
});

db.states.hasMany(db.sales_delivery_challan, {
  foreignKey: "billing_state_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.states, {
  foreignKey: "billing_state_id",
});

db.city.hasMany(db.sales_delivery_challan, {
  foreignKey: "billing_city_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.city, { foreignKey: "billing_city_id" });

db.countryss.hasMany(db.sales_delivery_challan, {
  foreignKey: "shipping_country_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.countryss, {
  foreignKey: "shipping_country_id",
});

db.states.hasMany(db.sales_delivery_challan, {
  foreignKey: "shipping_state_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.states, {
  foreignKey: "shipping_state_id",
});

db.city.hasMany(db.sales_delivery_challan, {
  foreignKey: "shipping_city_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.city, {
  foreignKey: "shipping_city_id",
});

db.countryss.hasMany(db.sales_delivery_challan, {
  foreignKey: "customer_billing_country_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.countryss, {
  foreignKey: "customer_billing_country_id",
});

db.states.hasMany(db.sales_delivery_challan, {
  foreignKey: "customer_billing_state_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.states, {
  foreignKey: "customer_billing_state_id",
});

db.city.hasMany(db.sales_delivery_challan, {
  foreignKey: "customer_billing_city_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.city, {
  foreignKey: "customer_billing_city_id",
});
//////////////////////

db.supplyType.hasMany(db.sales_delivery_challan, {
  foreignKey: "supply_type_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.supplyType, {
  foreignKey: "supply_type_id",
});

db.tbl_branch.hasMany(db.sales_delivery_challan, {
  foreignKey: "billing_branch_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.tbl_branch, {
  foreignKey: "billing_branch_id",
});

db.documentType.hasMany(db.sales_delivery_challan, {
  foreignKey: "do_type_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.documentType, {
  foreignKey: "do_type_id",
});

db.transType.hasMany(db.sales_delivery_challan, {
  foreignKey: "trans_type_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.transType, {
  foreignKey: "trans_type_id",
});
db.customerProfile.hasMany(db.sales_delivery_challan, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.asset.hasMany(db.sales_delivery_challan_item, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan_item.belongsTo(db.asset, {
  foreignKey: "product_category_id",
});

db.SubCategory.hasMany(db.sales_delivery_challan_item, {
  foreignKey: "pro_sub_cat_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan_item.belongsTo(db.SubCategory, {
  foreignKey: "pro_sub_cat_id",
});

db.asset.hasMany(db.sales_delivery_challan_returnable_item, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan_returnable_item.belongsTo(db.asset, {
  foreignKey: "product_category_id",
});

db.ItemMaster.hasMany(db.sales_delivery_challan_item, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan_item.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
});

db.ItemMaster.hasMany(db.sales_delivery_challan_returnable_item, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan_returnable_item.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
});

// cost centre
db.cost_center.hasMany(db.cost_center, { foreignKey: "parent_cost_center" });
db.cost_center.belongsTo(db.cost_center, { foreignKey: "parent_cost_center" });
db.currency_convert.hasMany(db.cost_center, { foreignKey: "currency_id" });
db.cost_center.belongsTo(db.currency_convert, { foreignKey: "currency_id" });
db.documentTypeMaster =
  require("../master/document_type/models/documenttype.model.js")(
    sequelize,
    Sequelize,
  );

// ----------------------warehouse management----------------------------------
db.warehousemanagement =
  require("../Warehouse/WarehouseManagement/model/warehouseManagement.js")(
    sequelize,
    Sequelize,
  );
db.warehouseManagementMapping =
  require("../Warehouse/WarehouseManagement/model/warehouseManagementMapping.js")(
    sequelize,
    Sequelize,
  );
db.salesOrderDispatched =
  require("../Warehouse/WarehouseManagement/model/dispatched.js")(
    sequelize,
    Sequelize,
  );
db.reserveSerialNo =
  require("../Warehouse/WarehouseManagement/model/reserveSerialNo.js")(
    sequelize,
    Sequelize,
  );
/////////////////////////////////Foreign Keys will be listed here////////////////////////////////////
db.customerType.hasMany(db.ItemMasterCustomerType, {
  foreignKey: "customer_type_id",
  onDelete: "RESTRICT",
});
db.ItemMasterCustomerType.belongsTo(db.customerType, {
  foreignKey: "customer_type_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.ItemMasterCustomerType, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
////Sales Managent Starts////
db.delivery_order.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.delivery_order, { foreignKey: "entity_id" });

db.salesInvoice.hasMany(db.delivery_order, {
  foreignKey: "sales_id_invoice",
  onDelete: "RESTRICT",
});
db.delivery_order.belongsTo(db.salesInvoice, {
  foreignKey: "sales_id_invoice",
});

db.user.hasMany(db.delivery_order, {
  foreignKey: "sales_rep_id",
  onDelete: "RESTRICT",
});
db.delivery_order.belongsTo(db.user, { foreignKey: "sales_rep_id" });

db.department.hasMany(db.delivery_order, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.delivery_order.belongsTo(db.department, { foreignKey: "department_id" });

// hsn sac and gst rate

db.gst_rate_master.hasMany(db.hsn_sac_master, { foreignKey: "gst_rate_id" });
db.hsn_sac_master.belongsTo(db.gst_rate_master, { foreignKey: "gst_rate_id" });

db.entityMaster.hasMany(db.hsn_sac_master, { foreignKey: "entity_id" });
db.hsn_sac_master.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

// In quotation model for
db.delivery_order.belongsTo(db.warehouse, {
  foreignKey: "source_warehouse_id",
  targetKey: "id",
  as: "warehouse",
});

// Store Management
db.entityMaster.hasMany(db.createStore, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.createStore, {
  foreignKey: "city_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.createStore, {
  foreignKey: "state_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.createStore, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.plantmaster.hasMany(db.createStore, {
  foreignKey: "plant_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.store_assigned_employee, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.createStore.hasMany(db.store_assigned_employee, {
  foreignKey: "store_id",
  onDelete: "RESTRICT",
});

db.createStore.hasMany(db.store_stock_transfer, {
  foreignKey: "source_store_id",
  onDelete: "RESTRICT",
});
db.createStore.hasMany(db.store_stock_transfer, {
  foreignKey: "target_store_id",
  onDelete: "RESTRICT",
});
db.store_stock_transfer.hasMany(db.store_stock_transfer_list, {
  foreignKey: "stock_transfer_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.store_stock_transfer, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.store_stock_transfer_list, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});

db.receive_store_stock_transfer.hasMany(db.receive_store_stock_transfer_list, {
  foreignKey: "rec_stock_transfer_id",
  onDelete: "RESTRICT",
});
db.store_stock_transfer.hasMany(db.receive_store_stock_transfer, {
  foreignKey: "stock_transfer_id",
  onDelete: "RESTRICT",
});
db.createStore.hasMany(db.receive_store_stock_transfer, {
  foreignKey: "source_store_id",
  onDelete: "RESTRICT",
});
db.createStore.hasMany(db.receive_store_stock_transfer, {
  foreignKey: "target_store_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.receive_store_stock_transfer, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.receive_store_stock_transfer_list, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});

//ITEM_MASTER_DOCUMENT
db.ItemMaster.hasMany(db.imageDocument, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.imageDocument.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
  as: "item_document",
});
db.ItemMaster.hasMany(db.imageDocument, {
  foreignKey: "item_id",
  as: "item_document",
});

// allocate shift
db.shift.hasMany(db.shiftAllocate, {
  foreignKey: "shift_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.shiftAllocate, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.proforma, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.proforma.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.department.hasMany(db.proforma, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.proforma.belongsTo(db.department, { foreignKey: "department_id" });

db.user.hasMany(db.proforma, { foreignKey: "user_id", onDelete: "RESTRICT" });
db.proforma.belongsTo(db.user, { foreignKey: "user_id" });

// salesInvoice

db.proforma.hasMany(db.salesInvoice, {
  foreignKey: "proforma_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.belongsTo(db.proforma, { foreignKey: "proforma_id" });

db.entityMaster.hasMany(db.salesInvoice, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.department.hasMany(db.salesInvoice, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.belongsTo(db.department, { foreignKey: "department_id" });

db.user.hasMany(db.salesInvoice, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.belongsTo(db.user, { foreignKey: "user_id" });

// cash book

db.vendor_basic_details.hasMany(db.createCashBookMoneyIn, {
  foreignKey: "vendor_id",
});
db.createCashBookMoneyIn.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.createChartOfAccounts.hasMany(db.createCashBookMoneyIn, {
  foreignKey: "from_account",
});
db.createCashBookMoneyIn.belongsTo(db.createChartOfAccounts, {
  foreignKey: "from_account",
});

db.createChartOfAccounts.hasMany(db.createCashBookMoneyIn, {
  foreignKey: "to_account",
});
db.createCashBookMoneyIn.belongsTo(db.createChartOfAccounts, {
  foreignKey: "to_account",
});

db.createBank.hasMany(db.createChartOfAccounts, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.belongsTo(db.createBank, { foreignKey: "bank_id" });

db.entityMaster.hasMany(db.createCashBookMoneyIn, { foreignKey: "entity_id" });
db.createCashBookMoneyIn.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.vendor_basic_details.hasMany(db.createCashBookMoneyOut, {
  foreignKey: "vendor_id",
});
db.createCashBookMoneyOut.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.customerProfile.hasMany(db.createCashBookMoneyOut, {
  foreignKey: "customer_id",
});
db.createCashBookMoneyOut.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.createChartOfAccounts.hasMany(db.createCashBookMoneyOut, {
  foreignKey: "from_account",
});
db.createCashBookMoneyOut.belongsTo(db.createChartOfAccounts, {
  foreignKey: "from_account",
});

db.createChartOfAccounts.hasMany(db.createCashBookMoneyOut, {
  foreignKey: "to_account",
});
db.createCashBookMoneyOut.belongsTo(db.createChartOfAccounts, {
  foreignKey: "to_account",
});

db.entityMaster.hasMany(db.createCashBookMoneyOut, { foreignKey: "entity_id" });
db.createCashBookMoneyOut.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

//end cash book

//PAYROLL
db.user.hasMany(db.payroll_payslip, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_payslip, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_att_month, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_att_month, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_process, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.payroll_process.hasMany(db.payroll_payslip, {
  foreignKey: "process_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_declaration_form, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_declaration_form, {
  foreignKey: "login_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_declaration_form, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_declaration_form, {
  foreignKey: "approved_by",
  onDelete: "RESTRICT",
});
db.payroll_salary_template.hasOne(db.payroll_pay_salary, {
  foreignKey: "payroll_template_id",
  onDelete: "RESTRICT",
});
db.payroll_tax_slab.hasMany(db.payroll_pay_salary, {
  foreignKey: "tax_slab_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_att_month, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_pay_salary, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_pay_salary, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_pay_salary, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.payroll_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.payroll_att_month.hasMany(db.payroll_approval, {
  foreignKey: "budgetPlanning_Id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_payslip, {
  foreignKey: "approval_login_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_payslip, {
  foreignKey: "rejected_login_id",
  onDelete: "RESTRICT",
});

// proforma approval level

db.user.hasMany(db.proformaApprovalLevel, {
  foreignKey: "employee_id",
});

db.proformaApprovalLevel.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.proforma.hasMany(db.proformaApprovalLevel, {
  foreignKey: "proforma_id",
});

db.proformaApprovalLevel.belongsTo(db.proforma, {
  foreignKey: "proforma_id",
});

db.Work_Flow_range.hasMany(db.proformaApprovalLevel, {
  foreignKey: "workflow_range_id",
});

db.proformaApprovalLevel.belongsTo(db.Work_Flow_range, {
  foreignKey: "workflow_range_id",
});

// sales invoice level

db.user.hasMany(db.salesInvoiceApprovalLevel, {
  foreignKey: "employee_id",
});

db.salesInvoiceApprovalLevel.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.salesInvoice.hasMany(db.salesInvoiceApprovalLevel, {
  foreignKey: "sales_invoice_id",
});

db.salesInvoiceApprovalLevel.belongsTo(db.salesInvoice, {
  foreignKey: "sales_invoice_id",
});

db.Work_Flow_range.hasMany(db.salesInvoiceApprovalLevel, {
  foreignKey: "workflow_range_id",
});

db.salesInvoiceApprovalLevel.belongsTo(db.Work_Flow_range, {
  foreignKey: "workflow_range_id",
});

// delivery order approval level

db.user.hasMany(db.deliveryOrderApprovalLevel, {
  foreignKey: "employee_id",
});

db.deliveryOrderApprovalLevel.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.delivery_order.hasMany(db.deliveryOrderApprovalLevel, {
  foreignKey: "delivery_order_id",
});

db.deliveryOrderApprovalLevel.belongsTo(db.delivery_order, {
  foreignKey: "delivery_order_id",
});

db.Work_Flow_range.hasMany(db.deliveryOrderApprovalLevel, {
  foreignKey: "workflow_range_id",
});

db.deliveryOrderApprovalLevel.belongsTo(db.Work_Flow_range, {
  foreignKey: "workflow_range_id",
});

////Sales Managent Ends////

db.department.hasMany(db.fund_transfer, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.fund_transfer, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.createChartOfAccounts, {
  foreignKey: "entity_id",
});

db.createChartOfAccounts.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.currency_convert.hasMany(db.createChartOfAccounts, {
  foreignKey: "currency_id",
});

db.createChartOfAccounts.belongsTo(db.currency_convert, {
  foreignKey: "currency_id",
});

db.currency_convert.belongsTo(db.financial_And_Account_Journal, {
  foreignKey: "currency_id",
});

db.financial_And_Account_Journal.hasMany(db.currency_convert, {
  foreignKey: "currency_id",
});

db.financial_And_Account_Journal_Document.belongsTo(
  db.financial_And_Account_Journal,
  {
    foreignKey: "journal_id",
  },
);

db.financial_And_Account_Journal.hasMany(
  db.financial_And_Account_Journal_Document,
  {
    foreignKey: "journal_id",
  },
);

// Warehouse management module
db.entityMaster.hasMany(db.warehouse, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.warehouse, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.locationMaster.hasMany(db.warehouse, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.warehouse.belongsTo(db.locationMaster, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.warehouse_type.hasMany(db.warehouse, {
  foreignKey: "warehouse_type_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.warehouse, {
  foreignKey: "manager_id",
  onDelete: "RESTRICT",
});
db.THIRD_PARTY_ORGANIZATION.hasMany(db.warehouse, {
  foreignKey: "organization_id",
  onDelete: "RESTRICT",
});

// stock transfer

db.warehouse.hasMany(db.warehouse_bifurcation_zone, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.warehouse.hasMany(db.warehouse_doc, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.zoneType.hasMany(db.warehouse_bifurcation_zone, {
  foreignKey: "zone_type_id",
  onDelete: "RESTRICT",
});

db.warehouse_bifurcation_zone.hasMany(db.WAREHOUSE_BAY, {
  foreignKey: "zone_id",
  as: "warehouseBay",
  onDelete: "RESTRICT",
});
db.WAREHOUSE_BAY.hasMany(db.WAREHOUSE_RACK, {
  foreignKey: "bay_id",
  as: "warehouseRack",
  onDelete: "RESTRICT",
});
db.WAREHOUSE_RACK.hasMany(db.WAREHOUSE_BIN, {
  foreignKey: "rack_id",
  as: "warehouseBin",
  onDelete: "RESTRICT",
});

// received stock tranfer
db.entityMaster.hasMany(db.receiveStockTransfer, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.warehouse.hasMany(db.receiveStockTransfer, {
  foreignKey: "source_warehouse_id",
  onDelete: "RESTRICT",
});
db.warehouse.hasMany(db.receiveStockTransfer, {
  foreignKey: "target_warehouse_id",
  onDelete: "RESTRICT",
});
db.receiveStockTransfer.hasMany(db.receiveStockTransferList, {
  foreignKey: "recerivedstock_transfer_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.receiveStockTransferList, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});

db.countryss.hasMany(db.createBank, {
  foreignKey: "country_id",
});

db.createBank.belongsTo(db.countryss, {
  foreignKey: "country_id",
});

// bank-account

db.countryss.hasMany(db.createBankAccount, {
  foreignKey: "country",
});

db.createBankAccount.belongsTo(db.countryss, {
  foreignKey: "country",
});

db.createBank.hasMany(db.createBankAccount, {
  foreignKey: "bank_id",
});

db.createBankAccount.belongsTo(db.createBank, {
  foreignKey: "bank_id",
});

db.user.hasMany(db.createBankAccount, {
  foreignKey: "employee_id",
});

db.createBankAccount.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.vendor_basic_details.hasMany(db.createBankAccount, {
  foreignKey: "vendor_id",
});

db.createBankAccount.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.entityMaster.hasMany(db.createBankAccount, {
  foreignKey: "entity_id",
});

db.createBankAccount.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

//

// journal

db.entityMaster.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_And_Account_Journal.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.currency_convert.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.financial_And_Account_Journal.belongsTo(db.currency_convert, {
  foreignKey: "currency_id",
});

db.financial_And_Account_Journal.hasMany(
  db.financial_And_Account_Journal_List,
  { foreignKey: "journal_id", onDelete: "RESTRICT" },
);
db.financial_And_Account_Journal_List.belongsTo(
  db.financial_And_Account_Journal,
  { foreignKey: "journal_id" },
);

db.createChartOfAccounts.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.financial_And_Account_Journal_List.belongsTo(db.createChartOfAccounts, {
  foreignKey: "chart_account_id",
});

db.vendor_basic_details.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.tds.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});

db.financial_And_Account_Journal.hasMany(
  db.financial_And_Account_Journal_Schedule,
  { foreignKey: "journal_id", onDelete: "RESTRICT" },
);

db.entityMaster.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "entity_id",
});
db.financial_And_Account_Journal_List.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.customerProfile.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "customer_id",
});

db.createChartOfAccounts.hasMany(db.customerProfile, {
  foreignKey: "chart_of_account_id",
  onDelete: "RESTRICT",
});
db.createBank.hasMany(db.customerProfile, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.createBank, { foreignKey: "bank_id" });
// posting period and month

db.entityMaster.hasMany(db.createPostingPeriod, {
  foreignKey: "entity_id",
});

db.createPostingPeriod.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.financial_year.hasMany(db.createPostingPeriod, {
  foreignKey: "financial_year_id",
});

db.createPostingPeriod.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.createPostingPeriod.hasMany(db.createPostingPeriodMonthList, {
  foreignKey: "posting_period_id",
});

db.createPostingPeriodMonthList.belongsTo(db.createPostingPeriod, {
  foreignKey: "posting_period_id",
});

db.masterMonth.hasMany(db.entityMaster, {
  foreignKey: "from_month",
});

db.entityMaster.belongsTo(db.masterMonth, {
  foreignKey: "from_month",
});

db.masterMonth.hasMany(db.entityMaster, {
  foreignKey: "to_month",
});

db.entityMaster.belongsTo(db.masterMonth, {
  foreignKey: "to_month",
});

db.essApplyLeaveDetail.hasMany(db.appliedLeaveDocuments, {
  foreignKey: "applyDetailId",
});

db.appliedLeaveDocuments.belongsTo(db.essApplyLeaveDetail, {
  foreignKey: "applyDetailId",
});
// ESS APPLY LEAVE HAS MANY (MASTER LEAVE ID and APP DEPARTMENT ID )

db.user.hasMany(db.essApplyLeaveDetail, {
  foreignKey: "employee_id",
});

db.essApplyLeaveDetail.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.department.hasMany(db.essApplyLeaveDetail, {
  foreignKey: "dept_id",
});

db.essApplyLeaveDetail.belongsTo(db.department, {
  foreignKey: "dept_id",
});

db.leave_master.hasMany(db.essApplyLeaveDetail, {
  foreignKey: "leaveId",
});

db.essApplyLeaveDetail.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});

db.essApplyLeaveDetail.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.financial_year.hasMany(db.essApplyLeaveDetail, {
  foreignKey: "financial_year_id",
});
// RESTRICTIONS HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.restrictionsDurations, {
  throgh: "HRMS_RESTRICTIONS_DURATIONS",
  foreignKey: "leaveId",
});

db.restrictionsDurations.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

//  DETAIL HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.leavePolicyDetailModel, {
  foreignKey: "leaveId",
});

db.leavePolicyDetailModel.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});

//  ENTILEMENT HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.leavePolicyEntitlement, {
  foreignKey: "leaveId",
});

db.leavePolicyEntitlement.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});

//  RESTRICTIONS HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.leavePolicyRestrictions, {
  foreignKey: "leaveId",
});

db.leavePolicyRestrictions.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});

// (FOR ALL) APPLICABLITY HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.applicabilityAll, {
  foreignKey: "leaveId",
});

db.applicabilityAll.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});

// Marital HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.appMarital, {
  foreignKey: "leaveId",
});

db.appMarital.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});

// GENDER HAS MANY MASTER LEAVE

db.leave_master.hasMany(db.appGender, {
  foreignKey: "leaveId",
});

db.appGender.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});

// Location HAS MANY (MASTER LEAVE ID and MASTER LOCATION ID )

db.tbl_branch.hasMany(db.appLocation, {
  foreignKey: "locationId",
});

db.appLocation.belongsTo(db.tbl_branch, {
  foreignKey: "locationId",
});

db.leave_master.hasMany(db.appLocation, {
  throgh: "HRMS_APPLICABILITY_LOCATION",
  foreignKey: "leaveId",
});

db.appLocation.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

// Designation HAS MANY (MASTER LEAVE ID and MASTER DESIGNATION ID )

db.designation.hasMany(db.appDesignation, {
  throgh: "HRMS_APPLICABILITY_DESIGNATION",
  foreignKey: "designation_id",
});

db.appDesignation.belongsTo(db.designation, {
  throgh: "DESIGNATION",
  foreignKey: "designation_id",
});

db.leave_master.hasMany(db.appDesignation, {
  throgh: "HRMS_APPLICABILITY_DESIGNATION",
  foreignKey: "leaveId",
});

db.appDesignation.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

// Department HAS MANY (MASTER LEAVE ID and MASTER DEPART ID )

db.department.hasMany(db.appDepartment, {
  throgh: "HRMS_APPLICABILITY_DEPARTMENT",
  foreignKey: "dept_id",
});

db.appDepartment.belongsTo(db.department, {
  throgh: "MASTER_DEPARTMENT",
  foreignKey: "dept_id",
});

db.leave_master.hasMany(db.appDepartment, {
  throgh: "HRMS_APPLICABILITY_DEPARTMENT",
  foreignKey: "leaveId",
});

db.appDepartment.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

// Leave Master HAS MANY (Financial_year, Entity_id, Employee_id )
db.leave_master.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.financial_year.hasMany(db.leave_master, {
  foreignKey: "financial_year_id",
});

db.leave_master.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});
db.Master_basket.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.entityMaster.hasMany(db.leave_master, {
  foreignKey: "entity_id",
});

db.leave_master.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.user.hasMany(db.leave_master, {
  foreignKey: "employee_id",
});

db.documentMaster.belongsTo(db.user, {
  throgh: "HRMS_REGISTERED_USER",
  foreignKey: "employee_id",
});

db.role_module_master.hasMany(db.menu_master, {
  foreignKey: "role_module_master_id",
});
db.menu_master.hasMany(db.submenu_master, {
  foreignKey: "menu_master_id",
});
db.role_menu_access.belongsTo(db.role_master, {
  foreignKey: "role_master_id",
});

db.role_menu_access.belongsTo(db.role_module_master, {
  foreignKey: "role_module_master_id",
});

db.role_menu_access.belongsTo(db.menu_master, {
  foreignKey: "menu_master_id",
});

db.role_menu_access.belongsTo(db.submenu_master, {
  foreignKey: "submenu_master_id",
});

db.user.hasMany(db.helpDesk, {
  throgh: "helpDesk",
  foreignKey: "employee_id",
});

db.helpDesk.belongsTo(db.user, {
  throgh: "HRMS_REGISTERED_USER",
  foreignKey: "employee_id",
});

db.user.hasMany(db.complaint, {
  throgh: "complaint",
  foreignKey: "employee_id",
});

db.complaint.belongsTo(db.user, {
  throgh: "HRMS_REGISTERED_USER",
  foreignKey: "employee_id",
});

db.states.belongsTo(db.countryss, {
  throgh: "countryss",
  foreignKey: "countryss_id",
});

db.city.belongsTo(db.states, {
  throgh: "states",
  foreignKey: "states_id",
});

db.pincode.belongsTo(db.city, {
  throgh: "city",
  foreignKey: "city_id",
});

db.user.hasMany(db.role_master, {
  throgh: "role_master",
  foreignKey: "role_master_id",
});

db.new_certificate_type.belongsTo(db.segment, {
  throgh: "segment",
  foreignKey: "segment_id",
});

db.segment.hasMany(db.new_certificate_type, {
  throgh: "new_certificate_type",
  foreignKey: "segment_id",
});

db.new_region.belongsTo(db.segment, {
  throgh: "segment",
  foreignKey: "segment_id",
});

db.segment.hasMany(db.new_region, {
  throgh: "new_region",
  foreignKey: "segment_id",
});

db.new_category_master.belongsTo(db.segment, {
  throgh: "segment",
  foreignKey: "segment_id",
});

db.segment.hasMany(db.new_category_master, {
  throgh: "new_category_master",
  foreignKey: "segment_id",
});

db.new_spa.belongsTo(db.segment, {
  throgh: "segment",
  foreignKey: "segment_id",
});

db.segment.hasMany(db.new_spa, {
  throgh: "new_spa",
  foreignKey: "segment_id",
});

db.new_spa.belongsTo(db.new_certificate_type, {
  throgh: "new_certificate_type",
  foreignKey: "certificate_type_id",
});

db.new_certificate_type.hasMany(db.new_spa, {
  throgh: "new_spa",
  foreignKey: "certificate_type_id",
});

db.attendanceCalendarDetail.belongsTo(db.user, {
  throgh: "HRMS_REGISTERED_USER",
  foreignKey: "employee_id",
});

db.user.hasMany(db.attendanceCalendarDetail, {
  throgh: "MASTER_ATTENDANCE_CELENDER",
  foreignKey: "employee_id",
});

db.attendanceCalendarDetail.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.user.hasMany(db.attendanceCalendarDetail, {
  foreignKey: "employee_id",
});

db.screenOnOffDetail.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.user.hasMany(db.screenOnOffDetail, {
  foreignKey: "employee_id",
});

// Holiday HRMS
db.financial_year.hasMany(db.holidayDetail, {
  foreignKey: "financial_year_id",
});
db.holidayDetail.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
db.entityMaster.hasMany(db.holidayDetail, {
  foreignKey: "entity_id",
});
db.holidayDetail.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});
db.holidayDetail.hasMany(db.holidayWithCategory, {
  foreignKey: "holiday_id",
});
db.holidayWithCategory.belongsTo(db.holidayDetail, {
  foreignKey: "holiday_id",
});
db.holidayCategory.hasMany(db.holidayWithCategory, {
  foreignKey: "category_id",
});
db.holidayWithCategory.belongsTo(db.holidayCategory, {
  foreignKey: "category_id",
});
db.ServicesCategory.hasMany(db.Service_master, {
  foreignKey: "service_category_id",
  onDelete: "RESTRICT",
});
db.Service_master.belongsTo(db.ServicesCategory, {
  foreignKey: "service_category_id",
  onDelete: "RESTRICT",
});

db.hsn_sac_master.hasMany(db.Service_master, { foreignKey: "sac_code_id" });
db.Service_master.belongsTo(db.hsn_sac_master, { foreignKey: "sac_code_id" });

db.hsn_sac_master.hasMany(db.ItemMaster, { foreignKey: "hsn_code_id" });
db.ItemMaster.belongsTo(db.hsn_sac_master, { foreignKey: "hsn_code_id" });

db.hsn_sac_master.hasMany(db.poPaymentAddtion, { foreignKey: "hsn_code_id" });
db.poPaymentAddtion.belongsTo(db.hsn_sac_master, { foreignKey: "hsn_code_id" });

db.grnMaster.hasMany(db.poPaymentAddtion, { foreignKey: "grn_master_id" });
db.poPaymentAddtion.belongsTo(db.grnMaster, { foreignKey: "grn_master_id" });

db.purchase_order.hasMany(db.poPaymentAddtion, { foreignKey: "po_id" });
db.poPaymentAddtion.belongsTo(db.purchase_order, { foreignKey: "po_id" });

db.user.hasOne(db.employeeResignation, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.employeeResignation.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.employeeResignation, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.employeeResignation, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.employeeResignation.hasMany(db.Resignation_approval, {
  foreignKey: "resignnation_id",
  onDelete: "RESTRICT",
});
db.employeeResignation.hasMany(db.All_Resignation_approval, {
  foreignKey: "resignnation_id",
  onDelete: "RESTRICT",
});

db.department.hasMany(db.Resignation_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.Resignation_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.Resignation_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.Resignation_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.employeeResignation.hasMany(db.Resignation_approval, {
  foreignKey: "resignnation_id",
  onDelete: "RESTRICT",
});

db.tbl_branch.hasMany(db.WorkFlow_Master, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.belongsTo(db.tbl_branch, { foreignKey: "branch_id" });

db.user.hasMany(db.All_Resignation_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.All_Resignation_approval.hasMany(db.All_Resignation_review, {
  foreignKey: "review_id",
  onDelete: "RESTRICT",
});

db.ItemMaster.hasMany(db.itemSpecification, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.asset.hasOne(db.ItemMaster, {
  foreignKey: "asset_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.asset, { foreignKey: "asset_id" });

db.uom.hasOne(db.ItemMaster, { foreignKey: "uom_id", onDelete: "RESTRICT" });
db.ItemMaster.belongsTo(db.uom, { foreignKey: "uom_id" });

db.Master_basket.hasOne(db.ItemMaster, {
  foreignKey: "basket_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.Master_basket, { foreignKey: "basket_id" });

db.accessories_mst_name.hasOne(db.ItemMaster, {
  foreignKey: "accessory_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.accessories_mst_name, {
  foreignKey: "accessory_id",
});

db.entityMaster.hasMany(db.municipality_name, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.municipality_name.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.currency_convert.hasMany(db.municipality_name, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.municipality_name, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.municipality_name.hasMany(db.master_municipality_log, {
  foreignKey: "municipality_id",
  onDelete: "RESTRICT",
});
db.master_municipality_log.belongsTo(db.municipality_name, {
  foreignKey: "municipality_id",
});

db.entityMaster.hasMany(db.contract_types, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.allowance, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.allowance, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.travel_request, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.travel_request, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.travel_request, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

// Travel Plan
db.user.hasMany(db.ESS_TRAVEL_PLAN, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "plan_id",
  as: "plans",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.ESS_TRAVEL_PLAN, {
  foreignKey: "plan_id",
  as: "plan",
});

// Travel Request mapping
db.travel_request_data.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "tr_data_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.travel_request_data, {
  foreignKey: "tr_data_id",
  as: "travelDataPlan",
});

//
db.states.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "plan_state_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.states, {
  foreignKey: "plan_state_id",
  as: "planState",
});
db.city.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "plan_city_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.city, {
  foreignKey: "plan_city_id",
  as: "planCity",
});

db.states.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "actual_state_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.states, {
  foreignKey: "actual_state_id",
  as: "actualState",
});
db.city.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "actual_city_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.city, {
  foreignKey: "actual_city_id",
  as: "actualCity",
});

db.city.hasMany(db.travel_request_data, {
  foreignKey: "travel_from_city_id",
  onDelete: "RESTRICT",
});
db.travel_request_data.belongsTo(db.city, {
  foreignKey: "travel_from_city_id",
  as: "trFromCity",
});
db.city.hasMany(db.travel_request_data, {
  foreignKey: "travel_to_city_id",
  onDelete: "RESTRICT",
});
db.travel_request_data.belongsTo(db.city, {
  foreignKey: "travel_to_city_id",
  as: "trToCity",
});
db.states.hasMany(db.travel_request_data, {
  foreignKey: "travel_from_state_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.travel_request_data, {
  foreignKey: "travel_to_state_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.travel_request_data, {
  foreignKey: "travel_from_country_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.travel_request_data, {
  foreignKey: "travel_to_country_id",
  onDelete: "RESTRICT",
});
db.travel_request.hasMany(db.travel_request_data, {
  foreignKey: "travel_request_id",
  onDelete: "RESTRICT",
});
db.travel_request_data.hasMany(db.travel_journey_bifurcation, {
  foreignKey: "travel_data_id",
  as: "journeyBifurcation",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.travel_journey_bifurcation, {
  foreignKey: "travel_from_city_id",
  as: "journeyFromCity",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.travel_journey_bifurcation, {
  foreignKey: "travel_to_city_id",
  as: "journeyToCity",
  onDelete: "RESTRICT",
});
db.travel_journey_bifurcation.belongsTo(db.travel_request_data, {
  foreignKey: "travel_data_id",
});
db.travel_journey_bifurcation.belongsTo(db.city, {
  foreignKey: "travel_from_city_id",
  as: "journeyFromCity",
});
db.travel_journey_bifurcation.belongsTo(db.city, {
  foreignKey: "travel_to_city_id",
  as: "journeyToCity",
});

db.user.hasMany(db.travel_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.travel_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.travel_request.hasMany(db.travel_approval, {
  foreignKey: "travel_request_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.travel_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.travel_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.travel_request, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.createBank.hasMany(db.travel_advance_booking, {
  foreignKey: "bank_detail_id",
  onDelete: "RESTRICT",
});
db.travel_request.hasMany(db.travel_advance_booking, {
  foreignKey: "travel_request_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.travel_advance_booking, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.travel_advance_booking, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.expense_request, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.expense_request, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.expenseType.hasMany(db.expense_request_data, {
  foreignKey: "exp_category_id",
  onDelete: "RESTRICT",
});
db.TravelType.hasMany(db.expense_request_data, {
  foreignKey: "conveyance_type_id",
  onDelete: "RESTRICT",
});
db.travel_request_data.hasMany(db.expense_request_data, {
  foreignKey: "journey_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.expense_request, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.expense_request, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.expense_request.hasMany(db.expense_approval, {
  foreignKey: "expense_request_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.expense_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.expense_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.expense_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.travel_request.hasMany(db.expense_request, {
  foreignKey: "travel_request_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.expense_request, {
  foreignKey: "travel_from_city_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.expense_request, {
  foreignKey: "travel_to_city_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.expense_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.expense_request.hasMany(db.expense_request_data, {
  foreignKey: "expense_request_id",
  onDelete: "RESTRICT",
});
db.expense_request_data.belongsTo(db.expense_request, {
  foreignKey: "expense_request_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.additionalCharge, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.additionalCharge, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.hsn_sac_master.hasMany(db.additionalCharge, {
  foreignKey: "additional_hsn_code",
  onDelete: "RESTRICT",
});

db.travel_request_data.belongsTo(db.travel_request, {
  foreignKey: "travel_request_id",
});

db.department.hasMany(db.area, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.area.belongsTo(db.department, { foreignKey: "department_id" });

db.entityMaster.hasMany(db.entityStake, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.area, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.area.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.entityMaster.hasMany(db.createBank, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.createBank.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.entityMaster.hasMany(db.assessment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.assessment, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.assessment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.reason_for, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.submitted_assessment.hasMany(db.skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.behaviour, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.suggest_skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.suggest_skillDevelopment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.suggest_skillDevelopment, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.suggest_skillDevelopment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.committee_assign_user, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.committee_assign_user, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.committee_assign_user, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.committee_assign_user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.committee_assign_user, {
  foreignKey: "role_master_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.committee_assign_user, {
  foreignKey: "login_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.committee_assign_user, {
  foreignKey: "assign_user_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.behaviour, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.suggest_skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.committee_assess_rating, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.committee_assess_rating, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.committee_assess_rating, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.committee_assess_rating, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.self_rating.hasMany(db.committee_assess_rating, {
  foreignKey: "self_rating_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.committee_assess_rating, {
  foreignKey: "assign_user_id",
  onDelete: "RESTRICT",
});

db.submitted_assessment.hasMany(db.technical_assessment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.self_rating.hasMany(db.technical_assessment, {
  foreignKey: "self_rating_id",
  onDelete: "RESTRICT",
});
db.self_rating.hasMany(db.technical_assessment, {
  foreignKey: "manager_rating_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.technical_assessment, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.technical_assessment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.travel_advance_booking, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.countryss.hasOne(db.tbl_branch, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.belongsTo(db.countryss, { foreignKey: "country_id" });
db.states.hasOne(db.tbl_branch, {
  foreignKey: "state_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.belongsTo(db.states, { foreignKey: "state_id" });
db.city.hasOne(db.tbl_branch, { foreignKey: "city_id", onDelete: "RESTRICT" });
db.tbl_branch.belongsTo(db.city, { foreignKey: "city_id" });

db.financial_year.hasMany(db.contract_types, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.contract_types.belongsTo(db.financial_year, { foreignKey: "financial_id" });

db.financial_year.hasMany(db.cost_center, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.cost_center.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.cost_center.hasMany(db.cost_center_map, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.cost_center_map.belongsTo(db.cost_center, { foreignKey: "cost_center_id" });

db.department.hasMany(db.cost_center, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.regionMaster.hasOne(db.cost_center, {
  foreignKey: "region_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_allowance, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_documents, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_family, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_prev_employer, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_salary, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.user, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.user, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.belongsTo(db.department, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.designation.hasMany(db.user, {
  foreignKey: "designation_id",
  onDelete: "RESTRICT",
});
db.employmenttype.hasMany(db.user, {
  foreignKey: "emplyoment_type_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.user, {
  foreignKey: "role_master_id",
  onDelete: "RESTRICT",
});
db.holidayCategory.hasMany(db.user, {
  foreignKey: "holiday_category_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.Job_Request, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.contract_types.hasMany(db.Job_Request, {
  foreignKey: "contract_types_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.Job_Request, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.Job_Request, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.Job_Request, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.area.hasMany(db.Job_Request, {
  foreignKey: "area_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.Job_Request, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.designation.hasMany(db.Job_Request, {
  foreignKey: "designation_id",
  onDelete: "RESTRICT",
});
db.reason_for.hasMany(db.Job_Request, {
  foreignKey: "reason_id",
  onDelete: "RESTRICT",
});

db.department.hasMany(db.WorkFlow_Master, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});

db.WorkFlow_Master.hasMany(db.WorkFlow_Map, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.WorkFlow_Map, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.WorkFlow_Map, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.Work_Flow_range, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.Work_Flow_range.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.Work_Flow_range, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.Work_Flow_range, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.Job_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.Job_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.Job_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.Job_Request.hasMany(db.Job_approval, {
  foreignKey: "job_request_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.Job_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasOne(db.budgetPlanDate, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.budgetPlanDate.hasMany(db.budgetPlanDateHistory, {
  foreignKey: "budgetPlanDate_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasOne(db.budgetPlanDate, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.budgetPlanDate.hasMany(db.budgetPlanDateHistory, {
  foreignKey: "budgetPlanDate_id",
  onDelete: "RESTRICT",
});

db.budgetCategory.hasOne(db.budgetPlanning, {
  foreignKey: "budgetCategory_id",
  onDelete: "RESTRICT",
});
db.expenseType.hasOne(db.budgetPlanning, {
  foreignKey: "expenseType_id",
  onDelete: "RESTRICT",
});
db.needType.hasOne(db.budgetPlanning, {
  foreignKey: "needType_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.budgetPlanning, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasOne(db.budgetPlanning, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasOne(db.budgetPlanning, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.regionMaster.hasOne(db.budgetPlanning, {
  foreignKey: "region_id",
  onDelete: "RESTRICT",
});
db.budgetPlanDate.hasMany(db.budgetPlanning, {
  foreignKey: "budgetFinancialYear_id",
  onDelete: "RESTRICT",
});
db.Job_Request.belongsTo(db.cost_center, { foreignKey: "cost_center_id" });

db.entityMaster.hasMany(db.budgetCategory, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.budgetPlanDate, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.budgetPlanning, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.cost_center, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.cost_center.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user, {
  foreignKey: "reporting_manager_id",
  onDelete: "RESTRICT",
});

db.department.hasMany(db.budgetPlanning, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.budgetPlanning.hasMany(db.budget_approval, {
  foreignKey: "budgetPlanning_Id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.budget_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.budget_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.budget_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.budget_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.budget_approval, {
  foreignKey: "login_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasOne(db.budgetPlanning, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.WorkFlow_Master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.department, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.department.hasMany(db.income_statement_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.income_statement.hasMany(db.income_statement_approval, {
  foreignKey: "income_statement_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.income_statement_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.income_statement_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.income_statement_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.income_statement_approval, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.income_statement, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.income_statement, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.income_statement, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.income_statement, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.income_statement_approval, {
  foreignKey: "login_id",
  onDelete: "RESTRICT",
});

db.designation.hasMany(db.job_descripition, {
  foreignKey: "designation_id",
  onDelete: "RESTRICT",
});
db.contract_types.hasMany(db.job_descripition, {
  foreignKey: "contract_types_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.job_descripition, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.area.hasMany(db.job_descripition, {
  foreignKey: "area_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.job_descripition, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.job_descripition, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.job_descripition, {
  foreignKey: "spoc_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.job_descripition, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.role_menu_access, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.read_write_access, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.user_entity, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_entity, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.forcast_revenue, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.forcast_revenue, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.forcast_revenue.hasMany(db.forcast_revenue_sealList, {
  foreignKey: "forcast_revenue_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.asset_depreciation, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.asset_depreciation, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.income_statement, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.income_statement, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.job_descripition.hasMany(db.job_descripition_question, {
  foreignKey: "job_descripition_id",
  onDelete: "RESTRICT",
});
db.job_descripition.hasMany(db.job_descripition_skill, {
  foreignKey: "job_descripition_id",
  onDelete: "RESTRICT",
});
db.job_descripition.hasMany(db.job_descripition_email, {
  foreignKey: "job_descripition_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.job_descripition, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});

//  Vendor Basic Details
db.vendor_basic_details.hasMany(db.vendor_basic_details, {
  foreignKey: "parent_company_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.vendor_basic_details, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.belongsTo(db.currency_convert, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.vendor_basic_details, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.vendor_basic_details, {
  foreignKey: "state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.vendor_basic_details, {
  foreignKey: "city_id",
  onDelete: "RESTRICT",
});
db.customerPaymentTermMaster.hasMany(db.vendor_basic_details, {
  foreignKey: "payment_term_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.vendor_basic_details, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.vendor_basic_details, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vendor_basic_details, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.THIRD_PARTY_ORGANIZATION.hasMany(db.vendor_basic_details, {
  foreignKey: "organization_id",
  onDelete: "RESTRICT",
});

db.city.hasMany(db.vendor_bank_details_map, {
  foreignKey: "bank_city_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.vendor_bank_details_map, {
  foreignKey: "bank_state_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.vendor_bank_details_map, {
  foreignKey: "bank_country_id",
  onDelete: "RESTRICT",
});

db.vendor_basic_details.hasMany(db.vendor_bank_details_map, {
  foreignKey: "vendor_basic_id",
  onDelete: "RESTRICT",
});
db.Job_Request.hasMany(db.job_descripition, {
  foreignKey: "job_request_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.Job_Request, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.vendor_doc_details_map, {
  foreignKey: "vendor_basic_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.travel_request, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.job_descripition, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_interview_round, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.candidate_interview_round.hasMany(db.candidate_interviewer, {
  foreignKey: "round_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.candidate_interviewer, {
  foreignKey: "interviewer_id",
  onDelete: "RESTRICT",
});
db.job_descripition.hasMany(db.candidate_interview_round, {
  foreignKey: "jd_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.candidate_interview_round, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_interviewer, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.purchase_details, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.purchase_details.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.purchase_details, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.purchase_details, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.purchase_details, {
  foreignKey: "billing_branch_id",
});
db.purchase_details.belongsTo(db.tbl_branch, {
  foreignKey: "billing_branch_id",
});
db.warehouse.hasMany(db.purchase_details, {
  foreignKey: "warehouse_id",
});

db.purchase_details.belongsTo(db.warehouse, {
  foreignKey: "warehouse_id",
});

db.department.hasMany(db.purchase_details, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.purchase_details.belongsTo(db.department, { foreignKey: "department_id" });

db.purchase_details.hasMany(db.purchase_imgae, {
  foreignKey: "purchase_details_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.purchase_item, {
  foreignKey: "item_categroy_id",
  onDelete: "RESTRICT",
});
db.purchase_item.belongsTo(db.asset, { foreignKey: "item_categroy_id" });
db.ItemMaster.hasMany(db.purchase_item, {
  foreignKey: "item_master_id",
  onDelete: "RESTRICT",
});
db.purchase_item.belongsTo(db.ItemMaster, { foreignKey: "item_master_id" });
db.purchase_item.hasMany(db.purchase_item_ques, {
  foreignKey: "purchase_item_id",
  onDelete: "RESTRICT",
});
db.purchase_details.hasMany(db.purchase_item_ques, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.purchase_item_ques, {
  foreignKey: "answered_by",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.purchase_item_ques, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});

db.purchase_details.hasMany(db.purchase_item, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.purchase_details.hasMany(db.procurement_approval, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.procurement_approval.belongsTo(db.purchase_details, {
  foreignKey: "purchase_request_id",
});
db.user.hasMany(db.procurement_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.procurement_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.budgetPlanDate, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.forcast_revenue, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.asset_depreciation, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.purchase_item.hasMany(db.purchase_vendor, {
  foreignKey: "Purchase_req_item_id",
});
db.purchase_vendor.belongsTo(db.purchase_item, {
  foreignKey: "Purchase_req_item_id",
});
db.vendor_basic_details.hasMany(db.purchase_vendor, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.purchase_details.hasMany(db.purchase_vendor, {
  foreignKey: "Purchase_req_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.department, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.department.belongsTo(db.role_master, { foreignKey: "role_master_id" });

db.job_descripition_email.hasMany(db.candidate_interview_rating, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.job_descripition.hasMany(db.candidate_interview_rating, {
  foreignKey: "jd_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.candidate_interview_rating, {
  foreignKey: "interviewer_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.purchase_details, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.purchase_details.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

///////////////// vendor address mapping//////////////////

db.city.hasMany(db.vendorShippingAddress, {
  foreignKey: "shipping_city_id",
  onDelete: "RESTRICT",
});
db.vendorShippingAddress.belongsTo(db.city, { foreignKey: "shipping_city_id" });

db.states.hasMany(db.vendorShippingAddress, {
  foreignKey: "shipping_state_id",
  onDelete: "RESTRICT",
});
db.vendorShippingAddress.belongsTo(db.states, {
  foreignKey: "shipping_state_id",
});

db.countryss.hasMany(db.vendorShippingAddress, {
  foreignKey: "shipping_country_id",
  onDelete: "RESTRICT",
});
db.vendorShippingAddress.belongsTo(db.countryss, {
  foreignKey: "shipping_country_id",
});

db.vendor_basic_details.hasMany(db.vendorShippingAddress, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.vendorShippingAddress.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.city.hasMany(db.vendorBillingAddress, {
  foreignKey: "billing_city_id",
  onDelete: "RESTRICT",
});
db.vendorBillingAddress.belongsTo(db.city, { foreignKey: "billing_city_id" });

db.states.hasMany(db.vendorBillingAddress, {
  foreignKey: "billing_state_id",
  onDelete: "RESTRICT",
});
db.vendorBillingAddress.belongsTo(db.states, {
  foreignKey: "billing_state_id",
});

db.countryss.hasMany(db.vendorBillingAddress, {
  foreignKey: "billing_country_id",
  onDelete: "RESTRICT",
});
db.vendorBillingAddress.belongsTo(db.countryss, {
  foreignKey: "billing_country_id",
});

db.vendor_basic_details.hasMany(db.vendorBillingAddress, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.vendorBillingAddress.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.vendor_basic_details.hasMany(db.vendorContactPerson, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.vendorContactPerson.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});
db.customerProfile.hasMany(db.customer_Product_Price, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.customer_Product_Price, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});

db.purchase_details.hasMany(db.PROCUREMENT_PURCHASE_VENDOR_RFP, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.purchase_item.hasMany(db.PROCUREMENT_PURCHASE_VENDOR_RFP, {
  foreignKey: "procurement_product_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.PROCUREMENT_PURCHASE_VENDOR_RFP, {
  foreignKey: "vendors",
  onDelete: "RESTRICT",
});
db.PROCUREMENT_PURCHASE_VENDOR_RFP.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendors",
});
db.ItemMaster.hasMany(db.PROCUREMENT_PURCHASE_VENDOR_RFP, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.purchase_imgae, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.purchase_imgae, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.financial_year.hasMany(db.job_descripition, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.shift, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.shift, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.technical_assessment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.skillDevelopment, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.behaviour, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.behaviour, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.behaviour, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.self_rating.hasMany(db.behaviour, {
  foreignKey: "manager_self_rating",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.skillDevelopment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.skillDevelopment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.financial_year.hasMany(db.assessment, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.submitted_assessment, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.assessment.hasMany(db.submitted_assessment, {
  foreignKey: "yearly_assessment_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.submitted_assessment, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.submitted_assessment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.colleague_review, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.colleague_review, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.colleague_review, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.colleague_review, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.colleague_review, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.colleague_review, {
  foreignKey: "login_id",
  onDelete: "RESTRICT",
});
db.self_rating.hasMany(db.colleague_review, {
  foreignKey: "self_rating_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.colleague_review, {
  foreignKey: "role_master_id",
  onDelete: "RESTRICT",
});
db.assessment.hasMany(db.colleague_review, {
  foreignKey: "yearly_assessment_id",
  onDelete: "RESTRICT",
});

db.job_descripition_email.hasMany(db.candidate_bgv, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.candidate_bgv.hasMany(db.candidate_bgv_company, {
  foreignKey: "can_bgv_id",
  onDelete: "RESTRICT",
});
db.candidate_bgv_company.hasMany(db.company_qual_rating, {
  foreignKey: "company_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.candidate_offer_letter, {
  foreignKey: "reporting_manager_id",
  onDelete: "RESTRICT",
});
db.contract_types.hasMany(db.candidate_offer_letter, {
  foreignKey: "contract_types_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.candidate_offer_letter, {
  foreignKey: "approval_id",
  onDelete: "RESTRICT",
});
db.candidate_offer_letter.hasMany(db.candidate_offer_allowance, {
  foreignKey: "offer_id",
  onDelete: "RESTRICT",
});

db.financial_year.hasMany(db.purchase_order, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.purchase_order, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.purchase_order, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.purchase_order, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.purchase_order, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.currency_convert, { foreignKey: "currency_id" });
db.financeProfitCenter.hasMany(db.purchase_order, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.purchase_order, {
  foreignKey: "billing_address_id",
  onDelete: "RESTRICT",
});
db.warehouse.hasMany(db.purchase_order, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.warehouse, { foreignKey: "warehouse_id" });
db.vendor_basic_details.hasMany(db.purchase_order, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.customerPaymentTermMaster.hasMany(db.purchase_order, {
  foreignKey: "payment_term_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.customerPaymentTermMaster, {
  foreignKey: "payment_term_id",
});

db.portMaster.hasMany(db.purchase_order, {
  foreignKey: "port_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.portMaster, { foreignKey: "port_id" });

db.incotermMaster.hasMany(db.purchase_order, {
  foreignKey: "incoterm_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.incotermMaster, { foreignKey: "incoterm_id" });

db.purchase_order.hasMany(db.purchase_order_image, {
  foreignKey: "purchase_order_id",
  onDelete: "RESTRICT",
});

db.purchase_order.hasMany(db.purchase_order_item, {
  foreignKey: "purchase_order_id",
});
db.purchase_order_item.belongsTo(db.purchase_order, {
  foreignKey: "purchase_order_id",
});
db.ItemMaster.hasMany(db.purchase_order_item, { foreignKey: "item_master_id" });
db.purchase_order_item.belongsTo(db.ItemMaster, {
  foreignKey: "item_master_id",
});
db.purchase_order.hasMany(db.purchase_order_image, {
  foreignKey: "purchase_order_id",
  onDelete: "RESTRICT",
});

db.purchase_order.hasMany(db.purchase_order_service, {
  foreignKey: "purchase_order_id",
});
db.Service_master.hasMany(db.purchase_order_service, {
  foreignKey: "service_master_id",
});
db.purchase_order_service.belongsTo(db.Service_master, {
  foreignKey: "service_master_id",
});
db.ServicesCategory.hasMany(db.purchase_order_service, {
  foreignKey: "service_categroy_id",
  onDelete: "RESTRICT",
});
db.purchase_order_service.belongsTo(db.ServicesCategory, {
  foreignKey: "service_categroy_id",
});

db.purchase_order.hasMany(db.purchase_order_approval, {
  foreignKey: "purchase_order_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.purchase_order, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.purchase_order_approval.belongsTo(db.purchase_order, {
  foreignKey: "purchase_order_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.purchase_order_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.purchase_order_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.purchase_order_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.purchase_order_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_offer_letter, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.candidate_offer_letter, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.candidate_offer_letter, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.candidate_offer_letter, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});

db.purchase_details.hasMany(db.purchase_order, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.purchase_details, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_offer_letter_doc, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.candidate_offer_letter_doc, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.job_descripition.hasMany(db.candidate_offer_letter_doc, {
  foreignKey: "jd_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.candidate_offer_letter, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.essApplyLeaveDetail, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.grnMaster, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
// grn maping
db.warehouse.hasMany(db.grnMaster, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.grnMaster.belongsTo(db.warehouse, { foreignKey: "warehouse_id" });
db.createShippingAlert.hasMany(db.grnMaster, {
  foreignKey: "shiping_id",
  onDelete: "RESTRICT",
});
db.grnMaster.belongsTo(db.createShippingAlert, { foreignKey: "shiping_id" });
db.uses.hasMany(db.grnMaster, { foreignKey: "usage_id", onDelete: "RESTRICT" });
db.createStore.hasMany(db.grnMaster, {
  foreignKey: "store_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.grnMaster, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.grnItem, { foreignKey: "asset_id", onDelete: "RESTRICT" });
db.grnItem.belongsTo(db.asset, { foreignKey: "asset_id" });

db.purchase_order.hasMany(db.purchase_order_approval, {
  foreignKey: "purchase_order_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.purchase_order, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.purchase_order_approval.belongsTo(db.purchase_order, {
  foreignKey: "purchase_order_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.purchase_order_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.purchase_order_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.purchase_order_approval, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.purchase_order_approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.essApplyLeaveDetail.hasMany(db.essLeavedaysDetail, {
  foreignKey: "apply_leave_id",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_offer_letter, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.candidate_offer_letter, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.candidate_offer_letter, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.candidate_offer_letter, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});

db.purchase_details.hasMany(db.purchase_order, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.purchase_order.belongsTo(db.purchase_details, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_offer_letter_doc, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.candidate_offer_letter_doc, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.job_descripition.hasMany(db.candidate_offer_letter_doc, {
  foreignKey: "jd_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.candidate_offer_letter, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.essApplyLeaveDetail, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});

/*PROCUREMENT_PURCHASE_QUOTATION_ITEM*/
db.ItemMaster.hasMany(db.PROCUREMENT_PURCHASE_QUOTATION_ITEM, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.PROCUREMENT_PURCHASE_QUOTATION_ITEM.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
});

db.purchase_details.hasMany(db.PROCUREMENT_PURCHASE_QUOTATION_ITEM, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});

db.vendor_basic_details.hasMany(db.PROCUREMENT_PURCHASE_QUOTATION_ITEM, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.PROCUREMENT_PURCHASE_QUOTATION_ITEM.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.Service_master.hasMany(db.PROCUREMENT_PURCHASE_QUOTATION_ITEM, {
  foreignKey: "service_id",
  onDelete: "RESTRICT",
});

db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.hasMany(
  db.PROCUREMENT_PURCHASE_QUOTATION_ITEM,
  { foreignKey: "quotation_id", onDelete: "RESTRICT" },
);

db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.hasMany(
  db.PROCUREMENT_PURCHASE_QUOTATION_ITEM,
  { foreignKey: "negotiation_item_id", onDelete: "RESTRICT" },
);
db.PROCUREMENT_PURCHASE_VENDOR_RFP.hasMany(
  db.PROCUREMENT_PURCHASE_QUOTATION_ITEM,
  { foreignKey: "rfp_item_id", onDelete: "RESTRICT" },
);
db.PROCUREMENT_PURCHASE_QUOTATION_ITEM.belongsTo(
  db.PROCUREMENT_PURCHASE_VENDOR_RFP,
  { foreignKey: "rfp_item_id" },
);
/*PROCUREMENT_PURCHASE_QUOTATION_ITEM*/

db.entityMaster.hasMany(db.user, {
  foreignKey: "primary_entity_id",
  onDelete: "RESTRICT",
});

db.currency_convert.hasMany(db.PROCUREMENT_PURCHASE_VENDOR_RFP, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.PROCUREMENT_PURCHASE_VENDOR_RFP.belongsTo(db.currency_convert, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
});
db.vendor_basic_details.hasMany(db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});
db.Service_master.hasMany(db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM, {
  foreignKey: "service_id",
  onDelete: "RESTRICT",
});
db.purchase_item.hasMany(db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM, {
  foreignKey: "procurement_product_id",
  onDelete: "RESTRICT",
});
// Negotiation to Purchase
db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.hasMany(
  db.PROCUREMENT_PURCHASE_NEGOTIATION_ITEM,
  { foreignKey: "negotiation_id", onDelete: "RESTRICT" },
);
db.purchase_details.hasMany(db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});

// Quotation to Purchase and negotiation
db.PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION.hasMany(
  db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION,
  { foreignKey: "negotiation_id", onDelete: "RESTRICT" },
);
db.purchase_details.hasMany(db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION, {
  foreignKey: "pr_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.vendor_bank_details_map, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vendor_bank_details_map, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.vendor_doc_details_map, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vendor_doc_details_map, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.purchase_imgae, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.purchase_imgae.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
db.financial_year.hasMany(db.department, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.department.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });
db.financial_year.hasMany(db.WorkFlow_Master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.purchase_details.hasMany(db.quotationApprovalLevel, {
  foreignKey: "purchase_request_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.quotationApprovalLevel, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.quotationApprovalLevel, {
  foreignKey: "created_emp_id",
  onDelete: "RESTRICT",
});
db.Work_Flow_range.hasMany(db.quotationApprovalLevel, {
  foreignKey: "workflow_range_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.quotationApprovalLevel, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.quotationApprovalLevel, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.PROCUREMENT_PURCHASE_VENDOR_QUOTATION.hasMany(db.quotationApprovalLevel, {
  foreignKey: "quotation_id",
  onDelete: "RESTRICT",
});
db.allowance.hasMany(db.user_allowance, {
  foreignKey: "allowance_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_login, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.user_login, {
  foreignKey: "primary_entity_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.user_login, {
  foreignKey: "role_master_id",
  onDelete: "RESTRICT",
});

db.depreciationCalculation.belongsTo(db.calculationMethod, {
  foreignKey: "id",
});
db.calculationMethod.hasMany(db.depreciationCalculation, {
  foreignKey: "id",
});
db.assetMaintenanceMapping.belongsTo(db.assetMaintenance, {
  foreignKey: "maintenanceMappingId",
  targetKey: "id",
});

db.assetMaintenance.hasMany(db.assetMaintenanceMapping, {
  foreignKey: "maintenanceMappingId",
  sourceKey: "id",
});

// fund transfer approval level

db.user.hasMany(db.fundTransferApprovalLevel, {
  foreignKey: "employee_id",
});

db.fundTransferApprovalLevel.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.fund_transfer.hasMany(db.fundTransferApprovalLevel, {
  foreignKey: "fund_transfer_id",
});

db.fundTransferApprovalLevel.belongsTo(db.fund_transfer, {
  foreignKey: "fund_transfer_id",
});

db.Work_Flow_range.hasMany(db.fundTransferApprovalLevel, {
  foreignKey: "workflow_range_id",
});

db.fundTransferApprovalLevel.belongsTo(db.Work_Flow_range, {
  foreignKey: "workflow_range_id",
});

db.user.hasMany(db.fund_transfer, {
  foreignKey: "employee_id",
});

db.fund_transfer.belongsTo(db.user, {
  foreignKey: "employee_id",
});
//end

db.grnMaster.hasMany(db.grnItem, {
  foreignKey: "grn_Id",
  onDelete: "RESTRICT",
});
db.grnItem.belongsTo(db.grnMaster, { foreignKey: "grn_Id" });

db.entityMaster.hasMany(db.warehousemanagement, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.warehousemanagement.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.warehousemanagement, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.warehousemanagement.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.ItemMaster.hasMany(db.grnItem, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.grnItem.belongsTo(db.ItemMaster, { foreignKey: "item_id" });

db.purchase_order.hasMany(db.grnMaster, {
  foreignKey: "po_Id",
  onDelete: "RESTRICT",
});
db.grnMaster.belongsTo(db.purchase_order, { foreignKey: "po_Id" });

db.financial_year.hasMany(db.grnMaster, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.grnMaster.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });

db.entityMaster.hasMany(db.grnMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.grnMaster.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.grnVerion.hasMany(db.grnMaster, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.purchase_order.hasMany(db.grnVerion, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.purchase_order_item.hasMany(db.grnItemStatus, {
  foreignKey: "po_item_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.belongsTo(db.purchase_order_item, {
  foreignKey: "po_item_id",
});

db.ItemMaster.hasMany(db.grnItemStatus, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.belongsTo(db.ItemMaster, { foreignKey: "item_id" });

db.grnItem.hasMany(db.grnItemStatus, {
  foreignKey: "grn_item_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.belongsTo(db.grnItem, { foreignKey: "grn_item_id" });

db.purchase_order_item.hasMany(db.grnItem, {
  foreignKey: "po_item_id",
  onDelete: "RESTRICT",
});
db.grnItem.belongsTo(db.purchase_order_item, { foreignKey: "po_item_id" });
db.grnVerion.hasMany(db.grnItem, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});

// ---------------------------------------------
db.productcategory.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.productcategory, { foreignKey: "entity_id" });

db.ItemMaster.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.ItemMaster, { foreignKey: "entity_id" });

db.ItemMaster.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.ItemMaster, { foreignKey: "entity_id" });

db.tbl_itemType.hasMany(db.ItemMaster, {
  foreignKey: "item_type_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.tbl_itemType, { foreignKey: "item_type_id" });

db.asset.hasMany(db.ItemMaster, {
  foreignKey: "asset_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.asset, { foreignKey: "asset_id" });

db.SubCategory.hasMany(db.ItemMaster, {
  foreignKey: "sub_category_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.SubCategory, { foreignKey: "sub_category_id" });

db.uom.hasOne(db.ItemMaster, { foreignKey: "uom_id", onDelete: "RESTRICT" });
db.ItemMaster.belongsTo(db.uom, { foreignKey: "uom_id" });
//////
db.ItemMaster.belongsTo(db.uom, { foreignKey: "uom_id", as: "uom_name" });
//////

db.ItemMaster.hasOne(db.product__variant_master, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.product__variant_master.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
});

db.countryss.hasMany(db.plantmaster, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.plantmaster.belongsTo(db.countryss, { foreignKey: "country_id" });

db.states.hasMany(db.plantmaster, {
  foreignKey: "state_id",
  onDelete: "RESTRICT",
});
db.plantmaster.belongsTo(db.states, { foreignKey: "state_id" });

db.plantmaster.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.plantmaster, { foreignKey: "entity_id" });

db.entityMaster.hasMany(db.sourceMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.sourceMaster.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.sourceMaster, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.sourceMaster.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
// -----------production-----------------------
db.productcategory.hasMany(db.bom, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.bom.belongsTo(db.productcategory, { foreignKey: "product_category_id" });

db.ItemMaster.hasMany(db.bom, { foreignKey: "sfg_id", onDelete: "RESTRICT" });
db.bom.belongsTo(db.ItemMaster, { foreignKey: "sfg_id" });
db.ItemMaster.hasMany(db.bom, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.product__variant_master.hasMany(db.bom, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.bom.belongsTo(db.ItemMaster, { foreignKey: "product_id" });
db.bom.belongsTo(db.product__variant_master, { foreignKey: "product_id" });
db.user.hasMany(db.bom, { foreignKey: "employee_id", onDelete: "RESTRICT" });
db.bom.belongsTo(db.user, { foreignKey: "employee_id" });
db.bom.hasMany(db.bomDetails, { foreignKey: "bom_id", onDelete: "RESTRICT" });
db.asset.hasMany(db.bomDetails, {
  foreignKey: "asset_id",
  onDelete: "RESTRICT",
});
db.bomDetails.belongsTo(db.asset, { foreignKey: "asset_id" });
db.ItemMaster.hasMany(db.bomDetails, {
  foreignKey: "item_master_id",
  onDelete: "RESTRICT",
});
db.bomDetails.belongsTo(db.ItemMaster, { foreignKey: "item_master_id" });

db.tbl_itemType.hasMany(db.bomDetails, {
  foreignKey: "item_type_id",
  onDelete: "RESTRICT",
});
db.bomDetails.belongsTo(db.tbl_itemType, { foreignKey: "item_type_id" });

db.bom.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.bom, { foreignKey: "entity_id" });
db.financial_year.hasMany(db.bom, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.bom.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });

db.workStation.hasMany(db.UploadDoc, {
  foreignKey: "work_station_id",
  onDelete: "RESTRICT",
});
db.uom.hasOne(db.workStation, { foreignKey: "uom_id", onDelete: "RESTRICT" });
db.workStation.belongsTo(db.uom, {
  foreignKey: "uom_id",
  onDelete: "RESTRICT",
});

db.workStation.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.workStation, { foreignKey: "entity_id" });
db.financial_year.hasMany(db.workStation, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.workStation.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
db.uom.belongsTo(db.workStation, { foreignKey: "uom_id" });

db.ItemMaster.hasMany(db.production, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.production.belongsTo(db.ItemMaster, { foreignKey: "product_id" });

db.productcategory.hasMany(db.production, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.production.belongsTo(db.productcategory, {
  foreignKey: "product_category_id",
});
db.production.hasMany(db.productionMapping, {
  foreignKey: "production_id",
  onDelete: "RESTRICT",
});
db.productionMapping.belongsTo(db.production, { foreignKey: "production_id" });
db.production.hasMany(db.productionMappingshift, {
  as: "shiftList",
  foreignKey: "production_id",
  onDelete: "RESTRICT",
});
db.productionMappingshift.belongsTo(db.production, {
  as: "shiftList",
  foreignKey: "production_id",
});

db.user.hasOne(db.production, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.production.belongsTo(db.user, { foreignKey: "employee_id" });

// Define association in Sequelize
db.productionMapping.hasMany(db.productionMappingshift, {
  as: "shiftList",
  foreignKey: "production_mapping_id",
  onDelete: "RESTRICT",
});
db.productionMappingshift.belongsTo(db.productionMapping, {
  foreignKey: "production_mapping_id",
});

db.shift.hasMany(db.productionMappingshift, {
  foreignKey: "shift_id",
  onDelete: "RESTRICT",
});
db.productionMappingshift.belongsTo(db.shift, { foreignKey: "shift_id" });

db.plantmaster.hasMany(db.productionMappingshift, {
  foreignKey: "plant_id",
  onDelete: "RESTRICT",
});
db.productionMappingshift.belongsTo(db.plantmaster, { foreignKey: "plant_id" });
db.production.hasMany(db.productionWorkStation, {
  as: "workstationList",
  foreignKey: "production_id",
  onDelete: "RESTRICT",
});
db.productionWorkStation.belongsTo(db.production, {
  as: "workstationList",
  foreignKey: "production_id",
});
db.workStation.hasMany(db.productionWorkStation, {
  foreignKey: "workstation_id",
  onDelete: "RESTRICT",
});
db.productionWorkStation.belongsTo(db.workStation, {
  foreignKey: "workstation_id",
});
db.plantmaster.hasMany(db.productionWorkStation, {
  foreignKey: "plant_id",
  onDelete: "RESTRICT",
});
db.productionWorkStation.belongsTo(db.plantmaster, { foreignKey: "plant_id" });
db.productionMapping.hasMany(db.productionWorkStation, {
  as: "workstationList",
  foreignKey: "production_mapping_id",
  onDelete: "RESTRICT",
});
db.productionWorkStation.belongsTo(db.productionMapping, {
  foreignKey: "production_mapping_id",
});

db.productionMapping.hasMany(db.prodraiseindent, {
  as: "raiseindent",
  foreignKey: "production_mapping_id",
  onDelete: "RESTRICT",
});
db.prodraiseindent.belongsTo(db.productionMapping, {
  foreignKey: "production_mapping_id",
});
db.ItemMaster.hasMany(db.prodraiseindent, {
  foreignKey: "item_master_id",
  onDelete: "RESTRICT",
});
db.prodraiseindent.belongsTo(db.ItemMaster, { foreignKey: "item_master_id" });
db.ItemMaster.hasMany(db.prodraiseindent, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.prodraiseindent.belongsTo(db.ItemMaster, { foreignKey: "product_id" });

db.workStation.hasMany(db.prodqualityControl, {
  foreignKey: "workstation_id",
  onDelete: "RESTRICT",
});
db.prodqualityControl.belongsTo(db.workStation, {
  foreignKey: "workstation_id",
});
db.productionMapping.hasMany(db.prodqualityControl, {
  as: "workstationControl",
  foreignKey: "production_mapping_id",
  onDelete: "RESTRICT",
});
db.prodqualityControl.belongsTo(db.productionMapping, {
  foreignKey: "production_mapping_id",
});
db.shift.hasOne(db.prodqualityControl, {
  foreignKey: "shift_id",
  onDelete: "RESTRICT",
});
db.prodqualityControl.belongsTo(db.shift, { foreignKey: "shift_id" });
db.ItemMaster.hasMany(db.prodqualityControl, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.prodqualityControl.belongsTo(db.ItemMaster, { foreignKey: "product_id" });

db.prodqualityControl.hasMany(db.prodqualityControlParameter, {
  foreignKey: "quality_control_id",
  onDelete: "RESTRICT",
});
db.prodqualityControlParameter.belongsTo(db.prodqualityControl, {
  foreignKey: "quality_control_id",
});
db.quality_parameter.hasOne(db.prodqualityControlParameter, {
  foreignKey: "quality_parameter_id",
  onDelete: "RESTRICT",
});

db.plantmaster.hasMany(db.productionMapping, {
  foreignKey: "plant_id",
  onDelete: "RESTRICT",
});
db.productionMapping.belongsTo(db.plantmaster, { foreignKey: "plant_id" });
db.user.hasOne(db.productionMappingshift, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.productionMappingshift.belongsTo(db.user, { foreignKey: "employee_id" });
db.shift.hasOne(db.productionWorkStation, {
  foreignKey: "shift_id",
  onDelete: "RESTRICT",
});
db.productionWorkStation.belongsTo(db.shift, { foreignKey: "shift_id" });
db.shift.hasMany(db.user, { foreignKey: "shift_id", onDelete: "RESTRICT" });
db.user.hasOne(db.productionMapping, {
  foreignKey: "production_manager_id",
  onDelete: "RESTRICT",
});
db.productionMapping.hasMany(db.workstationmaintenance, {
  as: "workstationmaint",
  foreignKey: "production_mapping_id",
  onDelete: "RESTRICT",
});
db.workstationmaintenance.belongsTo(db.productionMapping, {
  foreignKey: "production_mapping_id",
});

db.production.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.production, { foreignKey: "entity_id" });
db.financial_year.hasMany(db.production, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.production.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });

db.workStation.hasMany(db.quality_master, {
  foreignKey: "work_station_id",
  onDelete: "RESTRICT",
});
db.quality_master.belongsTo(db.workStation, { foreignKey: "work_station_id" });
db.quality_master.hasMany(db.quality_parameter, {
  foreignKey: "quality_master_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.quality_master, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.quality_master.belongsTo(db.ItemMaster, { foreignKey: "product_master_id" });
db.productcategory.hasMany(db.quality_master, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.quality_master.belongsTo(db.productcategory, {
  foreignKey: "product_category_id",
});
db.quality_master.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.quality_master, { foreignKey: "entity_id" });
db.financial_year.hasMany(db.quality_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.quality_master.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
db.productionMappingshift.hasMany(db.generateLabel, {
  foreignKey: "quality_id",
  onDelete: "RESTRICT",
});
db.generateLabel.belongsTo(db.productionMappingshift, {
  foreignKey: "quality_id",
});

db.ItemMaster.hasMany(db.generateLabel, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.generateLabel.belongsTo(db.ItemMaster, { foreignKey: "product_id" });

db.stockLocation.hasMany(db.stockLabelLocation, {
  foreignKey: "stock_location_id",
  onDelete: "RESTRICT",
});
db.stockLabelLocation.belongsTo(db.stockLocation, {
  foreignKey: "stock_location_id",
}); // stock_location_id

db.ItemMaster.hasMany(db.stockLabelLocation, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.stockLabelLocation.belongsTo(db.ItemMaster, { foreignKey: "product_id" }); // product_id

db.productionMappingshift.hasMany(db.stockLocation, {
  foreignKey: "quality_id",
  onDelete: "RESTRICT",
});
db.stockLocation.belongsTo(db.productionMappingshift, {
  foreignKey: "quality_id",
});

db.warehouse.hasMany(db.stockLocation, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.stockLocation.belongsTo(db.warehouse, { foreignKey: "warehouse_id" });

db.ItemMaster.hasMany(db.stockLocation, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.stockLocation.belongsTo(db.ItemMaster, { foreignKey: "product_id" }); // product_id

db.stockLocation.hasMany(db.stockAcknowledgedRack, {
  foreignKey: "stock_location_id",
  onDelete: "RESTRICT",
});
db.stockAcknowledgedRack.belongsTo(db.stockLocation, {
  foreignKey: "stock_location_id",
}); // stock_location_id

db.warehouse.hasMany(db.stockAcknowledgedRack, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.stockAcknowledgedRack.belongsTo(db.warehouse, {
  foreignKey: "warehouse_id",
}); //warehouse_id

db.ItemMaster.hasMany(db.stockAcknowledgedRack, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.stockAcknowledgedRack.belongsTo(db.ItemMaster, { foreignKey: "product_id" }); // product_id

db.productionMappingshift.hasMany(db.stockAcknowledgedRack, {
  foreignKey: "quality_id",
  onDelete: "RESTRICT",
});
db.stockAcknowledgedRack.belongsTo(db.productionMappingshift, {
  foreignKey: "quality_id",
}); // quality_id

db.financial_year.hasMany(db.ItemMaster, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });

// -------------------------CRM----------------------
db.addDo.hasOne(db.addDoItem, { foreignKey: "addDo_id", onDelete: "RESTRICT" });
db.ItemMaster.hasOne(db.addDoItem, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.product__variant_master.hasOne(db.addDoItem, {
  foreignKey: "variant_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.addDo, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.gstInfo, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.gstInfo.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

//////IRN starts
db.entityMaster.hasMany(db.salesIrnData, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.salesIrnData.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.salesIrnData, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.salesIrnData.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.sales_delivery_challan.hasMany(db.salesIrnData, {
  foreignKey: "do_id",
  onDelete: "RESTRICT",
});
db.salesIrnData.belongsTo(db.sales_delivery_challan, { foreignKey: "do_id" });

//////EWAY starts
db.entityMaster.hasMany(db.ewayData, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ewayData.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.ewayData, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.ewayData.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });

db.sales_delivery_challan.hasMany(db.ewayData, {
  foreignKey: "do_id",
  onDelete: "RESTRICT",
});
db.ewayData.belongsTo(db.sales_delivery_challan, { foreignKey: "do_id" });

db.ewayData.hasOne(db.ewayDatalIST, {
  foreignKey: "eway_id",
  onDelete: "RESTRICT",
  as: "ewayDataList",
});
db.ewayDatalIST.belongsTo(db.ewayData, {
  foreignKey: "eway_id",
  as: "ewayData",
});

db.customerProfile.hasMany(db.ewayData, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});

db.states.hasOne(db.ewayData, {
  foreignKey: "ship_from_state_id",
  onDelete: "RESTRICT",
});
db.states.hasOne(db.ewayData, {
  foreignKey: "ship_to_state_id",
  onDelete: "RESTRICT",
});
//////EWAY ENDS

db.addDo.hasMany(db.production, {
  foreignKey: "addDo_id",
  onDelete: "RESTRICT",
});
db.production.belongsTo(db.addDo, { foreignKey: "addDo_id" });
db.addDo.belongsTo(db.proposalData, { foreignKey: "proposal_id" });
db.addDoItem.hasMany(db.production, {
  foreignKey: "doItem_id",
  onDelete: "RESTRICT",
});

//////sales invoice/////

//// Customer Credit Limit
db.customerPaymentTermMaster.hasMany(db.customerCreditLimit, {
  foreignKey: "payment_term_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.customerCreditLimit, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.customerCreditLimit, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.customerCreditLimit, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

///////////////  sales invoice foreign keys 27/05/2026

db.financial_year.hasMany(db.salesInvoiceData, {
  foreignKey: "financial_year_id",
  as: "invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
  as: "financial_year",
});

db.states.hasMany(db.salesInvoiceData, {
  foreignKey: "billing_state_id",
  as: "billingInvoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.states, {
  foreignKey: "billing_state_id",
  as: "billingState",
});

db.states.hasMany(db.salesInvoiceData, {
  foreignKey: "shipping_state_id",
  as: "shippingInvoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.states, {
  foreignKey: "shipping_state_id",
  as: "shippingState",
});

db.states.hasMany(db.salesInvoiceData, {
  foreignKey: "dispatch_state_id",
  as: "DispatchInvoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.states, {
  foreignKey: "dispatch_state_id",
  as: "dispatchState",
});

db.currency_convert.hasMany(db.salesInvoiceData, {
  foreignKey: "currency_id",
  as: "invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.currency_convert, {
  foreignKey: "currency_id",
  as: "currencyData",
});

db.entityMaster.hasMany(db.salesInvoiceData, {
  foreignKey: "entity_id",
  as: "invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  as: "entity",
});

db.customerProfile.hasMany(db.salesInvoiceData, {
  foreignKey: "customer_id",
  as: "invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
  as: "customer",
});

db.user.hasMany(db.salesInvoiceData, {
  foreignKey: "created_by_id",
  as: "created_invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.user, {
  foreignKey: "created_by_id",
  as: "created_by",
});

db.user.hasMany(db.salesInvoiceData, {
  foreignKey: "cancel_by_id",
  as: "cancelled_invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.user, {
  foreignKey: "cancel_by_id",
  as: "cancelled_by",
});

db.user.hasMany(db.salesInvoiceData, {
  foreignKey: "approved_by_id",
  as: "approved_invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.user, {
  foreignKey: "approved_by_id",
  as: "approved_by",
});

db.salesOrder.hasMany(db.salesInvoiceData, {
  foreignKey: "so_id",
  as: "invoices",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.belongsTo(db.salesOrder, {
  foreignKey: "so_id",
  as: "sales_order",
});

db.salesInvoiceData.hasMany(db.salesInvoiceItem, {
  foreignKey: "invoice_id",
  as: "items",
  onDelete: "RESTRICT",
});
db.salesInvoiceItem.belongsTo(db.salesInvoiceData, {
  foreignKey: "invoice_id",
  as: "invoice",
});

db.salesOrderItemNew.hasMany(db.salesInvoiceItem, {
  foreignKey: "so_item_ids",
  as: "invoice_item",
  onDelete: "RESTRICT",
});
db.salesInvoiceItem.belongsTo(db.salesOrderItemNew, {
  foreignKey: "so_item_ids",
  as: "_sales_order_item",
});

db.ItemMaster.hasMany(db.salesInvoiceItem, {
  foreignKey: "item_id",
  as: "invoice_items",
  onDelete: "RESTRICT",
});
db.salesInvoiceItem.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
  as: "item",
});

db.salesInvoiceItem.hasMany(db.salesInvoiceItem, {
  foreignKey: "parent_item_id",
  as: "child_items",
  onDelete: "RESTRICT",
});
db.salesInvoiceItem.belongsTo(db.salesInvoiceItem, {
  foreignKey: "parent_item_id",
  as: "parent_item",
});

db.branding_master.hasMany(db.salesInvoiceItem, {
  foreignKey: "branding_id",
  onDelete: "RESTRICT",
});
db.salesInvoiceItem.belongsTo(db.branding_master, {
  foreignKey: "branding_id",
});

db.salesInvoiceItem.hasMany(db.salesInvoiceCustomBranding, {
  foreignKey: "inv_item_id",
  as: "invoiceBrandingData",
  onDelete: "RESTRICT",
});
db.salesInvoiceCustomBranding.belongsTo(db.salesInvoiceItem, {
  foreignKey: "inv_item_id",
  as: "invoiceBranding",
});

////////////// Direct sales invoice Items keys
db.productcategory.hasMany(db.salesDirectInvoiceItem, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.salesDirectInvoiceItem.belongsTo(db.productcategory, {
  foreignKey: "product_category_id",
});
db.ItemMaster.hasMany(db.salesDirectInvoiceItem, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.salesDirectInvoiceItem.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
});
db.SubCategory.hasMany(db.salesDirectInvoiceItem, {
  foreignKey: "product_sub_category_id",
  onDelete: "RESTRICT",
});
db.salesDirectInvoiceItem.belongsTo(db.SubCategory, {
  foreignKey: "product_sub_category_id",
});
//////////////// Direct sales invoice Items keys

////////////////////Direct sales invoice additional charges keys////////

db.salesDirectInvoiceCharges.belongsTo(db.hsn_sac_master, {
  foreignKey: "charges_hsn_id",
});
db.hsn_sac_master.hasMany(db.salesDirectInvoiceCharges, {
  foreignKey: "charges_hsn_id",
});

db.assignUser.hasOne(db.assignEmployee, {
  foreignKey: "assign_user_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.assignEmployee, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});

db.user.hasOne(db.assignUser, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasOne(db.assignUser, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasOne(db.assignUser, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.assignUser, { foreignKey: "login_id", onDelete: "RESTRICT" });
db.assignUser.hasOne(db.assignEmployee, {
  foreignKey: "assign_user_id",
  onDelete: "RESTRICT",
});

db.tbl_branch.hasOne(db.billingData, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.billingData, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.billingData.hasOne(db.invoiceData, {
  foreignKey: "billing_id",
  onDelete: "RESTRICT",
});

db.ItemMaster.hasMany(db.createLead, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.sourceMaster.hasOne(db.createLead, {
  foreignKey: "source_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.createLead, { foreignKey: "login_id", onDelete: "RESTRICT" });
db.user.hasOne(db.createLead, { foreignKey: "user_id", onDelete: "RESTRICT" });
db.createLead.belongsTo(db.user, { foreignKey: "user_id" });
db.createLead.hasOne(db.createDescription, {
  foreignKey: "create_lead_id",
  onDelete: "RESTRICT",
});
db.createLead.hasOne(db.leadSummary, {
  foreignKey: "create_lead_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.leadSummary, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});

db.createLead.hasOne(db.proposalData, {
  foreignKey: "create_lead_id",
  onDelete: "RESTRICT",
});
db.createLead.hasOne(db.createDescription, {
  foreignKey: "create_lead_id",
  onDelete: "RESTRICT",
});

db.createLead.hasOne(db.proposalData, {
  foreignKey: "create_lead_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.proposalList, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.proposalData, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.proposalPayment, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.billingData, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.invoiceData, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.invoiceData.belongsTo(db.proposalData, { foreignKey: "proposal_id" });
db.proposalData.hasOne(db.versionData, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.dealClose, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.addDo, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.addDo.belongsTo(db.proposalData, { foreignKey: "proposal_id" });

db.proposalData.hasOne(db.proposalList, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.uom.hasOne(db.proposalList, { foreignKey: "uom_id", onDelete: "RESTRICT" });
db.ItemMaster.hasOne(db.proposalList, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.proposalList.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.versionData.hasOne(db.proposalList, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.additionalCharge.hasMany(db.proposalAddtionalCharges, {
  foreignKey: "charge_name_id",
  onDelete: "RESTRICT",
});

db.proposalData.hasMany(db.proposalAddtionalCharges, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.proposalAddtionalCharges.belongsTo(db.proposalData, {
  foreignKey: "proposal_id",
});

db.versionData.hasMany(db.proposalAddtionalCharges, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.proposalAddtionalCharges.belongsTo(db.versionData, {
  foreignKey: "version_id",
});
db.uom.hasOne(db.product__variant_master, {
  foreignKey: "uom_id",
  onDelete: "RESTRICT",
});
db.product__variant_master.belongsTo(db.uom, { foreignKey: "uom_id" });

db.asset.hasMany(db.proposal_scheme_data, {
  foreignKey: "accessory_in_category",
  onDelete: "RESTRICT",
});
db.SubCategory.hasMany(db.proposal_scheme_data, {
  foreignKey: "accessory_in_sub_category",
  onDelete: "RESTRICT",
});
db.accessories_mst_name.hasMany(db.proposal_scheme_data, {
  foreignKey: "accessory_in_name",
  onDelete: "RESTRICT",
});

db.createLeadDetails.hasMany(db.proposal_scheme_type, {
  foreignKey: "proposal_item_id",
  onDelete: "RESTRICT",
});
db.proposal_scheme_type.hasMany(db.proposal_scheme_data, {
  foreignKey: "proposal_scheme_type_id",
  onDelete: "RESTRICT",
});
db.proposal_scheme_type.hasMany(db.proposal_branding_scheme, {
  foreignKey: "proposal_scheme_type_id",
  onDelete: "RESTRICT",
});
db.createLeadDetails.hasMany(db.proposal_branding_scheme, {
  foreignKey: "proposal_item_id",
  onDelete: "RESTRICT",
});

db.customer_item_list.hasMany(db.proposal_scheme_type, {
  foreignKey: "customer_item_id",
  onDelete: "RESTRICT",
});
db.customer_item_list.hasMany(db.proposal_branding_scheme, {
  foreignKey: "customer_item_id",
  onDelete: "RESTRICT",
});

db.asset.hasMany(db.proposal_customisation_data, {
  foreignKey: "accessory_in_category",
  onDelete: "RESTRICT",
});
db.proposal_customisation_data.belongsTo(db.asset, {
  foreignKey: "accessory_in_category",
});

db.SubCategory.hasMany(db.proposal_customisation_data, {
  foreignKey: "accessory_in_sub_category",
  onDelete: "RESTRICT",
});
db.proposal_customisation_data.belongsTo(db.SubCategory, {
  foreignKey: "accessory_in_sub_category",
});

db.accessories_mst_name.hasMany(db.proposal_customisation_data, {
  foreignKey: "accessory_in_name",
  onDelete: "RESTRICT",
});
db.proposal_customisation_data.belongsTo(db.accessories_mst_name, {
  foreignKey: "accessory_in_name",
});

db.Master_basket.hasMany(db.proposal_customisation_data, {
  foreignKey: "basket_mst_id",
  onDelete: "RESTRICT",
});
db.proposal_customisation_data.belongsTo(db.Master_basket, {
  foreignKey: "basket_mst_id",
  onDelete: "RESTRICT",
});
db.Master_basket.hasMany(db.proposal_scheme_data, {
  foreignKey: "basket_mst_id",
  onDelete: "RESTRICT",
});

db.hsn_sac_master.hasMany(db.Master_basket, {
  foreignKey: "hsn_code_id",
  onDelete: "RESTRICT",
});

db.uom.hasMany(db.Master_basket, {
  foreignKey: "uom_id",
  onDelete: "RESTRICT",
});
db.Master_basket.belongsTo(db.uom, { foreignKey: "uom_id" });

db.uom.hasMany(db.branding_master, {
  foreignKey: "uom_id",
  onDelete: "RESTRICT",
});
db.branding_master.belongsTo(db.uom, { foreignKey: "uom_id" });

db.customerProfile.hasMany(db.branding_master, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.branding_master.belongsTo(db.customerProfile, { foreignKey: "customer_id" });

db.ItemMaster.hasMany(db.branding_master, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.branding_master.belongsTo(db.ItemMaster, { foreignKey: "item_id" });

db.uom.hasMany(db.accessories_mst_name, {
  foreignKey: "uom_id",
  onDelete: "RESTRICT",
});
db.accessories_mst_name.belongsTo(db.uom, { foreignKey: "uom_id" });

db.versionData.hasOne(db.dealClose, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.versionData.hasOne(db.proposalList, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});

db.proposalData.hasOne(db.dealClose, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.versionData.hasOne(db.dealClose, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});

db.proposalData.hasOne(db.invoiceData, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.invoiceData.belongsTo(db.proposalData, { foreignKey: "proposal_id" });
db.billingData.hasOne(db.invoiceData, {
  foreignKey: "billing_id",
  onDelete: "RESTRICT",
});

db.dynamicFieldName.hasOne(db.dynamicFieldValue, {
  foreignKey: "field_name_id",
  onDelete: "RESTRICT",
});
db.dynamicFieldValue.belongsTo(db.dynamicFieldName, {
  foreignKey: "field_name_id",
  onDelete: "RESTRICT",
});
db.fieldType.hasMany(db.leadFormSetup, {
  foreignKey: "field_type_id",
  onDelete: "RESTRICT",
});

db.leadFormSetup.hasOne(db.fieldValue, {
  foreignKey: "lead_form_id",
  onDelete: "RESTRICT",
});

db.fieldType.hasOne(db.dynamicFieldName, {
  foreignKey: "field_type_id",
  onDelete: "RESTRICT",
});
db.dynamicFieldName.belongsTo(db.fieldType, {
  foreignKey: "field_type_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasOne(db.proposalPayment, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});

db.fieldType.hasOne(db.dynamicFieldName, {
  foreignKey: "field_type_id",
  onDelete: "RESTRICT",
});
db.dynamicFieldName.belongsTo(db.fieldType, {
  foreignKey: "field_type_id",
  onDelete: "RESTRICT",
});

db.dynamicComponentType.hasOne(db.dynamicFieldName, {
  foreignKey: "component_type_id",
  onDelete: "RESTRICT",
});
db.dynamicFieldName.belongsTo(db.dynamicComponentType, {
  foreignKey: "component_type_id",
  onDelete: "RESTRICT",
});

db.dynamicComponentType.hasOne(db.dynamicFormSetup, {
  foreignKey: "component_type_id",
  onDelete: "RESTRICT",
});
db.dynamicFormSetup.belongsTo(db.dynamicComponentType, {
  foreignKey: "component_type_id",
  onDelete: "RESTRICT",
});

db.financial_year.hasMany(db.leadFormSetup, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.leadFormSetup.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.entityMaster.hasMany(db.leadFormSetup, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.leadFormSetup.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.createLead, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.createLead.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });

db.entityMaster.hasMany(db.createLead, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.createLead.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.asset.hasMany(db.createLeadDetails, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.createLeadDetails.belongsTo(db.asset, { foreignKey: "product_category_id" });

db.ItemMaster.hasMany(db.createLeadDetails, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.createLeadDetails.belongsTo(db.ItemMaster, { foreignKey: "product_id" });

db.createLead.hasMany(db.createLeadDetails, {
  foreignKey: "create_lead_id",
  onDelete: "RESTRICT",
});
db.createLeadDetails.belongsTo(db.createLead, { foreignKey: "create_lead_id" });

db.SubCategory.hasMany(db.createLeadDetails, {
  foreignKey: "pro_sub_cat_id",
  onDelete: "RESTRICT",
});
db.createLeadDetails.belongsTo(db.SubCategory, {
  foreignKey: "pro_sub_cat_id",
});

db.asset.hasMany(db.customer_item_list, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.customer_item_list, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.SubCategory.hasMany(db.customer_item_list, {
  foreignKey: "pro_sub_cat_id",
  onDelete: "RESTRICT",
});

db.customerProfile.hasMany(db.customer_item_list, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.scheme_master_promo_item, {
  foreignKey: "promo_item_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.scheme_master_selected_item, {
  foreignKey: "selected_item_id",
  onDelete: "RESTRICT",
});

db.asset.hasMany(db.scheme_master_promo_item, {
  foreignKey: "promo_category_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.scheme_master_selected_item, {
  foreignKey: "selected_category_id",
  onDelete: "RESTRICT",
});

db.SubCategory.hasMany(db.scheme_master_promo_item, {
  foreignKey: "promo_subcat_id",
  onDelete: "RESTRICT",
});
db.SubCategory.hasMany(db.scheme_master_selected_item, {
  foreignKey: "selected_subcat_id",
  onDelete: "RESTRICT",
});
db.scheme_master.hasMany(db.scheme_master_selected_item, {
  foreignKey: "scheme_mst_id",
  onDelete: "RESTRICT",
});
db.scheme_master.hasMany(db.scheme_master_promo_item, {
  foreignKey: "scheme_mst_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.proposalData, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.entityMaster.hasMany(db.proposalData, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.proposalData.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.asset.hasMany(db.proposalList, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.proposalList.belongsTo(db.asset, { foreignKey: "product_category_id" });

db.SubCategory.hasMany(db.proposalList, {
  foreignKey: "pro_sub_cat_id",
  onDelete: "RESTRICT",
});
db.proposalList.belongsTo(db.SubCategory, { foreignKey: "pro_sub_cat_id" });

db.stockLocation.hasMany(db.dispatchOrder, {
  foreignKey: "stock_location_id",
  onDelete: "RESTRICT",
});
db.dispatchOrder.belongsTo(db.stockLocation, {
  foreignKey: "stock_location_id",
});

db.addDo.hasMany(db.dispatchOrder, {
  foreignKey: "addDo_id",
  onDelete: "RESTRICT",
});
db.dispatchOrder.belongsTo(db.addDo, { foreignKey: "addDo_id" });

//issue master
db.entityMaster.hasMany(db.issueMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.issueMaster, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

//breakdown management
db.entityMaster.hasMany(db.addbreakdown, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.addbreakdown, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.workStation.hasMany(db.addbreakdown, {
  foreignKey: "workstation_id",
  onDelete: "RESTRICT",
});
db.shift.hasMany(db.addbreakdown, {
  foreignKey: "shift_id",
  onDelete: "RESTRICT",
});
db.issueMaster.hasMany(db.addbreakdown, {
  foreignKey: "issue_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.addbreakdown, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.addbreakdownItem, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.addbreakdownItem, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
});
db.addbreakdown.hasMany(db.addbreakdownItem, {
  foreignKey: "breakdown_id",
  onDelete: "RESTRICT",
});

db.ItemMaster.hasMany(db.addbreakdownItem, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.addbreakdownItem, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
});
db.addbreakdown.hasMany(db.addbreakdownItem, {
  foreignKey: "breakdown_id",
  onDelete: "RESTRICT",
});

// maintenance management
db.workStation.hasMany(db.planmaintenance, {
  foreignKey: "workstation_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.planmaintenance, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.vendor_basic_details.hasMany(db.planmaintenance, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.hasMany(db.planmaintenance, {
  foreignKey: "asset_tag_id",
  onDelete: "RESTRICT",
});

db.planmaintenance.hasMany(db.docMaintenance, {
  foreignKey: "plan_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.itemMaintenance, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});

db.asset.hasMany(db.itemMaintenance, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.assetmaintenance, {
  foreignKey: "asset_id",
  onDelete: "RESTRICT",
});

db.asset.hasMany(db.assetmaintenance, {
  foreignKey: "aaset_category_id",
  onDelete: "RESTRICT",
});
db.planmaintenance.hasMany(db.itemMaintenance, {
  foreignKey: "plan_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.planmaintenance, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.planmaintenance, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.planmaintenance.hasMany(db.assetmaintenance, {
  foreignKey: "plan_id",
  onDelete: "RESTRICT",
});
db.planmaintenance.hasMany(db.remarkMaintenance, {
  foreignKey: "plan_id",
  onDelete: "RESTRICT",
});

db.planmaintenance.hasMany(db.maintenanceCheckList, {
  foreignKey: "plan_id",
  onDelete: "RESTRICT",
});
db.Manitenance_Type.hasMany(db.maintenanceCheckList, {
  foreignKey: "maintenance_type_id",
  onDelete: "RESTRICT",
});

// master maintenance
db.workStation.hasMany(db.masterMaintenance, {
  foreignKey: "workstation_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.masterMaintenance, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.masterMaintenance, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.masterMaintenance.hasMany(db.Manitenance_Type, {
  foreignKey: "maintenance_master_id",
  onDelete: "RESTRICT",
});
// -------------------------------------------------------------------------------------------------

///////////////////LMS////////////////
db.lms_course_category =
  require("../LMS/cource-category/model/category-model.js")(
    sequelize,
    Sequelize,
  );
db.lms_course = require("../LMS/course/model/course.js")(sequelize, Sequelize);
db.lms_course_content = require("../LMS/course/model/content.js")(
  sequelize,
  Sequelize,
);
db.lms_course_assessment = require("../LMS/course/model/assesment.js")(
  sequelize,
  Sequelize,
);
db.lms_course_question = require("../LMS/course/model/question.js")(
  sequelize,
  Sequelize,
);
db.lms_assign_course = require("../LMS/course/model/assign_course.js")(
  sequelize,
  Sequelize,
);
db.lms_assign_department =
  require("../LMS/course/model/assign_course_department.js")(
    sequelize,
    Sequelize,
  );
db.lms_assign_designation =
  require("../LMS/course/model/assign_course_designation.js")(
    sequelize,
    Sequelize,
  );
db.lms_assign_employe = require("../LMS/course/model/assign_course_employe.js")(
  sequelize,
  Sequelize,
);
db.lms_submit_assessment =
  require("../LMS/course/model/assessment_submission.js")(sequelize, Sequelize);
db.lms_question_attempt =
  require("../LMS/course/model/assessment_question_attempt.js")(
    sequelize,
    Sequelize,
  );
db.lms_requested_course = require("../LMS/course/model/request_course.js")(
  sequelize,
  Sequelize,
);
db.lms_approval_course =
  require("../LMS/course/model/course_approval_level.js")(sequelize, Sequelize);
db.lms_requested_course_assign =
  require("../LMS/course/model/request_course_assign.js")(sequelize, Sequelize);

db.lms_course.hasMany(db.lms_course_content, {
  foreignKey: "course_id",
  as: "contentData",
  onDelete: "RESTRICT",
});
db.lms_course.hasMany(db.lms_course_assessment, {
  foreignKey: "course_id",
  as: "assesments",
  onDelete: "RESTRICT",
});
db.lms_course_assessment.hasMany(db.lms_course_question, {
  foreignKey: "assessment_id",
  as: "questions",
  onDelete: "RESTRICT",
});
db.lms_course_content.belongsTo(db.lms_course, {
  foreignKey: "course_id",
  as: "course",
  onDelete: "RESTRICT",
});
db.lms_course_assessment.belongsTo(db.lms_course, {
  foreignKey: "course_id",
  as: "course",
  onDelete: "RESTRICT",
});
db.lms_course_question.belongsTo(db.lms_course_assessment, {
  foreignKey: "assessment_id",
  as: "assessment",
  onDelete: "RESTRICT",
});
db.lms_assign_course.hasMany(db.lms_assign_designation, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.lms_assign_course.hasMany(db.lms_assign_department, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.lms_assign_course.hasMany(db.lms_assign_employe, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.lms_assign_designation.belongsTo(db.lms_assign_course, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.lms_assign_department.belongsTo(db.lms_assign_course, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.lms_assign_employe.belongsTo(db.lms_assign_course, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.lms_course_assessment.hasMany(db.lms_submit_assessment, {
  foreignKey: "assesment_id",
  as: "submissions",
  onDelete: "RESTRICT",
});
db.lms_submit_assessment.belongsTo(db.lms_course_assessment, {
  foreignKey: "assesment_id",
  as: "assessment",
  onDelete: "RESTRICT",
});
db.lms_assign_course.hasMany(db.lms_submit_assessment, {
  foreignKey: "assign_id",
  onDelete: "RESTRICT",
});
db.lms_submit_assessment.belongsTo(db.lms_assign_course, {
  foreignKey: "assign_id",
});
db.lms_course.hasMany(db.lms_assign_course, { foreignKey: "course_id" });
db.lms_assign_course.belongsTo(db.lms_course, { foreignKey: "course_id" });
db.lms_course.hasMany(db.lms_requested_course, { foreignKey: "course_id" });
db.lms_requested_course.belongsTo(db.lms_course, { foreignKey: "course_id" });
db.user.hasMany(db.lms_approval_course, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.lms_approval_course, {
  foreignKey: "role_id",
  onDelete: "RESTRICT",
});
db.WorkFlow_Master.hasMany(db.lms_approval_course, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.lms_requested_course.hasMany(db.lms_approval_course, {
  foreignKey: "lms_request_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.lms_approval_course, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.lms_course_question.hasMany(db.lms_question_attempt, {
  foreignKey: "question_id",
  onDelete: "RESTRICT",
});
db.lms_question_attempt.belongsTo(db.lms_course_question, {
  foreignKey: "question_id",
  onDelete: "RESTRICT",
});

// lms according entity
db.entityMaster.hasMany(db.lms_course_category, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.lms_course, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.lms_assign_course, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.lms_assign_department, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.lms_assign_designation, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.lms_assign_employe, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
////////////////////////////////////////////////////////////////

// --------------------------sevice CRM-----------------
db.CRMS_register_complain =
  require("../Service_CRM/RegisterComplain/model/registerComplainModel.js")(
    sequelize,
    Sequelize,
  );
db.CRMS_complain_log =
  require("../Service_CRM/RegisterComplain/model/complaintsLog.js")(
    sequelize,
    Sequelize,
  );
db.CRMS_material_request =
  require("../Service_CRM/RegisterComplain/model/scMaterialRequest.js")(
    sequelize,
    Sequelize,
  );
db.CRMS_material_request_detail =
  require("../Service_CRM/RegisterComplain/model/scMaterialRequestDetail.js")(
    sequelize,
    Sequelize,
  );
db.CRMS_complain_status =
  require("../Service_CRM/RegisterComplain/model/complaintsStatus.js")(
    sequelize,
    Sequelize,
  );
db.CRMS_material_request_allocate =
  require("../Service_CRM/RegisterComplain/model/scMaterialRequestAllocate.js")(
    sequelize,
    Sequelize,
  );

db.Service_Center.hasMany(db.CRMS_register_complain, {
  foreignKey: "service_center_id",
});
db.CRMS_register_complain.belongsTo(db.Service_Center, {
  foreignKey: "service_center_id",
});

db.CRMS_register_complain.hasMany(db.CRMS_complain_log, {
  foreignKey: "register_complain_id",
});
db.CRMS_complain_log.belongsTo(db.CRMS_register_complain, {
  foreignKey: "register_complain_id",
});

db.states.hasOne(db.CRMS_register_complain, {
  foreignKey: "state_id",
});
db.CRMS_register_complain.belongsTo(db.states, {
  foreignKey: "state_id",
});
db.states.hasOne(db.CRMS_register_complain, {
  foreignKey: "state_id",
});
db.CRMS_register_complain.belongsTo(db.states, {
  foreignKey: "state_id",
});

db.CRMS_register_complain.hasMany(db.CRMS_material_request, {
  foreignKey: "register_complain_id",
});
db.CRMS_material_request.belongsTo(db.CRMS_register_complain, {
  foreignKey: "register_complain_id",
});
db.ItemMaster.hasMany(db.CRMS_material_request_detail, {
  foreignKey: "item_master_id",
});
db.CRMS_material_request_detail.belongsTo(db.ItemMaster, {
  foreignKey: "item_master_id",
});
db.asset.hasMany(db.CRMS_material_request_detail, {
  foreignKey: "item_category_id",
});
db.CRMS_material_request_detail.belongsTo(db.asset, {
  foreignKey: "item_category_id",
});
db.CRMS_material_request.hasMany(db.CRMS_material_request_detail, {
  foreignKey: "material_request_id",
});
db.CRMS_material_request_detail.belongsTo(db.CRMS_material_request, {
  foreignKey: "material_request_id",
});

db.CRMS_material_request_detail.hasMany(db.CRMS_material_request_allocate, {
  foreignKey: "material_request_detail_id",
});
db.Service_Center.hasMany(db.CRMS_register_complain, {
  foreignKey: "service_center_id",
});
db.CRMS_register_complain.belongsTo(db.Service_Center, {
  foreignKey: "service_center_id",
});
db.entityMaster.hasMany(db.Service_Center, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.CRMS_register_complain, { foreignKey: "entity_id" });

// job desciption
db.job_descripition.hasMany(db.job_descripition_share_type, {
  foreignKey: "job_id",
  onDelete: "RESTRICT",
});

/// complaint type master
db.entityMaster.hasMany(db.Master_Complaint, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.Master_Complaint, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

/// complaint

db.entityMaster.hasMany(db.complaint, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.complaint, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.complaint, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});
db.area.hasMany(db.complaint, { foreignKey: "area_id", onDelete: "RESTRICT" });
db.user.hasMany(db.complaint, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.Master_Complaint.hasMany(db.complaint, {
  foreignKey: "complaint_type_id",
  onDelete: "RESTRICT",
});
db.complaint.hasMany(db.complaint_doc, {
  foreignKey: "complaint_id",
  onDelete: "RESTRICT",
});
//..................

//Transpot Management >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Vehical Category >>>>>>>>>>>>
db.entityMaster.hasMany(db.vehical_category, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vehical_category, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.fuelType_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.fuelType_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.vehicleType_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vehicleType_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.vehical_category.hasMany(db.vehicleType_master, {
  foreignKey: "vehicle_category_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.transporterType_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.transporterType_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.transportType_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.transportType_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.transporterType_master.hasMany(db.transport_master, {
  foreignKey: "transporter_type_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.transport_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.transport_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.THIRD_PARTY_ORGANIZATION.hasMany(db.transport_master, {
  foreignKey: "organization_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.transport_master, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});

//....................vehicle master
db.entityMaster.hasMany(db.vehicle_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vehicle_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.vehicleType_master.hasMany(db.vehicle_master, {
  foreignKey: "vehicle_type_id",
  onDelete: "RESTRICT",
});
db.fuelType_master.hasMany(db.vehicle_master, {
  foreignKey: "fuel_type_id",
  onDelete: "RESTRICT",
});
db.THIRD_PARTY_ORGANIZATION.hasMany(db.vehicle_master, {
  foreignKey: "organization_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.vehicle_master, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});

//////......vehicle driver
db.entityMaster.hasMany(db.vehicle_driver, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vehicle_driver, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.THIRD_PARTY_ORGANIZATION.hasMany(db.vehicle_driver, {
  foreignKey: "organization_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.vehicle_driver, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});

//////...... Driver mapping
db.transport_master.hasMany(db.drivers_mapping, {
  foreignKey: "transporter_id",
  onDelete: "RESTRICT",
});
db.vehicle_driver.hasMany(db.drivers_mapping, {
  foreignKey: "driver_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.drivers_mapping, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.drivers_mapping, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.drivers_mapping, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.drivers_mapping, {
  foreignKey: "updatedBy",
  onDelete: "RESTRICT",
});

//////...... Vehicle mapping
db.transport_master.hasMany(db.vehicles_mapping, {
  foreignKey: "transporter_id",
  onDelete: "RESTRICT",
});
db.vehicle_master.hasMany(db.vehicles_mapping, {
  foreignKey: "vehicle_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.vehicles_mapping, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vehicles_mapping, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.vehicles_mapping, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.vehicles_mapping, {
  foreignKey: "updatedBy",
  onDelete: "RESTRICT",
});

//////...... Rate Agreement
db.transport_master.hasMany(db.rateAgreement_master, {
  foreignKey: "transporter_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.rateAgreement_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.rateAgreement_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.THIRD_PARTY_ORGANIZATION.hasMany(db.rateAgreement_master, {
  foreignKey: "organization_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.rateAgreement_master, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.rateAgreement_master, {
  foreignKey: "updatedBy",
  onDelete: "RESTRICT",
});

db.rateAgreement_master.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "rate_agreement_id",
  onDelete: "RESTRICT",
});
db.vehicleType_master.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "vehicle_type_id",
  onDelete: "RESTRICT",
});
db.rateAgreementDetails_mapping.belongsTo(db.vehicleType_master, {
  foreignKey: "vehicle_type_id",
});

db.states.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "from_state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "from_city_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "to_state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "to_city_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "createdBy",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.rateAgreementDetails_mapping, {
  foreignKey: "updatedBy",
  onDelete: "RESTRICT",
});
db.rateAgreementDetails_mapping.belongsTo(db.city, {
  as: "fromCity",
  foreignKey: "from_city_id",
});
db.rateAgreementDetails_mapping.belongsTo(db.city, {
  as: "toCity",
  foreignKey: "to_city_id",
});

db.asset.hasMany(db.SubCategory, {
  foreignKey: "item_category_id",
  onDelete: "RESTRICT",
});
db.SubCategory.belongsTo(db.asset, { foreignKey: "item_category_id" });

db.SubCategory.hasMany(db.ItemMaster, {
  foreignKey: "sub_category_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.SubCategory, { foreignKey: "sub_category_id" });

db.entityMaster.hasMany(db.SubCategory, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.SubCategory.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.SubCategory, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.SubCategory.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.asset.hasMany(db.productSubCategory, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.productSubCategory.belongsTo(db.asset, {
  foreignKey: "product_category_id",
});

db.SubCategory.hasMany(db.productSubCategory, {
  foreignKey: "product_sub_category_id",
  onDelete: "RESTRICT",
});
db.productSubCategory.belongsTo(db.SubCategory, {
  foreignKey: "product_sub_category_id",
});

db.entityMaster.hasMany(db.productSubCategory, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.productSubCategory.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.productSubCategory, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.productSubCategory.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.scheme_master.hasMany(db.createLeadDetails, {
  foreignKey: "scheme_id",
  onDelete: "RESTRICT",
});
db.scheme_master.hasMany(db.customer_item_list, {
  foreignKey: "scheme_id",
  onDelete: "RESTRICT",
});

db.scheme_master.hasMany(db.salesOrderItemList, {
  foreignKey: "scheme_id",
  onDelete: "RESTRICT",
});
db.scheme_master.hasMany(db.salesOrderPOItemList, {
  foreignKey: "scheme_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.customer_category, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.customer_category.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.customer_category, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.customer_category.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.customer_category.hasMany(db.customersubcategory, {
  foreignKey: "customer_category_id",
  onDelete: "RESTRICT",
});
db.customersubcategory.belongsTo(db.customer_category, {
  foreignKey: "customer_category_id",
});

db.customersubcategory.hasMany(db.customermicrocategory, {
  foreignKey: "customer_sub_category_id",
  onDelete: "RESTRICT",
});
db.customermicrocategory.belongsTo(db.customersubcategory, {
  foreignKey: "customer_sub_category_id",
});

db.entityMaster.hasMany(db.customersubcategory, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.customersubcategory.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.customersubcategory, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.customersubcategory.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.customer_category.hasMany(db.customermicrocategory, {
  foreignKey: "customer_category_id",
  onDelete: "RESTRICT",
});
db.customermicrocategory.belongsTo(db.customer_category, {
  foreignKey: "customer_category_id",
});

db.entityMaster.hasMany(db.customermicrocategory, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.customermicrocategory.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.financial_year.hasMany(db.customermicrocategory, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.customermicrocategory.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.entityMaster.hasMany(db.customerProfile, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.customerProfile, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.customerIndustryType.hasMany(db.customerProfile, {
  foreignKey: "customer_industry_type_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.customerIndustryType, {
  foreignKey: "customer_industry_type_id",
});

db.customerType.hasMany(db.customerProfile, {
  foreignKey: "customer_type_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.customerType, {
  foreignKey: "customer_type_id",
});

db.customer_category.hasMany(db.customerProfile, {
  foreignKey: "customer_category_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.customer_category, {
  foreignKey: "customer_category_id",
});

db.customersubcategory.hasMany(db.customerProfile, {
  foreignKey: "customer_sub_category_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.customersubcategory, {
  foreignKey: "customer_sub_category_id",
});

db.customermicrocategory.hasMany(db.customerProfile, {
  foreignKey: "customer_micro_category_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.customermicrocategory, {
  foreignKey: "customer_micro_category_id",
});

db.user.hasMany(db.customerProfile, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.customerProfile.belongsTo(db.user, { foreignKey: "employee_id" });

db.city.hasMany(db.customerBilling, {
  foreignKey: "city_id",
  onDelete: "RESTRICT",
});
db.customerBilling.belongsTo(db.city, { foreignKey: "city_id" });

db.states.hasMany(db.customerBilling, {
  foreignKey: "states_id",
  onDelete: "RESTRICT",
});
db.customerBilling.belongsTo(db.states, { foreignKey: "states_id" });

db.countryss.hasMany(db.customerBilling, {
  foreignKey: "countryss_id",
  onDelete: "RESTRICT",
});
db.customerBilling.belongsTo(db.countryss, { foreignKey: "countryss_id" });
db.city.hasMany(db.customerShippingAddress, {
  foreignKey: "shipping_city_id",
  onDelete: "RESTRICT",
});
db.customerShippingAddress.belongsTo(db.city, {
  foreignKey: "shipping_city_id",
});

db.states.hasMany(db.customerShippingAddress, {
  foreignKey: "shipping_state_id",
  onDelete: "RESTRICT",
});
db.customerShippingAddress.belongsTo(db.states, {
  foreignKey: "shipping_state_id",
});

db.countryss.hasMany(db.customerShippingAddress, {
  foreignKey: "shipping_country_id",
  onDelete: "RESTRICT",
});
db.customerShippingAddress.belongsTo(db.countryss, {
  foreignKey: "shipping_country_id",
});
db.city.hasMany(db.customerBillingAddress, {
  foreignKey: "billing_city_id",
  onDelete: "RESTRICT",
});
db.customerBillingAddress.belongsTo(db.city, { foreignKey: "billing_city_id" });

db.states.hasMany(db.customerBillingAddress, {
  foreignKey: "billing_state_ids",
  onDelete: "RESTRICT",
});
db.customerBillingAddress.belongsTo(db.states, {
  foreignKey: "billing_state_id",
});

db.countryss.hasMany(db.customerBillingAddress, {
  foreignKey: "billing_country_id",
  onDelete: "RESTRICT",
});
db.customerBillingAddress.belongsTo(db.countryss, {
  foreignKey: "billing_country_id",
});

db.customerAddress.hasMany(db.versionData, {
  foreignKey: "billing_address_id",
});
db.versionData.belongsTo(db.customerAddress, {
  foreignKey: "billing_address_id",
});

db.customerShippingAddress.hasMany(db.versionData, {
  foreignKey: "shipping_address_id",
});
db.versionData.belongsTo(db.customerShippingAddress, {
  foreignKey: "shipping_address_id",
});

db.currency_convert.hasMany(db.versionData, { foreignKey: "currency_id" });
db.versionData.belongsTo(db.currency_convert, { foreignKey: "currency_id" });

db.customerProfile.hasMany(db.customerShippingAddress, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customerShippingAddress.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.customerProfile.hasMany(db.customerBillingAddress, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customerBillingAddress.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});
db.city.hasMany(db.customerDelivery, {
  foreignKey: "city_id",
  onDelete: "RESTRICT",
});
db.customerDelivery.belongsTo(db.city, { foreignKey: "city_id" });

db.states.hasMany(db.customerDelivery, {
  foreignKey: "states_id",
  onDelete: "RESTRICT",
});
db.customerDelivery.belongsTo(db.states, { foreignKey: "states_id" });

db.countryss.hasMany(db.customerDelivery, {
  foreignKey: "countryss_id",
  onDelete: "RESTRICT",
});
db.customerDelivery.belongsTo(db.countryss, { foreignKey: "countryss_id" });

db.customerProfile.hasMany(db.customerBilling, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customerBilling.belongsTo(db.customerProfile, { foreignKey: "customer_id" });

db.customerProfile.hasMany(db.customer_document, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customer_document.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.customerProfile.hasMany(db.customerDelivery, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customerDelivery.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.customerProfile.hasMany(db.customerBank, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customerBank.belongsTo(db.customerProfile, { foreignKey: "customer_id" });

db.entityMaster.hasMany(db.ItemGroup, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ItemGroup.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.ItemGroup, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.ItemGroup.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });
db.customerType.hasMany(db.customer_category, {
  foreignKey: "custm_type_id",
  onDelete: "RESTRICT",
});
db.customer_category.belongsTo(db.customerType, {
  foreignKey: "custm_type_id",
});
db.entityMaster.hasMany(db.asset, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.asset.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.ItemMaster.hasMany(db.product_image, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.product_image.belongsTo(db.ItemMaster, { foreignKey: "product_master_id" });

db.entityMaster.hasMany(db.ProductGroup, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ProductGroup.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.ProductGroup, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.ProductGroup.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});
// warehouse management model foreign key

db.warehousemanagement.belongsTo(db.documentTypeMaster, {
  foreignKey: "document_type_id",
});
db.documentTypeMaster.hasMany(db.warehousemanagement, {
  foreignKey: "document_type_id",
});

db.warehousemanagement.belongsTo(db.asset, { foreignKey: "item_id" });
db.asset.hasMany(db.warehousemanagement, { foreignKey: "item_id" });

db.warehousemanagement.belongsTo(db.SubCategory, {
  foreignKey: "sub_category_id",
});
db.SubCategory.hasMany(db.warehousemanagement, {
  foreignKey: "sub_category_id",
});

db.warehousemanagement.belongsTo(db.ItemMaster, { foreignKey: "item_name_id" });
db.ItemMaster.hasMany(db.warehousemanagement, { foreignKey: "item_name_id" });

db.warehousemanagement.belongsTo(db.warehouse, { foreignKey: "warehouse_id" });
db.warehouse.hasMany(db.warehousemanagement, { foreignKey: "warehouse_id" });

db.warehousemanagement.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});
db.vendor_basic_details.hasMany(db.warehousemanagement, {
  foreignKey: "vendor_id",
});

db.warehouseManagementMapping.belongsTo(db.warehousemanagement, {
  foreignKey: "warehousemanagement_id",
  as: "mappings",
});
db.warehousemanagement.hasMany(db.warehouseManagementMapping, {
  foreignKey: "warehousemanagement_id",
  as: "mappings",
});
db.salesOrderDispatched.belongsTo(db.salesOrder, {
  foreignKey: "sales_order_id",
});
db.salesOrder.hasMany(db.salesOrderDispatched, {
  foreignKey: "sales_order_id",
});

db.salesOrderDispatched.belongsTo(db.financial_year, {
  foreignKey: "financial_id",
});
db.financial_year.hasMany(db.salesOrderDispatched, {
  foreignKey: "financial_id",
});

db.salesOrderDispatched.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.salesOrderDispatched, { foreignKey: "entity_id" });
db.reserveSerialNo.belongsTo(db.salesOrderDispatched, {
  foreignKey: "dispatched_id",
});
db.salesOrderDispatched.hasMany(db.reserveSerialNo, {
  foreignKey: "dispatched_id",
});

db.reserveSerialNo.belongsTo(db.warehouseManagementMapping, {
  foreignKey: "warehouse_mapping_id",
});
db.warehouseManagementMapping.hasMany(db.reserveSerialNo, {
  foreignKey: "warehouse_mapping_id",
});
db.ItemMaster.hasMany(db.warehouseManagementMapping, { foreignKey: "item_id" });
db.warehouseManagementMapping.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
});
db.needType.hasMany(db.financeProfitCenter, {
  foreignKey: "need_type_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.financeProfitCenter, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.financeProfitCenter, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.financeProfitCenter, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.cost_center, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.cost_center, {
  foreignKey: "manager_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});

db.customerProfile.belongsTo(db.price_master, { foreignKey: "price_type_id" });
db.price_master.hasMany(db.customerProfile, {
  foreignKey: "price_type_id",
  onDelete: "RESTRICT",
});
db.proposalList.hasMany(db.scheme_master, { foreignKey: "proposal_id" });
db.scheme_master.belongsTo(db.proposalList, { foreignKey: "proposal_id" });
db.customerProfile.hasMany(db.customer_business_details, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customer_business_details.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});

db.stockTransfernew.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.warehouse, { foreignKey: "entity_id" });

db.stockTransfernew.belongsTo(db.warehouse, {
  foreignKey: "source_warehouse_id",
});

db.stockTransfernew.belongsTo(db.warehouse, {
  foreignKey: "target_warehouse_id",
});

db.stockTransferListnew.belongsTo(db.stockTransfernew, {
  foreignKey: "stock_transfer_id",
});
db.stockTransfernew.hasMany(db.stockTransferListnew, {
  foreignKey: "stock_transfer_id",
});

db.stockTransferListnew.belongsTo(db.ItemMaster, { foreignKey: "item_id" });
db.ItemMaster.hasMany(db.stockTransferListnew, { foreignKey: "item_id" });

db.stockTransferSerialnew.belongsTo(db.stockTransferListnew, {
  foreignKey: "stock_transfer_list_id",
});
db.stockTransferListnew.hasMany(db.stockTransferSerialnew, {
  foreignKey: "stock_transfer_list_id",
});

db.stockTransferSerialnew.belongsTo(db.grnItemStatus, {
  foreignKey: "grn_item_status_id",
});
db.grnItemStatus.hasMany(db.stockTransferSerialnew, {
  foreignKey: "grn_item_status_id",
});

/* ── Layout FK associations for STOCK_TRANSFER_NEW ──────────────────────────
   Mirrors WAREHOUSE_ALLOCATION layout columns:
     bay_id  → WAREHOUSE_BAY   (WAREHOUSE_BIFURCATION_Row in DB FK)
     rack_id → WAREHOUSE_RACK  (WAREHOUSE_BIFURCATION_SELF in DB FK)
     bin_id  → WAREHOUSE_BIN   (WAREHOUSE_BIFURCATION_SECTION in DB FK)
   source_row_id / target_row_id     → WAREHOUSE_BAY
   source_shelf_id / target_shelf_id → WAREHOUSE_RACK
   source_section_id / target_section_id → WAREHOUSE_BIN
   ─────────────────────────────────────────────────────────────────────────── */
db.stockTransfernew.belongsTo(db.WAREHOUSE_BAY, {
  foreignKey: "source_row_id",
  as: "sourceBay",
});
db.stockTransfernew.belongsTo(db.WAREHOUSE_BAY, {
  foreignKey: "target_row_id",
  as: "targetBay",
});
db.stockTransfernew.belongsTo(db.WAREHOUSE_RACK, {
  foreignKey: "source_shelf_id",
  as: "sourceRack",
});
db.stockTransfernew.belongsTo(db.WAREHOUSE_RACK, {
  foreignKey: "target_shelf_id",
  as: "targetRack",
});
db.stockTransfernew.belongsTo(db.WAREHOUSE_BIN, {
  foreignKey: "source_section_id",
  as: "sourceBin",
});
db.stockTransfernew.belongsTo(db.WAREHOUSE_BIN, {
  foreignKey: "target_section_id",
  as: "targetBin",
});

db.WAREHOUSE_BAY.hasMany(db.stockTransfernew, {
  foreignKey: "source_row_id",
  as: "sourceTransfers",
});
db.WAREHOUSE_BAY.hasMany(db.stockTransfernew, {
  foreignKey: "target_row_id",
  as: "targetTransfers",
});
db.WAREHOUSE_RACK.hasMany(db.stockTransfernew, {
  foreignKey: "source_shelf_id",
  as: "sourceRackTransfers",
});
db.WAREHOUSE_RACK.hasMany(db.stockTransfernew, {
  foreignKey: "target_shelf_id",
  as: "targetRackTransfers",
});
db.WAREHOUSE_BIN.hasMany(db.stockTransfernew, {
  foreignKey: "source_section_id",
  as: "sourceBinTransfers",
});
db.WAREHOUSE_BIN.hasMany(db.stockTransfernew, {
  foreignKey: "target_section_id",
  as: "targetBinTransfers",
});
db.customerProfile.hasMany(db.customer_business_details, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.customer_business_details.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});
db.purchase_order.hasMany(db.grnVersion, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnVersion.hasMany(db.grnMaster, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.grnVersion.hasMany(db.grnItem, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});

db.customerProfile.hasMany(db.customerCreditDebit, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.paymentAdvice, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.paymentAdvice.hasMany(db.paymentAdviceAccount, {
  foreignKey: "payment_advice_id",
  onDelete: "RESTRICT",
});
db.paymentAdvice.hasMany(db.paymentAdviceDoc, {
  foreignKey: "payment_advice_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.paymentAdvice, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.paymentAdviceAccount, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.paymentAdviceAccount, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.paymentAdviceAccount, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.paymentAdviceAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.paymentAdviceAccount, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.bankReciept, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.bankReciept.hasMany(db.bankRecieptAccount, {
  foreignKey: "bank_reciept_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.bankReciept, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.bankRecieptAccount, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.bankRecieptAccount, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.bankRecieptAccount, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.bankRecieptAccount, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.bankRecieptAccount, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.bankRecieptAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.bankReciept.hasMany(db.bankRecieptDoc, {
  foreignKey: "bank_reciept_id",
  onDelete: "RESTRICT",
});
db.createBank.hasMany(db.bankRecieptAccount, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});

db.tbl_branch.hasMany(db.bankPayment, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.purchaseJournal.hasMany(db.bankPayment, {
  foreignKey: "purchase_journal_id",
  onDelete: "RESTRICT",
});
db.bankPayment.hasMany(db.bankPaymentAccount, {
  foreignKey: "bank_payment_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.bankPayment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.bankPaymentAccount, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.bankPaymentAccount, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.bankPaymentAccount, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.bankPaymentAccount, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.bankPaymentAccount, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.bankPaymentAccount, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.createBankAccount.hasMany(db.bankPaymentAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
// db.createBank.hasMany(db.bankPaymentAccount, { foreignKey: "bank_id", onDelete: 'RESTRICT' });
db.tds.hasMany(db.bankPaymentAccount, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.bankPaymentAccount, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.bankPaymentAccount, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.bankPayment.hasMany(db.bankPaymentDoc, {
  foreignKey: "bank_payment_id",
  onDelete: "RESTRICT",
});

db.tbl_branch.hasMany(db.salesJournal, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.salesJournal, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.salesJournal, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.salesJournal.hasMany(db.salesJournalAccount, {
  foreignKey: "sales_journal_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.salesJournalAccount, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.salesJournalAccount, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.salesJournalAccount, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.purchaseJournal, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.purchaseJournal, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.purchaseJournal, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.purchaseJournal.hasMany(db.purchaseJournalAccount, {
  foreignKey: "purchase_journal_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.purchaseJournalAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.purchaseJournalAccount, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.purchaseJournalAccount, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.purchaseJournalAccount, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.purchaseJournalAccount, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.purchaseJournalAccount, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.createBank.hasMany(db.poPayment, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.poPayment, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.poPayment, {
  foreignKey: "chart_of_account_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.PaymentModel, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.PaymentModel, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

db.purchase_order.hasMany(db.PaymentModel, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.PaymentModel.belongsTo(db.purchase_order, { foreignKey: "po_id" });

db.grnVersion.hasMany(db.PaymentModel, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.PaymentModel.belongsTo(db.grnVersion, { foreignKey: "version_id" });

db.grnVersion.hasMany(db.poPaymentAddtion, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.poPaymentAddtion.belongsTo(db.grnVersion, { foreignKey: "version_id" });

db.vendor_basic_details.hasMany(db.poPaymentAddtion, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.poPaymentAddtion.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.createBank.hasMany(db.PaymentModel, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.PaymentModel.belongsTo(db.createBank, { foreignKey: "bank_id" });
db.proposalList.hasMany(db.proposal_branding, {
  foreignKey: "proposal_item_id",
  onDelete: "RESTRICT",
});
db.scheme_master.hasMany(db.proposalList, {
  foreignKey: "scheme_id",
  onDelete: "RESTRICT",
});
db.proposalList.hasMany(db.proposal_customisation_type, {
  foreignKey: "proposal_item_id",
  onDelete: "RESTRICT",
});
db.proposal_customisation_type.hasMany(db.proposal_customisation_data, {
  foreignKey: "proposal_customisation_id",
  onDelete: "RESTRICT",
});
db.proposal_customisation_type.hasMany(db.proposal_branding, {
  foreignKey: "proposal_customisation_id",
  onDelete: "RESTRICT",
});
db.versionData.hasMany(db.proposal_branding, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.versionData.hasMany(db.proposal_customisation_type, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.proposal_performa_invoice, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.belongsTo(db.proposalData, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.versionData.hasMany(db.proposal_performa_invoice, {
  foreignKey: "version_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.proposal_performa_invoice, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.proposal_performa_invoice, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.proposal_performa_invoice, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.salesBooking, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.salesBooking, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.salesBooking, {
  foreignKey: "proposal_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.salesBooking, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.salesBooking.hasMany(db.salesBookingItem, {
  foreignKey: "sale_booking_id",
  onDelete: "RESTRICT",
});

db.asset.hasMany(db.salesBookingItem, {
  foreignKey: "product_category_id",
  onDelete: "RESTRICT",
});
db.SubCategory.hasMany(db.salesBookingItem, {
  foreignKey: "product_sub_category_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.salesBookingItem, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.scheme_master.hasMany(db.salesBookingItem, {
  foreignKey: "scheme_id",
  onDelete: "RESTRICT",
});
db.createPostingPeriod.hasMany(db.createAdditionalPostingPeriodMonth, {
  foreignKey: "posting_period_id",
});

db.createAdditionalPostingPeriodMonth.belongsTo(db.createPostingPeriod, {
  foreignKey: "posting_period_id",
});

// direct invoice
db.createChartOfAccounts.hasMany(db.direct_invoice_payment, {
  foreignKey: "coa_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.directInvoice, {
  foreignKey: "coa_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.directInvoice, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.directInvoice, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.directInvoice.hasMany(db.directInvoiceItems, {
  foreignKey: "direct_invoice_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.directInvoiceItems, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.directInvoice.hasMany(db.directInvoiceService, {
  foreignKey: "direct_invoice_id",
  onDelete: "RESTRICT",
});
db.Service_master.hasMany(db.directInvoiceService, {
  foreignKey: "service_id",
  onDelete: "RESTRICT",
});
db.ServicesCategory.hasMany(db.directInvoiceService, {
  foreignKey: "service_category",
  onDelete: "RESTRICT",
});

db.documentType.hasMany(db.directInvoice, {
  foreignKey: "document_type_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.directInvoice, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.directInvoice, {
  foreignKey: "chart_of_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.directInvoice, {
  foreignKey: "cash_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.directInvoice, {
  foreignKey: "purchase_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.directInvoice, {
  foreignKey: "purchase_vat_account_id",
  onDelete: "RESTRICT",
});
db.createBank.hasMany(db.directInvoice, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
// =============================///////////////////////////////============================

db.trip_expense_master.hasMany(db.expense_trip, {
  foreignKey: "expense_category_id",
  onDelete: "RESTRICT",
});
db.expense_trip.belongsTo(db.trip_expense_master, {
  foreignKey: "expense_category_id",
});

db.scheduleTrip.hasMany(db.expense_trip, {
  foreignKey: "trip_id",
  onDelete: "RESTRICT",
});
db.expense_trip.belongsTo(db.scheduleTrip, { foreignKey: "trip_id" });

db.scheduleTrip.hasMany(db.scheduleTripDocument, {
  foreignKey: "trip_id",
  onDelete: "RESTRICT",
});
db.scheduleTripDocument.belongsTo(db.scheduleTrip, { foreignKey: "trip_id" });

db.vehical_category.hasMany(db.scheduleTrip, {
  foreignKey: "vehicle_category_id",
  onDelete: "RESTRICT",
});
db.scheduleTrip.belongsTo(db.vehical_category, {
  foreignKey: "vehicle_category_id",
});

db.vehicle_master.hasMany(db.scheduleTrip, {
  foreignKey: "vehicle_master_id",
  onDelete: "RESTRICT",
});
db.scheduleTrip.belongsTo(db.vehicle_master, {
  foreignKey: "vehicle_master_id",
});

db.vehicle_driver.hasMany(db.scheduleTrip, {
  foreignKey: "vehicle_driver_id",
  onDelete: "RESTRICT",
});
db.scheduleTrip.belongsTo(db.vehicle_driver, {
  foreignKey: "vehicle_driver_id",
});
db.entityMaster.hasMany(db.scheduleTrip, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.scheduleTrip.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.financial_year.hasMany(db.scheduleTrip, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.scheduleTrip.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.transportRequest.hasMany(db.scheduleTrip, {
  foreignKey: "transport_req_id",
  onDelete: "RESTRICT",
});
db.scheduleTrip.belongsTo(db.transportRequest, {
  foreignKey: "transport_req_id",
});

db.scheduleTrip.hasMany(db.expense_trip, {
  foreignKey: "trip_id",
  onDelete: "RESTRICT",
});
db.expense_trip.belongsTo(db.scheduleTrip, { foreignKey: "trip_id" });

db.scheduleTrip.hasMany(db.scheduleTripDocument, {
  foreignKey: "trip_id",
  onDelete: "RESTRICT",
});
db.scheduleTripDocument.belongsTo(db.scheduleTrip, { foreignKey: "trip_id" });

db.asset.hasMany(db.transItemDetail, {
  foreignKey: "asset_id",
  onDelete: "RESTRICT",
});
db.transItemDetail.belongsTo(db.asset, { foreignKey: "asset_id" });

db.ItemMaster.hasMany(db.transItemDetail, {
  foreignKey: "item_master_id",
  onDelete: "RESTRICT",
});
db.transItemDetail.belongsTo(db.ItemMaster, { foreignKey: "item_master_id" });

db.tbl_itemType.hasMany(db.transItemDetail, {
  foreignKey: "item_type_id",
  onDelete: "RESTRICT",
});
db.transItemDetail.belongsTo(db.tbl_itemType, { foreignKey: "item_type_id" });

db.transportRequest.hasMany(db.transItemDetail, {
  foreignKey: "tran_req_id",
  onDelete: "RESTRICT",
});
db.transItemDetail.belongsTo(db.transportRequest, {
  foreignKey: "tran_req_id",
});
db.transportRequest.hasMany(db.transportReqProductDetail, {
  foreignKey: "tran_req_id",
  onDelete: "RESTRICT",
});
db.transportReqProductDetail.belongsTo(db.transportRequest, {
  foreignKey: "tran_req_id",
});
db.transportRequest.hasMany(db.transportApprovalLevel, {
  foreignKey: "trans_id",
  onDelete: "RESTRICT",
});
db.transportApprovalLevel.belongsTo(db.transportRequest, {
  foreignKey: "trans_id",
});

db.financial_year.hasMany(db.transportRequest, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
});

db.entityMaster.hasMany(db.transportRequest, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.city.hasMany(db.transportRequest, {
  foreignKey: "pick_city_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.city, { foreignKey: "pick_city_id" });

db.states.hasMany(db.transportRequest, {
  foreignKey: "pick_state_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.states, { foreignKey: "pick_state_id" });

db.countryss.hasMany(db.transportRequest, {
  foreignKey: "pick_country_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.countryss, { foreignKey: "pick_country_id" });

db.city.hasMany(db.transportRequest, {
  foreignKey: "delivery_city_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.city, { foreignKey: "delivery_city_id" });

db.states.hasMany(db.transportRequest, {
  foreignKey: "delivery_state_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.states, { foreignKey: "delivery_state_id" });

db.countryss.hasMany(db.transportRequest, {
  foreignKey: "delivery_country_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.countryss, {
  foreignKey: "delivery_country_id",
});

db.department.hasMany(db.transportRequest, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.department, { foreignKey: "department_id" });

db.transportRequest.hasMany(db.transItemDetail, {
  foreignKey: "tran_req_id",
  onDelete: "RESTRICT",
});
db.transItemDetail.belongsTo(db.transportRequest, {
  foreignKey: "tran_req_id",
});

db.uom.hasMany(db.transItemDetail, {
  foreignKey: "uom_id",
  onDelete: "RESTRICT",
});
db.transItemDetail.belongsTo(db.uom, { foreignKey: "uom_id" });

db.vehical_category.hasMany(db.transportRequest, {
  foreignKey: "vehicle_category_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.vehical_category, {
  foreignKey: "vehicle_category_id",
});

db.vehicle_master.hasMany(db.transportRequest, {
  foreignKey: "vehicle_master_id",
  onDelete: "RESTRICT",
});
db.transportRequest.belongsTo(db.vehicle_master, {
  foreignKey: "vehicle_master_id",
});

db.product__variant_master.hasMany(db.transportReqProductDetail, {
  foreignKey: "variant_id",
  onDelete: "RESTRICT",
});
db.transportReqProductDetail.belongsTo(db.product__variant_master, {
  foreignKey: "variant_id",
});

db.ItemMaster.hasMany(db.transportReqProductDetail, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.transportReqProductDetail.belongsTo(db.ItemMaster, {
  foreignKey: "product_master_id",
});

db.productcategory.hasMany(db.transportReqProductDetail, {
  foreignKey: "product_cat_id",
  onDelete: "RESTRICT",
});
db.transportReqProductDetail.belongsTo(db.productcategory, {
  foreignKey: "product_cat_id",
});

db.Work_Flow_range.hasMany(db.transportApprovalLevel, {
  foreignKey: "workflow_range_id",
  onDelete: "RESTRICT",
});
db.transportApprovalLevel.belongsTo(db.Work_Flow_range, {
  foreignKey: "workflow_range_id",
});
db.user.hasMany(db.transportApprovalLevel, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.transportApprovalLevel.belongsTo(db.user, { foreignKey: "employee_id" });

// Vehicle Planning
db.vehiclePlanningMst =
  require("../Warehouse/VehiclePlanning/model/vehiclePlanning.js")(
    sequelize,
    Sequelize,
  );
db.vehiclePlanningSo =
  require("../Warehouse/VehiclePlanning/model/vehiclePlanningSo.js")(
    sequelize,
    Sequelize,
  );
db.vehiclePlanningTransporter =
  require("../Warehouse/VehiclePlanning/model/vehiclePlanningTransporter.js")(
    sequelize,
    Sequelize,
  );
db.vehiclePlanningTransCharge =
  require("../Warehouse/VehiclePlanning/model/vehiclPlanningCharges.js")(
    sequelize,
    Sequelize,
  );
db.vehiclePlanningTransporterAgreement =
  require("../Warehouse/VehiclePlanning/model/vehiclePlaningRateAgreement.js")(
    sequelize,
    Sequelize,
  );
db.vehicleGateInOutword =
  require("../../app/Warehouse/VehiclePlanning/model/vehicleGateInOut.js")(
    sequelize,
    Sequelize,
  );

db.user.hasMany(db.vehiclePlanningMst, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});

db.vehiclePlanningMst.belongsTo(db.user, {
  foreignKey: "created_by",
});

db.user.hasMany(db.vehicleGateInOutword, {
  foreignKey: {
    name: "gateIn_updated_by",
    field: "gateIn_updated_by",
    allowNull: true,
  },
  as: "getInByUser",
  onDelete: "RESTRICT",
});
db.vehicleGateInOutword.belongsTo(db.user, {
  foreignKey: {
    name: "gateIn_updated_by",
    field: "gateIn_updated_by",
    allowNull: true,
  },
  as: "getInByUser",
});

db.user.hasMany(db.vehicleGateInOutword, {
  foreignKey: {
    name: "gateOut_updated_by",
    field: "gateOut_updated_by",
    allowNull: true,
  },
  as: "getOutByUser",
  onDelete: "RESTRICT",
});
db.vehicleGateInOutword.belongsTo(db.user, {
  foreignKey: {
    name: "gateOut_updated_by",
    field: "gateOut_updated_by",
    allowNull: true,
  },
  as: "getOutByUser",
});

db.user.hasMany(db.vehicleGateInOutword, {
  foreignKey: {
    name: "picklist_updated_by",
    field: "picklist_updated_by",
    allowNull: true,
  },
  as: "picklistUpdatedBy",
  onDelete: "RESTRICT",
});
db.vehicleGateInOutword.belongsTo(db.user, {
  foreignKey: {
    name: "picklist_updated_by",
    field: "picklist_updated_by",
    allowNull: true,
  },
  as: "picklistUpdatedBy",
});

db.user.hasMany(db.vehicleGateInOutword, {
  foreignKey: {
    name: "lr_updated_by",
    field: "lr_updated_by",
    allowNull: true,
  },
  as: "lrUpdatedBy",
  onDelete: "RESTRICT",
});
db.vehicleGateInOutword.belongsTo(db.user, {
  foreignKey: {
    name: "lr_updated_by",
    field: "lr_updated_by",
    allowNull: true,
  },
  as: "lrUpdatedBy",
});

db.vehiclePlanningMst.hasMany(db.vehicleGateInOutword, {
  foreignKey: "vehicle_planing_id",
  allowNull: true,
  as: "vehiclePlaningMst",
  onDelete: "RESTRICT",
});
db.vehicleGateInOutword.belongsTo(db.vehiclePlanningMst, {
  foreignKey: "vehicle_planing_id",
  allowNull: true,
  as: "vehiclePlaningMst",
});

db.warehouse.hasMany(db.vehicleGateInOutword, {
  foreignKey: "warehouse_id",
  allowNull: true,
  as: "warehouseMst",
  onDelete: "RESTRICT",
});
db.vehicleGateInOutword.belongsTo(db.warehouse, {
  foreignKey: "warehouse_id",
  allowNull: true,
  as: "warehouseMst",
});

db.entityMaster.hasMany(db.vehiclePlanningMst, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.vehiclePlanningMst, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.THIRD_PARTY_ORGANIZATION.hasMany(db.vehiclePlanningMst, {
  foreignKey: "organization_id",
  onDelete: "RESTRICT",
});

db.vehiclePlanningMst.hasMany(db.vehiclePlanningTransporter, {
  foreignKey: "vehicle_planing_id",
  as: "transporters",
  onDelete: "RESTRICT",
});

db.vehiclePlanningTransporter.belongsTo(db.vehiclePlanningMst, {
  foreignKey: "vehicle_planing_id",
  as: "vehiclePlan",
});

db.vehiclePlanningTransporter.hasMany(db.vehiclePlanningTransCharge, {
  foreignKey: "vp_trans_id",
  as: "transporters",
  onDelete: "RESTRICT",
});
db.vehiclePlanningTransCharge.belongsTo(db.vehiclePlanningTransporter, {
  foreignKey: "vp_trans_id",
  as: "transporterCharge",
});

db.transportChargeMst.hasMany(db.vehiclePlanningTransCharge, {
  foreignKey: "charge_id",
  as: "transporters",
  onDelete: "RESTRICT",
});
db.vehiclePlanningTransCharge.belongsTo(db.transportChargeMst, {
  foreignKey: "charge_id",
  as: "chargeList",
});

db.transport_master.hasMany(db.vehiclePlanningTransporter, {
  foreignKey: "transportor_id",
  as: "assignedPlans",
  onDelete: "RESTRICT",
});

db.vehiclePlanningTransporter.belongsTo(db.transport_master, {
  foreignKey: "transportor_id",
  as: "transporterDetails",
});
db.rateAgreement_master.hasMany(db.vehiclePlanningTransporter, {
  foreignKey: "rate_agreement_id",
  allowNull: true,
  as: "rateAgreement",
  onDelete: "RESTRICT",
});
db.vehiclePlanningTransporter.belongsTo(db.rateAgreement_master, {
  foreignKey: "rate_agreement_id",
  allowNull: true,
  as: "rateAgreement",
});

db.vehiclePlanningTransporter.hasMany(db.vehiclePlanningTransporterAgreement, {
  foreignKey: "vh_transporter_id",
  allowNull: true,
  as: "vehiclePlanningTransporter",
  onDelete: "RESTRICT",
});
db.vehiclePlanningTransporterAgreement.belongsTo(
  db.vehiclePlanningTransporter,
  {
    foreignKey: "vh_transporter_id",
    allowNull: true,
    as: "vehiclePlanningTransporter",
  },
);

db.rateAgreementDetails_mapping.hasMany(
  db.vehiclePlanningTransporterAgreement,
  {
    foreignKey: "rate_agree_details_id",
    allowNull: true,
    as: "rateAgreementDetails",
    onDelete: "RESTRICT",
  },
);
db.vehiclePlanningTransporterAgreement.belongsTo(
  db.rateAgreementDetails_mapping,
  {
    foreignKey: "rate_agree_details_id",
    allowNull: true,
    as: "rateAgreementDetails",
  },
);

db.stockTransfernew.belongsTo(db.vehiclePlanningMst, {
  foreignKey: "vehicle_planning_id",
  as: "vehiclePlanning",
});
db.vehiclePlanningMst.hasMany(db.stockTransfernew, {
  foreignKey: "vehicle_planning_id",
  as: "stockTransfers",
});

db.vehicle_master.hasMany(db.vehiclePlanningTransporter, {
  foreignKey: "vehicle_id",
  allowNull: true,
  as: "vehicleMaster",
  onDelete: "RESTRICT",
});
db.vehiclePlanningTransporter.belongsTo(db.vehicle_master, {
  foreignKey: "vehicle_id",
  allowNull: true,
  as: "vehicleMaster",
});

db.vehicle_driver.hasMany(db.vehiclePlanningTransporter, {
  foreignKey: "driver_id",
  allowNull: true,
  as: "driverMaster",
  onDelete: "RESTRICT",
});
db.vehiclePlanningTransporter.belongsTo(db.vehicle_driver, {
  foreignKey: "driver_id",
  allowNull: true,
  as: "driverMaster",
});

db.vehiclePlanningMst.hasMany(db.vehiclePlanningSo, {
  foreignKey: "planning_id",
  as: "saleOrders",
  onDelete: "RESTRICT",
});
db.vehiclePlanningSo.belongsTo(db.vehiclePlanningMst, {
  foreignKey: "planning_id",
  as: "saleOrders",
});

db.vehicleType_master.hasMany(db.vehiclePlanningMst, {
  foreignKey: "vehicle_type_id",
  as: "vehicleTypeMST",
  onDelete: "RESTRICT",
});
db.vehiclePlanningMst.belongsTo(db.vehicleType_master, {
  foreignKey: "vehicle_type_id",
  as: "vehicleTypeMST",
});

db.transportType_master.hasMany(db.vehiclePlanningMst, {
  foreignKey: "transport_type_id",
  as: "transportTypeMST",
  onDelete: "RESTRICT",
});
db.vehiclePlanningMst.belongsTo(db.transportType_master, {
  foreignKey: "transport_type_id",
  as: "transportTypeMST",
});

db.transporterType_master.hasMany(db.vehiclePlanningMst, {
  foreignKey: "transported_by_id",
  as: "transportedByMST",
  onDelete: "RESTRICT",
});
db.vehiclePlanningMst.belongsTo(db.transporterType_master, {
  foreignKey: "transported_by_id",
  as: "transportedByMST",
});

db.warehouse.hasMany(db.vehiclePlanningSo, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});

db.vehiclePlanningSo.belongsTo(db.warehouse, {
  foreignKey: "warehouse_id",
});
db.salesOrder.hasMany(db.vehiclePlanningSo, {
  foreignKey: "sale_order_id",
  onDelete: "RESTRICT",
  as: "warehousePlaningPickup",
});

db.vehiclePlanningSo.belongsTo(db.salesOrder, {
  foreignKey: "sale_order_id",
  as: "warehousePlaningPickup",
});

db.stockTransferSerialnew.belongsTo(db.vehiclePlanningMst, {
  foreignKey: "vehicle_planning_id",
});
db.vehiclePlanningMst.hasMany(db.stockTransferSerialnew, {
  foreignKey: "vehicle_planning_id",
});

db.stockTransferSerialnew.belongsTo(db.salesOrder, {
  foreignKey: "sales_order_id",
});
db.salesOrder.hasMany(db.stockTransferSerialnew, {
  foreignKey: "sales_order_id",
});

db.stockTransferSerialnew.belongsTo(db.salesOrderItemNew, {
  foreignKey: "sales_order_item_id",
});
db.salesOrderItemNew.hasMany(db.stockTransferSerialnew, {
  foreignKey: "sales_order_item_id",
});

db.entityMaster.hasMany(db.tds, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.tds.hasMany(db.tdsList, { foreignKey: "tds_id", onDelete: "RESTRICT" });
db.tds.hasMany(db.vendorTDS, { foreignKey: "tds_id", onDelete: "RESTRICT" });
db.tdsList.hasMany(db.vendorTDS, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.voucherMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.paymentAdviceVoucher, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.bankRecieptVoucher, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.bankPaymentVoucher, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.voucherMainList.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "voucher_list_id",
  onDelete: "RESTRICT",
});
db.bankRecieptVoucher.hasMany(db.bankReciept, {
  foreignKey: "bank_reciept_voucher_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.voucherMainList, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.voucherMain.hasMany(db.voucherMainList, {
  foreignKey: "voucher_main_id",
  onDelete: "RESTRICT",
});

(db.vendor_basic_details.hasMany(db.vendorTDS, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
}),
  db.tds.hasMany(db.paymentAdviceAccount, {
    foreignKey: "tds_id",
    onDelete: "RESTRICT",
  }),
  db.tdsList.hasMany(db.paymentAdviceAccount, {
    foreignKey: "nature_id",
    onDelete: "RESTRICT",
  }),
  db.voucherMainList.hasMany(db.paymentAdvice, {
    foreignKey: "voucher_list_id",
    onDelete: "RESTRICT",
  }));
db.voucherMainList.hasMany(db.bankReciept, {
  foreignKey: "voucher_list_id",
  onDelete: "RESTRICT",
});
db.voucherMainList.hasMany(db.bankPayment, {
  foreignKey: "voucher_list_id",
  onDelete: "RESTRICT",
});

db.tbl_branch.hasMany(db.cashReciept, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.cashReciept.hasMany(db.cashRecieptAccount, {
  foreignKey: "cash_reciept_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.cashReciept, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.cashReciept.hasMany(db.cashRecieptDoc, {
  foreignKey: "cash_reciept_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.cashRecieptAccount, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.cashRecieptAccount, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.cashRecieptAccount, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.cashRecieptAccount, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.cashRecieptAccount, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.cashRecieptAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.createBank.hasMany(db.cashRecieptAccount, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.voucherMainList.hasMany(db.cashReciept, {
  foreignKey: "voucher_list_id",
  onDelete: "RESTRICT",
});
db.voucherMainList.hasMany(db.purchaseJournal, {
  foreignKey: "voucher_list_id",
  onDelete: "RESTRICT",
});
db.voucherMainList.hasMany(db.salesJournal, {
  foreignKey: "voucher_list_id",
  onDelete: "RESTRICT",
});

db.tds.hasMany(db.chartOfAccountTdsList, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.chartOfAccountTdsList, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.chartOfAccountTdsList, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.financial_And_Account_Journal.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});

db.user.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.financial_And_Account_Journal.belongsTo(db.user, {
  foreignKey: "employee_id",
});
db.customerProfile.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "customer_id",
});
db.financial_And_Account_Journal.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
});
db.tds.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});

(db.vendor_basic_details.hasMany(db.paymentAdvice, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
}),
  db.customerProfile.hasMany(db.paymentAdvice, {
    foreignKey: "customer_id",
    onDelete: "RESTRICT",
  }));
db.purchase_order.hasMany(db.paymentAdvice, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.paymentAdvice, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.paymentAdvice, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.paymentAdvice, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.hasMany(db.paymentAdvice, {
  foreignKey: "delivery_order_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.hasMany(db.paymentAdvice, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});

db.customerProfile.hasMany(db.bankReciept, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.bankReciept, {
  foreignKey: "sales_quotation_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.cashReciept, {
  foreignKey: "sales_quotation_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.bankPayment, {
  foreignKey: "sales_quotation_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.cashPayment, {
  foreignKey: "sales_quotation_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.bankReciept, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.hasMany(db.bankReciept, {
  foreignKey: "delivery_order_id",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.hasMany(db.bankReciept, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.bankRecieptAccount, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

(db.vendor_basic_details.hasMany(db.bankPayment, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
}),
  db.customerProfile.hasMany(db.bankPayment, {
    foreignKey: "customer_id",
    onDelete: "RESTRICT",
  }));
db.purchase_order.hasMany(db.bankPayment, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.bankPayment, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.bankPayment, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.bankPayment, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.hasMany(db.bankPayment, {
  foreignKey: "delivery_order_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.hasMany(db.bankPayment, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.purchase_order.hasMany(db.bankReciept, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.bankReciept, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.bankReciept, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
(db.vendor_basic_details.hasMany(db.bankReciept, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
}),
  db.customerProfile.hasMany(db.cashReciept, {
    foreignKey: "customer_id",
    onDelete: "RESTRICT",
  }));
db.salesOrder.hasMany(db.cashReciept, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.hasMany(db.cashReciept, {
  foreignKey: "delivery_order_id",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.hasMany(db.cashReciept, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.tds.hasMany(db.cashRecieptAccount, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.cashRecieptAccount, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.cashRecieptAccount, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

db.tbl_branch.hasMany(db.cashPayment, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.purchaseJournal.hasMany(db.cashPayment, {
  foreignKey: "purchase_journal_id",
  onDelete: "RESTRICT",
});
db.cashPayment.hasMany(db.cashPaymentAccount, {
  foreignKey: "cash_payment_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.cashPayment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.cashPayment.hasMany(db.cashPaymentDoc, {
  foreignKey: "cash_payment_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.cashPaymentAccount, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.cashPaymentAccount, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.cashPaymentAccount, {
  foreignKey: "product_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.cashPaymentAccount, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.cashPaymentAccount, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.cashPaymentAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.createBank.hasMany(db.cashPaymentAccount, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
(db.vendor_basic_details.hasMany(db.cashPaymentAccount, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
}),
  db.voucherMainList.hasMany(db.cashPayment, {
    foreignKey: "voucher_list_id",
    onDelete: "RESTRICT",
  }));
(db.vendor_basic_details.hasMany(db.cashPayment, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
}),
  db.customerProfile.hasMany(db.cashPayment, {
    foreignKey: "customer_id",
    onDelete: "RESTRICT",
  }));
db.purchase_order.hasMany(db.cashPayment, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.cashPayment, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.cashPayment, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.cashPayment, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.sales_delivery_challan.hasMany(db.cashPayment, {
  foreignKey: "delivery_order_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.hasMany(db.cashPayment, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.tds.hasMany(db.cashPaymentAccount, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.cashPaymentAccount, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.cashPaymentAccount, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

// TravelType
db.TravelType.hasMany(db.TravelType, {
  foreignKey: "parentId",
  as: "children",
  onDelete: "RESTRICT",
});
db.TravelType.belongsTo(db.TravelType, {
  foreignKey: "parentId",
  as: "parent",
});

db.TravelType.hasMany(db.MASTER_TRAVEL_BUDGET_LIMIT, {
  foreignKey: "travel_type_id",
  as: "travelBudgetLimit",
  onDelete: "RESTRICT",
});
db.MASTER_TRAVEL_BUDGET_LIMIT.belongsTo(db.TravelType, {
  foreignKey: "travel_type_id",
  as: "travelType",
});

db.MASTER_TRAVEL_BUDGET_LIMIT.hasMany(db.MASTER_TRAVEL_LOCAL_BUDGET, {
  foreignKey: "travel_budget_id",
  as: "localBudgetLimits",
  onDelete: "RESTRICT",
});
db.MASTER_TRAVEL_LOCAL_BUDGET.belongsTo(db.MASTER_TRAVEL_BUDGET_LIMIT, {
  foreignKey: "travel_budget_id",
  as: "travelBudget",
});

db.TravelType.hasMany(db.MASTER_TRAVEL_LOCAL_BUDGET, {
  foreignKey: "travel_conveyance_id",
  as: "conveyanceBudgetLimit",
  onDelete: "RESTRICT",
});
db.MASTER_TRAVEL_LOCAL_BUDGET.belongsTo(db.TravelType, {
  foreignKey: "travel_conveyance_id",
  as: "conveyanceType",
});

db.MASTER_TRAVEL_BUDGET_LIMIT.hasMany(db.MASTER_TRAVEL_DOMESTIC_BUDGET, {
  foreignKey: "travel_budget_id",
  as: "domesticBudgetLimits",
  onDelete: "RESTRICT",
});
db.MASTER_TRAVEL_DOMESTIC_BUDGET.belongsTo(db.MASTER_TRAVEL_BUDGET_LIMIT, {
  foreignKey: "travel_budget_id",
  as: "travelBudget",
});

db.states.hasMany(db.MASTER_TRAVEL_DOMESTIC_BUDGET, {
  foreignKey: "state_id",
  as: "domesticState",
  onDelete: "RESTRICT",
});
db.MASTER_TRAVEL_DOMESTIC_BUDGET.belongsTo(db.states, {
  foreignKey: "state_id",
  as: "state",
});

db.city.hasMany(db.MASTER_TRAVEL_DOMESTIC_BUDGET, {
  foreignKey: "city_id",
  as: "domesticCity",
  onDelete: "RESTRICT",
});
db.MASTER_TRAVEL_DOMESTIC_BUDGET.belongsTo(db.city, {
  foreignKey: "city_id",
  as: "city",
});

db.MASTER_TRAVEL_BUDGET_LIMIT.hasMany(db.MASTER_REIMBURSEMENT_BUDGET, {
  foreignKey: "travel_budget_id",
  as: "reimbursementsBudgets",
  onDelete: "RESTRICT",
});
db.MASTER_REIMBURSEMENT_BUDGET.belongsTo(db.MASTER_TRAVEL_BUDGET_LIMIT, {
  foreignKey: "travel_budget_id",
  as: "reimbursementBudget",
});

db.TravelType.hasMany(db.user, {
  foreignKey: "grade_id",
  as: "userGrade",
  onDelete: "RESTRICT",
});
db.user.belongsTo(db.TravelType, { foreignKey: "grade_id", as: "grade" });
db.salesReason.hasMany(db.proposal_performa_invoice, {
  foreignKey: "sales_reason_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.proposal_performa_invoice, {
  foreignKey: "reason_rejectedBy",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.proposal_performa_invoice, {
  foreignKey: "version_rejected_by",
  as: "proposalVersionRejectedBy",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.belongsTo(db.user, {
  foreignKey: "version_rejected_by",
  as: "proposalVersionRejectedBy",
});
db.salesReason.hasMany(db.proposal_performa_invoice, {
  foreignKey: "version_reason_id",
  as: "versionRejectedReason",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.belongsTo(db.salesReason, {
  foreignKey: "version_reason_id",
  as: "versionRejectedReason",
});

db.hsn_sac_master.hasMany(db.accessories_mst_name, {
  foreignKey: "hsn_code_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.accessories_master, {
  foreignKey: "accessories_cat_id",
  onDelete: "RESTRICT",
});
db.SubCategory.hasMany(db.accessories_master, {
  foreignKey: "sub_category_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.accessories_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.accessories_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.accessories_master.hasMany(db.accessories_mst_name, {
  foreignKey: "accessories_mst_id",
  onDelete: "RESTRICT",
});
db.customerType.hasMany(db.price_master, {
  foreignKey: "customer_type_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.price_master, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.asset.hasMany(db.price_master, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
});
db.SubCategory.hasMany(db.price_master, {
  foreignKey: "subcategory_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.price_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.price_master.hasMany(db.priceMasterItem, {
  foreignKey: "price_master_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.priceMasterItem, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});

db.financial_And_Account_Journal_List.belongsTo(db.tds, {
  foreignKey: "tds_id",
});
(db.financial_And_Account_Journal_List.belongsTo(db.tdsList, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
}),
  db.user.hasMany(db.salesSoProgressStatus, {
    foreignKey: "progress_status_updated_by",
    as: "progressStatusUpdatedBy",
    onDelete: "RESTRICT",
  }));
db.salesSoProgressStatus.belongsTo(db.user, {
  foreignKey: "progress_status_updated_by",
  as: "progressStatusUpdatedBy",
});

db.salesReason.hasMany(db.salesSoProgressStatus, {
  foreignKey: "resion_id",
  as: "resionDatas",
  onDelete: "RESTRICT",
});
db.salesSoProgressStatus.belongsTo(db.salesReason, {
  foreignKey: "resion_id",
  as: "resionData",
});

db.paymentMainCategory.hasMany(db.paymentMainSubCategory, {
  foreignKey: "payment_main_id",
  as: "paymentMainData",
  onDelete: "RESTRICT",
});
db.paymentMainSubCategory.belongsTo(db.paymentMainCategory, {
  foreignKey: "payment_main_id",
  as: "paymentMainData",
});

db.proposalData.hasMany(db.salesSoProgressStatus, {
  foreignKey: "proposal_id",
  as: "proposalDatas",
  onDelete: "RESTRICT",
});
db.salesSoProgressStatus.belongsTo(db.proposalData, {
  foreignKey: "proposal_id",
  as: "proposalData",
});

db.versionData.hasMany(db.salesSoProgressStatus, {
  foreignKey: "version_id",
  as: "versionDatas",
  onDelete: "RESTRICT",
});
db.salesSoProgressStatus.belongsTo(db.versionData, {
  foreignKey: "version_id",
  as: "versionData",
});

// db.cashRecieptAccount.hasMany(db.financial_And_Account_Journal_List, { foreignKey: "cash_reciept_id", onDelete: 'RESTRICT' });
// db.cashPaymentAccount.hasMany(db.financial_And_Account_Journal_List, { foreignKey: "cash_payment_id", onDelete: 'RESTRICT' });
// db.paymentAdviceAccount.hasMany(db.financial_And_Account_Journal_List, { foreignKey: "payment_advice_id", onDelete: 'RESTRICT' });
// db.cashReciept.hasMany(db.financial_And_Account_Journal_List, { foreignKey: "cash_reciept_id", onDelete: 'RESTRICT' });
// db.bankPayment.hasMany(db.financial_And_Account_Journal_List, { foreignKey: "bank_payment_id", onDelete: 'RESTRICT' });
// db.cashPayment.hasMany(db.financial_And_Account_Journal_List, { foreignKey: "cash_payment_id", onDelete: 'RESTRICT' });
// db.paymentAdvice.hasMany(db.financial_And_Account_Journal_List, { foreignKey: "payment_advice_id", onDelete: 'RESTRICT' });
db.createChartOfAccounts.hasMany(db.tds, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
// Location Master
db.city.hasMany(db.locationMaster, { foreignKey: "city_id" });
db.locationMaster.belongsTo(db.city, { foreignKey: "city_id" });

db.entityMaster.hasMany(db.vendorRecordPayment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
(db.vendor_basic_details.hasMany(db.vendorRecordPayment, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
}),
  db.createBank.hasMany(db.vendorRecordPayment, {
    foreignKey: "bank_id",
    onDelete: "RESTRICT",
  }));
db.purchase_order.hasMany(db.vendorRecordPayment, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.vendorRecordPayment, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.vendorRecordPayment, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.tds.hasMany(db.vendorRecordPayment, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
(db.tdsList.hasMany(db.vendorRecordPayment, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
}),
  db.createChartOfAccounts.hasMany(db.vendorRecordPaymentAccount, {
    foreignKey: "chart_of_account_id",
    onDelete: "RESTRICT",
  }),
  db.tbl_branch.hasMany(db.vendorRecordPayment, {
    foreignKey: "branch_id",
    onDelete: "RESTRICT",
  }));
db.vendorRecordPayment.hasMany(db.vendorRecordPaymentAccount, {
  foreignKey: "vendor_record_payment_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.Service_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.customerProfile.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.purchase_order.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "quotation_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "proforma_invoice_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.customerProfile, {
  foreignKey: "chart_of_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.customerProfile, {
  foreignKey: "advanced_chart_of_account_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.hasMany(db.bankReciept, {
  foreignKey: "proforma_invoice_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.hasMany(db.cashReciept, {
  foreignKey: "proforma_invoice_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.customerRecordPayment, {
  foreignKey: "quation_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.hasMany(db.customerRecordPayment, {
  foreignKey: "proforma_invoice_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.customerRecordPayment, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.customerRecordPayment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.customerRecordPayment, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.bankPayment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.cashPayment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.bankReciept, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.purchase_order.hasMany(db.purchaseJournal, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.purchaseJournal, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.purchaseJournal, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.tds.hasMany(db.purchaseJournal, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.purchaseJournal, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.financial_And_Account_Journal_List.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
});
db.financial_And_Account_Journal_List.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.customerRecordPayment.hasMany(db.customerRecordPaymentAccount, {
  foreignKey: "customer_record_payment_id",
  onDelete: "RESTRICT",
});
db.branding_master.hasMany(db.proposal_branding, {
  foreignKey: "branding_mst_id",
  onDelete: "RESTRICT",
});
db.proposal_branding.belongsTo(db.branding_master, {
  foreignKey: "branding_mst_id",
  onDelete: "RESTRICT",
});
db.hsn_sac_master.hasMany(db.branding_master, {
  foreignKey: "hsn_code_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.glMappingTransactions, {
  foreignKey: "credit_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.glMappingTransactions, {
  foreignKey: "debit_account_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.glMappingTransactions, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.department.hasMany(db.financeProfitCenter, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.financeProfitCenter, {
  foreignKey: "manager_id",
  onDelete: "RESTRICT",
});

db.ItemMaster.hasMany(db.warehouseAllocation, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.grnItemStatus.hasMany(db.warehouseAllocation, {
  foreignKey: "grn_item_status_id",
  onDelete: "RESTRICT",
});
db.warehouse.hasMany(db.warehouseAllocation, {
  foreignKey: "warehouse_id",
  onDelete: "RESTRICT",
});
db.zoneType.hasMany(db.warehouseAllocation, {
  foreignKey: "zone_type_id",
  onDelete: "RESTRICT",
});
db.warehouse_bifurcation_zone.hasMany(db.warehouseAllocation, {
  foreignKey: "zone_id",
  onDelete: "RESTRICT",
});
db.WAREHOUSE_BIN.hasMany(db.warehouseAllocation, {
  foreignKey: "bin_id",
  onDelete: "RESTRICT",
});
db.WAREHOUSE_RACK.hasMany(db.warehouseAllocation, {
  foreignKey: "rack_id",
  onDelete: "RESTRICT",
});
db.WAREHOUSE_BAY.hasMany(db.warehouseAllocation, {
  foreignKey: "bay_id",
  onDelete: "RESTRICT",
});

db.role_module_master.hasMany(db.fiancialTransactionsIntegration, {
  foreignKey: "role_module_master_id",
  onDelete: "RESTRICT",
});
db.menu_master.hasMany(db.fiancialTransactionsIntegration, {
  foreignKey: "menu_master_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.fiancialTransactionsIntegration, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.fiancialTransactionsIntegration.hasMany(
  db.fiancialTransactionsIntegrationList,
  { foreignKey: "transaction_integration_id", onDelete: "RESTRICT" },
);
db.createChartOfAccounts.hasMany(db.fiancialTransactionsIntegrationList, {
  foreignKey: "chart_of_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.item_cost_category, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.item_cost_category, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.salesJournal, {
  foreignKey: "quotation_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.hasMany(db.salesJournal, {
  foreignKey: "proforma_invoice_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.salesJournal, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.hasMany(db.salesJournal, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.hasMany(db.salesJournalAccount, {
  foreignKey: "item_id",
  onDelete: "RESTRICT",
});
db.paymentAdvice.hasMany(db.bankPayment, {
  foreignKey: "document_number_id",
  onDelete: "RESTRICT",
});
db.purchaseJournal.hasMany(db.bankPayment, {
  foreignKey: "document_number_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.financial_And_Account_Journal, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.serviceVoucher, {
  foreignKey: "quotation_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.hasMany(db.serviceVoucher, {
  foreignKey: "proforma_invoice_id",
  onDelete: "RESTRICT",
});
db.salesOrder.hasMany(db.serviceVoucher, {
  foreignKey: "sales_order_id",
  onDelete: "RESTRICT",
});
db.salesBooking.hasMany(db.serviceVoucher, {
  foreignKey: "sales_booking_id",
  onDelete: "RESTRICT",
});
db.salesInvoice.hasMany(db.serviceVoucher, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.Service_master.hasMany(db.serviceVoucherList, {
  foreignKey: "service_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.serviceVoucherList, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.serviceVoucherList, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.serviceVoucher.hasMany(db.serviceVoucherList, {
  foreignKey: "service_voucher_id",
  onDelete: "RESTRICT",
});
db.voucherMainList.hasMany(db.serviceVoucher, {
  foreignKey: "voucher_list_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.costProfitCenterType, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.costProfitCenterType.hasMany(db.cost_center, {
  foreignKey: "cost_profit_center_id",
  onDelete: "RESTRICT",
});
db.costProfitCenterType.hasMany(db.financeProfitCenter, {
  foreignKey: "cost_profit_center_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.costProfitCenterType, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.costProfitCenterType.hasMany(db.cost_center, {
  foreignKey: "cost_profit_center_id",
  onDelete: "RESTRICT",
});
db.costProfitCenterType.hasMany(db.financeProfitCenter, {
  foreignKey: "cost_profit_center_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.transportVoucher, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.transportVoucher.hasMany(db.transportVoucherList, {
  foreignKey: "transport_voucher_id",
  onDelete: "RESTRICT",
});
(db.tds.hasMany(db.transportVoucher, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
}),
  db.tdsList.hasMany(db.transportVoucher, {
    foreignKey: "nature_id",
    onDelete: "RESTRICT",
  }),
  db.createChartOfAccounts.hasMany(db.Service_master, {
    foreignKey: "chart_of_account_id",
    onDelete: "RESTRICT",
  }),
  db.vehicleGateInOutword.hasMany(db.transportVoucherList, {
    foreignKey: "LR_id",
    onDelete: "RESTRICT",
  }),
  db.entityMaster.hasMany(db.paymentProgram, {
    foreignKey: "entity_id",
    onDelete: "RESTRICT",
  }),
  db.paymentProgram.hasMany(db.paymentProgramList, {
    foreignKey: "payment_program_id",
    onDelete: "RESTRICT",
  }),
  db.grnMaster.hasMany(db.paymentProgramList, {
    foreignKey: "invoice_id",
    onDelete: "RESTRICT",
  }),
  db.vendor_basic_details.hasMany(db.paymentProgramList, {
    foreignKey: "vendor_id",
    onDelete: "RESTRICT",
  }),
  db.grnMaster.hasMany(db.grnItemCost, {
    foreignKey: "invoice_id",
    onDelete: "RESTRICT",
  }),
  db.item_cost_category.hasMany(db.grnItemCost, {
    foreignKey: "item_cost_category_id",
    onDelete: "RESTRICT",
  }),
  db.countryss.hasMany(db.portMaster, {
    foreignKey: "country_id",
    onDelete: "RESTRICT",
  }),
  db.states.hasMany(db.portMaster, {
    foreignKey: "state_id",
    onDelete: "RESTRICT",
  }),
  db.city.hasMany(db.portMaster, {
    foreignKey: "city_id",
    onDelete: "RESTRICT",
  }),
  db.createChartOfAccounts.hasMany(db.Service_master, {
    foreignKey: "chart_of_account_id",
    onDelete: "RESTRICT",
  }),
  db.vehicleGateInOutword.hasMany(db.transportVoucherList, {
    foreignKey: "LR_id",
    onDelete: "RESTRICT",
  }),
  db.createChartOfAccounts.hasMany(db.vendor_basic_details, {
    foreignKey: "chart_of_account_id",
    onDelete: "RESTRICT",
  }),
  db.createChartOfAccounts.hasMany(db.vendor_basic_details, {
    foreignKey: "advanced_chart_of_account_id",
    onDelete: "RESTRICT",
  }),
  db.paymentProgram.hasMany(db.bankPayment, {
    foreignKey: "payment_program_id",
    onDelete: "RESTRICT",
  }),
  db.tds.hasMany(db.paymentProgramList, {
    foreignKey: "tds_id",
    onDelete: "RESTRICT",
  }));
db.tdsList.hasMany(db.paymentProgramList, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.vendorRecordPayment, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.mapSalesAccount, {
  foreignKey: "purchase_chart_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.createBankAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.createBankAccount, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.bankClearence, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.bankClearence, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.serviceVoucher, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.serviceVoucher.belongsTo(db.tbl_branch, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.serviceVoucher, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.serviceVoucher.belongsTo(db.customerProfile, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.transportVoucher.hasMany(db.paymentProgramList, {
  foreignKey: "transport_voucher_id",
  onDelete: "RESTRICT",
});
db.serviceVoucher.hasMany(db.paymentProgramList, {
  foreignKey: "service_voucher_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.entityMaster, {
  foreignKey: "state_id",
  onDelete: "RESTRICT",
});
db.purchaseJournal.hasMany(db.paymentProgramList, {
  foreignKey: "purchase_journal_id",
  onDelete: "RESTRICT",
});
db.purchase_order.hasMany(db.paymentProgramList, {
  foreignKey: "po_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.paymentProgramList, {
  foreignKey: "grn_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.paymentProgramList, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.paymentProgramList, {
  foreignKey: "PO_invoice_id",
  onDelete: "RESTRICT",
});

db.createChartOfAccounts.hasMany(db.expenseType, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.salesJournal.hasMany(db.paymentProgramList, {
  foreignKey: "sales_journal_id",
  onDelete: "RESTRICT",
});
db.proposalData.hasMany(db.paymentProgramList, {
  foreignKey: "sales_quotation_id",
  onDelete: "RESTRICT",
});
db.proposal_performa_invoice.hasMany(db.paymentProgramList, {
  foreignKey: "proforma_invoice_id",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.hasMany(db.paymentProgramList, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.cashReciept.hasMany(db.paymentProgramList, {
  foreignKey: "cash_reciept_id",
  onDelete: "RESTRICT",
});
db.bankReciept.hasMany(db.paymentProgramList, {
  foreignKey: "bank_reciept_id",
  onDelete: "RESTRICT",
});
db.bankPayment.hasMany(db.paymentProgramList, {
  foreignKey: "bank_payment_id",
  onDelete: "RESTRICT",
});
db.cashPayment.hasMany(db.paymentProgramList, {
  foreignKey: "cash_payment_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.paymentProgramList, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.creditDebitNote.hasMany(db.paymentProgramList, {
  foreignKey: "credit_debit_note_id",
  onDelete: "RESTRICT",
});
db.voucherMainList.hasMany(db.adjustmentJournal, {
  foreignKey: "voucher_id",
  onDelete: "RESTRICT",
});
db.cost_center.hasMany(db.adjustmentJournalList, {
  foreignKey: "cost_center_id",
  onDelete: "RESTRICT",
});
db.financeProfitCenter.hasMany(db.adjustmentJournalList, {
  foreignKey: "profit_center_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.adjustmentJournalList, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.adjustmentJournalList, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.adjustmentJournalList, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.customerProfile.hasMany(db.adjustmentJournalList, {
  foreignKey: "customer_id",
  onDelete: "RESTRICT",
});
db.adjustmentJournal.hasMany(db.adjustmentJournalList, {
  foreignKey: "adjustment_id",
  onDelete: "RESTRICT",
});
db.adjustmentJournal.hasMany(db.adjustmentJournalDocument, {
  foreignKey: "adjustment_id",
  onDelete: "RESTRICT",
});

db.countryss.hasMany(db.entityMaster, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.entityMaster, {
  foreignKey: "city_id",
  onDelete: "RESTRICT",
});
db.purchaseReturn.belongsTo(db.vendor_basic_details, {
  foreignKey: "vendor_id",
  as: "vendor",
});
db.purchaseReturn.belongsTo(db.grnMaster, { foreignKey: "grn_id", as: "grn" });
db.purchaseReturn.belongsTo(db.purchase_order, {
  foreignKey: "po_id",
  as: "purchaseOrder",
});
db.purchaseReturn.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "creator",
});
db.purchaseReturn.hasMany(db.purchaseReturnItem, {
  foreignKey: "purchase_return_id",
  as: "items",
});
db.purchaseReturn.hasMany(db.purchaseReturnStatusLog, {
  foreignKey: "purchase_return_id",
  as: "statusLogs",
});
db.purchaseReturnItem.belongsTo(db.purchaseReturn, {
  foreignKey: "purchase_return_id",
  as: "purchaseReturn",
});
db.purchaseReturnItem.belongsTo(db.grnItem, {
  foreignKey: "grn_item_id",
  as: "grnItem",
});
db.purchaseReturnItem.belongsTo(db.ItemMaster, {
  foreignKey: "item_id",
  as: "item",
});
db.purchaseReturnItem.belongsTo(db.warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouse",
});
db.purchaseReturnStatusLog.belongsTo(db.purchaseReturn, {
  foreignKey: "purchase_return_id",
  as: "purchaseReturn",
});
db.purchaseReturnStatusLog.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "creator",
});
db.expense_request.hasMany(db.paymentProgramList, {
  foreignKey: "expense_request_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.paymentProgramList, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.grnMaster.hasMany(db.creditDebitNote, {
  foreignKey: "invoice_id",
  onDelete: "RESTRICT",
});
db.salesInvoiceData.hasMany(db.creditDebitNote, {
  foreignKey: "sales_invoice_id",
  onDelete: "RESTRICT",
});
db.createChartOfAccounts.hasMany(db.pochargesDetailsList, {
  foreignKey: "chart_account_id",
  onDelete: "RESTRICT",
});

db.createShippingAlert.hasMany(db.pochargesDetailsList, {
  foreignKey: "shiping_id",
  onDelete: "RESTRICT",
});
db.vendor_basic_details.hasMany(db.pochargesDetailsList, {
  foreignKey: "vendor_id",
  onDelete: "RESTRICT",
});

db.transport_master.hasMany(db.transporterTds, {
  foreignKey: "transporter_id",
  onDelete: "RESTRICT",
});
db.tds.hasMany(db.transporterTds, {
  foreignKey: "tds_id",
  onDelete: "RESTRICT",
});
db.tdsList.hasMany(db.transporterTds, {
  foreignKey: "nature_id",
  onDelete: "RESTRICT",
});
db.transport_master.hasMany(db.paymentProgramList, {
  foreignKey: "transporter_id",
  onDelete: "RESTRICT",
});
db.purchaseServiceVoucher.hasMany(db.paymentProgramList, {
  foreignKey: "purchase_service_voucher_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.transport_master, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.transport_master, {
  foreignKey: "state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.transport_master, {
  foreignKey: "city_id",
  onDelete: "RESTRICT",
});
db.transport_master.hasMany(db.transportVoucher, {
  foreignKey: "transport_id",
  onDelete: "RESTRICT",
});
db.transport_master.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "transport_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.financial_And_Account_Journal_List, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.transportVoucher, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.purchaseServiceVoucher, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.Service_master.hasMany(db.creditDebitNoteItem, {
  foreignKey: "service_id",
  onDelete: "RESTRICT",
});
db.purchaseServiceVoucher.hasMany(db.creditDebitNote, {
  foreignKey: "pr_service_voucher_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.creditDebitNote, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.paymentProgramList, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.transportVoucher, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.transportVoucher.hasMany(db.creditDebitNote, {
  foreignKey: "transport_voucher_id",
  onDelete: "RESTRICT",
});
db.salesJournal.hasMany(db.creditDebitNote, {
  foreignKey: "sales_journal_id",
  onDelete: "RESTRICT",
});
db.currency_convert.hasMany(db.purchaseJournal, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

db.currency_convert.hasMany(db.adjustmentJournal, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

db.currency_convert.hasMany(db.salesJournal, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

db.currency_convert.hasMany(db.bankReciept, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});
db.vendorBillingAddress.hasMany(db.purchaseJournal, {
  foreignKey: "billing_id",
  onDelete: "RESTRICT",
});

db.purchaseJournal.hasMany(db.creditDebitNote, {
  foreignKey: "purchase_journal_id",
  onDelete: "RESTRICT",
});

db.currency_convert.hasMany(db.cashReciept, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

db.currency_convert.hasMany(db.cashPayment, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

db.currency_convert.hasMany(db.bankPayment, {
  foreignKey: "currency_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.transportVoucher, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.adjustmentJournal, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.financial_year.hasMany(db.adjustmentJournal, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

module.exports = db;
