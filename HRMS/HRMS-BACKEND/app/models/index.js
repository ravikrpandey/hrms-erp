const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.port || 3306,
  logging: (msg) => console.log(`[DB] ${msg}`),
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

module.exports = db;

/////////////////////////// Start defining model

//bonus master Start
db.masterBonus = require("../master/bonus_master/model/bonusModel.js")(
  sequelize,
  Sequelize
);
//bonus master ends
db.complaint_doc = require("../ESS/Complaint/models/complain_doc.model.js")(
  sequelize,
  Sequelize
);
db.Master_Complaint =
  require("../master/Complain_Type/model/complain_Type_Model.js")(
    sequelize,
    Sequelize
  );
db.checklist = require("../master/checklist/models/checklist.model.js")(
  sequelize,
  Sequelize
);
db.Resignation_approval =
  require("../ESS/Resignation/models/resignationApproval.js")(
    sequelize,
    Sequelize
  );
db.All_Resignation_approval =
  require("../ESS/Resignation/models/allResignationApproval.js")(
    sequelize,
    Sequelize
  );
db.All_Resignation_review = require("../ESS/Resignation/models/review.js")(
  sequelize,
  Sequelize
);
db.user = require("../HRMS/Employee_Master/models/user.model.js")(
  sequelize,
  Sequelize
);
db.user_login = require("../HRMS/Employee_Master/models/user_login_model.js")(
  sequelize,
  Sequelize
);
db.user_entity = require("../HRMS/Employee_Master/models/user_entity_model.js")(
  sequelize,
  Sequelize
);
db.uom = require("../master/UOM/model/uom.model.js")(sequelize, Sequelize);
db.role = require("../HRMS/RBAC/Role/models/role.model.js")(
  sequelize,
  Sequelize
);
db.employmenttype =
  require("../HRMS/Employee_Master/models/employment.model.js")(
    sequelize,
    Sequelize
  );
db.states =
  require("../master/location_mapping/states/models/states_models.js")(
    sequelize,
    Sequelize
  );
db.maritalStatus =
  require("../HRMS/Employee_Master/models/maritalStatus.model.js")(
    sequelize,
    Sequelize
  );
db.helpDesk = require("../ESS/Help_Desk/models/helpdesk.model.js")(
  sequelize,
  Sequelize
);
db.complaint = require("../ESS/Complaint/models/complaint.model.js")(
  sequelize,
  Sequelize
);
db.employeeResignation =
  require("../ESS/Resignation/models/employeeResignation.model.js")(
    sequelize,
    Sequelize
  );
db.documentMaster =
  require("../master/document_master/models/documentmaster.model.js")(
    sequelize,
    Sequelize
  );
db.countryss =
  require("../master/location_mapping/country/model/country.model.js")(
    sequelize,
    Sequelize
  );
db.country_codes =
  require("../master/location_mapping/country/model/country_code_model.js")(
    sequelize,
    Sequelize
  );
db.city = require("../master/location_mapping/city/models/city_models.js")(
  sequelize,
  Sequelize
);
db.pincode =
  require("../master/location_mapping/pincode/models/pincode_models.js")(
    sequelize,
    Sequelize
  );
db.customer_category =
  require("../master/Customer Category/model/customer_category_model.js")(
    sequelize,
    Sequelize
  );
db.role_master =
  require("../HRMS/RBAC/role_back/role_master/model/roleMaster.model.js")(
    sequelize,
    Sequelize
  );
db.menu_master =
  require("../HRMS/RBAC/role_back/menu_master/model/menuMaster.model.js")(
    sequelize,
    Sequelize
  );
db.role_menu_access =
  require("../HRMS/RBAC/role_back/role_menu_access/model/roleMenuAccess.model.js")(
    sequelize,
    Sequelize
  );
db.role_module_master =
  require("../HRMS/RBAC/role_back/role_module_master/model/role_module_master.model.js")(
    sequelize,
    Sequelize
  );
db.submenu_master =
  require("../HRMS/RBAC/role_back/submenu_master/model/submenuMaster.model.js")(
    sequelize,
    Sequelize
  );
db.department = require("../master/department/model/department.js")(
  sequelize,
  Sequelize
);
db.area = require("../master/area/model/areaModel.js")(sequelize, Sequelize);
db.designation = require("../master/designation/model/designation.js")(
  sequelize,
  Sequelize
);
db.segment = require("../master/segment/model/segment.model.js")(
  sequelize,
  Sequelize
);
db.new_certificate_type =
  require("../master/certificate_type/model/certificate_type.model.js")(
    sequelize,
    Sequelize
  );
db.new_region = require("../master/new_region/model/new_region.model.js")(
  sequelize,
  Sequelize
);
db.new_category_master =
  require("../master/new_category_master/model/new_category_master.model.js")(
    sequelize,
    Sequelize
  );
db.new_spa = require("../master/new_spa/model/new_spa.model.js")(
  sequelize,
  Sequelize
);
db.customer_type =
  require("../master/customer_type/model/customer_type.model.js")(
    sequelize,
    Sequelize
  );
db.traning_name = require("../master/traning_name/model/traning_name.model.js")(
  sequelize,
  Sequelize
);
db.holidayDetail =
  require("../master/Leave_Master/Holiday/model/holiday.model.js")(
    sequelize,
    Sequelize
  );
db.attendanceCalendarDetail =
  require("../master/Leave_Master/Attendance_Calendar/model/attendance_calendar.model.js")(
    sequelize,
    Sequelize
  );
db.currency_convert = require("../master/Currency_Convert/models/model.js")(
  sequelize,
  Sequelize
);
db.read_write_access =
  require("../HRMS/RBAC/role_back/role_menu_access/model/read_write_access.js")(
    sequelize,
    Sequelize
  );
db.entityMaster = require("../Entity_Master/models/entity_mst_model.js")(
  sequelize,
  Sequelize
);
db.entityStake = require("../Entity_Master/models/entity_stakeholder.js")(
  sequelize,
  Sequelize
);
db.company_master = require("../Entity_Master/models/company_master_model.js")(
  sequelize,
  Sequelize
);
db.emp_sign_data = require("../HRMS/Employee_Master/models/emp_sign_model.js")(
  sequelize,
  Sequelize
);
db.bank_master = require("../master/Bank/model/bankModel.js")(
  sequelize,
  Sequelize
);
db.financial_year = require("../master/Financial_Year/model/financialModel.js")(
  sequelize,
  Sequelize
);
db.tbl_branch = require("../master/branch/models/BranchModels.js")(
  sequelize,
  Sequelize
);
db.ItemMaster = require("../master/Itemmaster/model/Itemmodel.js")(
  sequelize,
  Sequelize
);
db.itemSpecification =
  require("../master/Itemmaster/model/itemSpecificationModel.js")(
    sequelize,
    Sequelize
  );
db.prodraiseindent =
  require("../production/AddProduction/model/prodraiseindent.js")(
    sequelize,
    Sequelize
  );
db.product_master = require("../master/product/model/productmodel.js")(
  sequelize,
  Sequelize
);
db.product__variant_master =
  require("../master/product/model/product_variant.js")(sequelize, Sequelize);
db.asset = require("../master/assetcategory/model/assetmodel.js")(
  sequelize,
  Sequelize
);
db.shift = require("../master/Shift/model/shiftmodel.js")(sequelize, Sequelize);
db.workStation = require("../master/workstation/model/workStation.js")(
  sequelize,
  Sequelize
);
db.UploadDoc = require("../master/workstation/model/UploadDocument.js")(
  sequelize,
  Sequelize
);
db.ServicesCategory =
  require("../master/servicecategory/model/servicesmodel.js")(
    sequelize,
    Sequelize
  );
db.Service_master =
  require("../master/servicemaster/models/servicemastermodels.js")(
    sequelize,
    Sequelize
  );
db.regionMaster = require("../master/Region/models/regionModel.js")(
  sequelize,
  Sequelize
);
db.expenseType = require("../master/Expense_Type/models/expenseModel.js")(
  sequelize,
  Sequelize
);
db.needType = require("../master/Need_Type/models/needModel.js")(
  sequelize,
  Sequelize
);
db.municipality_name =
  require("../master/Municipality/model/municipalityModel.js")(
    sequelize,
    Sequelize
  );
db.master_municipality_log =
  require("../master/Municipality/model/logModel.js")(sequelize, Sequelize);
db.budgetCategory =
  require("../master/Budget_Category/models/budget_Category_Model.js")(
    sequelize,
    Sequelize
  );
db.contract_types = require("../master/Contract/model/ContractModel.js")(
  sequelize,
  Sequelize
);
db.reason_for = require("../master/reason/model/reasonModel.js")(
  sequelize,
  Sequelize
);
db.Job_Request = require("../ESS/job_request/model/jobRequestModel.js")(
  sequelize,
  Sequelize
);
db.WorkFlow_Master = require("../ESS/workFlow/model/workFlowModel.js")(
  sequelize,
  Sequelize
);
db.WorkFlow_Map = require("../ESS/workFlow/model/workFlowMapModel.js")(
  sequelize,
  Sequelize
);
db.Work_Flow_range = require("../ESS/workFlow/model/workFlowRange.js")(
  sequelize,
  Sequelize
);
db.Job_approval = require("../ESS/job_request/model/jobApproval.js")(
  sequelize,
  Sequelize
);
db.allowance = require("../master/Allowance/model/allowanceModel.js")(
  sequelize,
  Sequelize
);
db.allowance = require("../master/Allowance/model/allowanceModel.js")(
  sequelize,
  Sequelize
);

db.overTime = require("../HRMS/ot_master/models/otModel.js")(
  sequelize,
  Sequelize
);
db.user_allowance =
  require("../HRMS/Employee_Master/models/user_allowance_model.js")(
    sequelize,
    Sequelize
  );
db.user_documents =
  require("../HRMS/Employee_Master/models/user_document_model.js")(
    sequelize,
    Sequelize
  );
db.user_family =
  require("../HRMS/Employee_Master/models/user_family_details_model.js")(
    sequelize,
    Sequelize
  );
db.user_prev_employer =
  require("../HRMS/Employee_Master/models/user_prev_employer_detail_model.js")(
    sequelize,
    Sequelize
  );
db.user_salary = require("../HRMS/Employee_Master/models/user_salary_model.js")(
  sequelize,
  Sequelize
);
db.work_flow_main = require("../ESS/workFlow/model/workflow_table.js")(
  sequelize,
  Sequelize
);
db.job_descripition =
  require("../Recruitment/Job_description/model/job_descripition.js")(
    sequelize,
    Sequelize
  );
db.job_descripition_skill =
  require("../Recruitment/Job_description/model/job_skill.js")(
    sequelize,
    Sequelize
  );
db.job_descripition_question =
  require("../Recruitment/Job_description/model/job_question.js")(
    sequelize,
    Sequelize
  );
db.job_descripition_email =
  require("../Recruitment/Job_description/model/job_email.js")(
    sequelize,
    Sequelize
  );
db.sealType = require("../master/seal_master/models/sealModel.js")(
  sequelize,
  Sequelize
);
db.allowance = require("../master/Allowance/model/allowanceModel.js")(
  sequelize,
  Sequelize
);
db.user_allowance =
  require("../HRMS/Employee_Master/models/user_allowance_model.js")(
    sequelize,
    Sequelize
  );
db.user_documents =
  require("../HRMS/Employee_Master/models/user_document_model.js")(
    sequelize,
    Sequelize
  );
db.user_family =
  require("../HRMS/Employee_Master/models/user_family_details_model.js")(
    sequelize,
    Sequelize
  );
db.user_prev_employer =
  require("../HRMS/Employee_Master/models/user_prev_employer_detail_model.js")(
    sequelize,
    Sequelize
  );
db.user_salary = require("../HRMS/Employee_Master/models/user_salary_model.js")(
  sequelize,
  Sequelize
);
db.work_flow_main = require("../ESS/workFlow/model/workflow_table.js")(
  sequelize,
  Sequelize
);
db.job_descripition =
  require("../Recruitment/Job_description/model/job_descripition.js")(
    sequelize,
    Sequelize
  );
db.job_descripition_skill =
  require("../Recruitment/Job_description/model/job_skill.js")(
    sequelize,
    Sequelize
  );
db.job_descripition_question =
  require("../Recruitment/Job_description/model/job_question.js")(
    sequelize,
    Sequelize
  );
db.job_descripition_email =
  require("../Recruitment/Job_description/model/job_email.js")(
    sequelize,
    Sequelize
  );

db.candidate_interviewer =
  require("../Recruitment/Candidate_Profile/model/candidate_interviewer.js")(
    sequelize,
    Sequelize
  );
db.candidate_interview_round =
  require("../Recruitment/Candidate_Profile/model/candidate_interview_round.js")(
    sequelize,
    Sequelize
  );
db.candidate_bgv = require("../Recruitment/BGV/model/candidate_bgv_model.js")(
  sequelize,
  Sequelize
);
db.candidate_docs = require("../Recruitment/BGV/model/candidate_docModels.js")(
  sequelize,
  Sequelize
);

db.candidate_offer_letter =
  require("../Recruitment/BGV/model/candidate_offer_letter_model.js")(
    sequelize,
    Sequelize
  );
db.candidate_interview_rating =
  require("../Recruitment/Candidate_Profile/model/candidate_interview_skills_rating.js")(
    sequelize,
    Sequelize
  );
db.candidate_offer_allowance =
  require("../Recruitment/BGV/model/candidate_offer_allowance_model.js")(
    sequelize,
    Sequelize
  );
db.self_rating = require("../Recruitment/BGV/model/selfrating_model.js")(
  sequelize,
  Sequelize
);
db.candidate_offer_letter_doc =
  require("../Recruitment/Candidate_onboarding/model/candidate_oofer_letter_pdf_model.js")(
    sequelize,
    Sequelize
  );
db.candidate_answer =
  require("../Recruitment/Candidate_Profile/model/candidate_answer_model.js")(
    sequelize,
    Sequelize
  );

// Travel Type
db.TravelType =
  require("../../app/master/travel-master/model/travel-type.model.js")(
    sequelize,
    Sequelize
  );
db.MASTER_TRAVEL_BUDGET_LIMIT =
  require("../../app/master/travel-master/model/travel-budget-limit.js")(
    sequelize,
    Sequelize
  );
db.MASTER_TRAVEL_LOCAL_BUDGET =
  require("../../app/master/travel-master/model/travel-local-budget-limit.js")(
    sequelize,
    Sequelize
  );
db.MASTER_TRAVEL_DOMESTIC_BUDGET =
  require("../../app/master/travel-master/model/travel-domestic-budget-limit.js")(
    sequelize,
    Sequelize
  );
db.MASTER_REIMBURSEMENT_BUDGET =
  require("../../app/master/travel-master/model/reimbursement-budget.model.js")(
    sequelize,
    Sequelize
  );

////Exit Form
db.exit_form = require("../ESS/ExitForm/exit-form-model.js")(
  sequelize,
  Sequelize
);
///
//fnf model start here.......
db.fnf_emp_details = require("../ESS/fnf/model/employeedetails.model.js")(
  sequelize,
  Sequelize
);
db.fnf_earning = require("../ESS/fnf/model/earning.model.js")(
  sequelize,
  Sequelize
);
db.fnf_deduction = require("../ESS/fnf/model/deduction.model.js")(
  sequelize,
  Sequelize
);
db.fnf_summary = require("../ESS/fnf/model/summary.model.js")(
  sequelize,
  Sequelize
);
db.fnf_doc = require("../ESS/fnf/model/documentationpayment.model.js")(
  sequelize,
  Sequelize
);
// fnf model ends here.........

/// announcement

db.hmrs_announcement =
  require("../HRMS/Announcement/model/announcementModel.js")(
    sequelize,
    Sequelize
  );
db.announcementDetails =
  require("../HRMS/Announcement/model/announcementDetails.js")(
    sequelize,
    Sequelize
  );

//// Travel Request From elan

db.ESS_TRAVEL_PLAN =
  require("../ESS/Travel_Request/Model/travel_plan.model.js")(
    sequelize,
    Sequelize
  );
db.ESS_TRAVEL_PLAN_DATA =
  require("../ESS/Travel_Request/Model/travel_plan_data.model.js")(
    sequelize,
    Sequelize
  );
db.travel_request =
  require("../ESS/Travel_Request/Model/travel_Request_Model.js")(
    sequelize,
    Sequelize
  );
db.travel_request_data =
  require("../ESS/Travel_Request/Model/travel_data_models.js")(
    sequelize,
    Sequelize
  );
db.travel_journey_bifurcation =
  require("../ESS/Travel_Request/Model/travel_journey_bifurcation.model.js")(
    sequelize,
    Sequelize
  );
db.travel_approval =
  require("../ESS/Travel_Request/Model/travel_approval_models.js")(
    sequelize,
    Sequelize
  );
//////////

//////// Expense Request

db.expense_request =
  require("../Expenses/travel_expense/model/expense_request_model.js")(
    sequelize,
    Sequelize
  );
db.expense_approval =
  require("../Expenses/travel_expense/model/expense_approval_model.js")(
    sequelize,
    Sequelize
  );
db.expense_request_data =
  require("../Expenses/travel_expense/model/expense_data_model.js")(
    sequelize,
    Sequelize
  );

////

db.TaxCessRate =
  require("../Payroll/tax_calculation_master/model/taxCalculationModel.js")(
    sequelize,
    Sequelize
  );
db.TaxSurcharge =
  require("../Payroll/tax_calculation_master/model/taxCalculationSurchargeModel.js")(
    sequelize,
    Sequelize
  );

db.setup_work_calender =
  require("../HRMS/Setup_Work_Calender/model/setUpWorkCalender.model.js")(
    sequelize,
    Sequelize
  );
db.daily_attendance =
  require("../HRMS/Attendance_Calender/model/daily_attendance_model.js")(
    sequelize,
    Sequelize
  );
db.attendance_userid =
  require("../HRMS/Attendance_Calender/model/attendance_userID_model.js")(
    sequelize,
    Sequelize
  );
db.daily_attendance_master =
  require("../HRMS/Attendance_Calender/model/daily_attendance_master_model.js")(
    sequelize,
    Sequelize
  );
db.attendance_verification_audit =
  require("../HRMS/Attendance_Calender/model/attendance_verification_audit.model.js")(
    sequelize,
    Sequelize
  );


db.leave_master = require("../HRMS/Leave_Management/models/leaveMaster.js")(
  sequelize,
  Sequelize
);
db.leavePolicyDetailModel =
  require("../HRMS/Leave_Management/models/leaveDetailModel.js")(
    sequelize,
    Sequelize
  );
db.leavePolicyRestrictions =
  require("../HRMS/Leave_Management/models/restrictionsModel.js")(
    sequelize,
    Sequelize
  );
db.leavePolicyEntitlement =
  require("../HRMS/Leave_Management/models/leaveEntitlementModel.js")(
    sequelize,
    Sequelize
  );
db.hrmsLeaveAllotment =
  require("../HRMS/Leave_Management/models/userLeaveAllotment.js")(
    sequelize,
    Sequelize
  );
db.applicabilityAll =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/applicabilityAll.js")(
    sequelize,
    Sequelize
  );
db.locationMaster =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/locationMaster.js")(
    sequelize,
    Sequelize
  );
db.appDepartment =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/applicabilityDepartment.js")(
    sequelize,
    Sequelize
  );
db.encashment = require("../HRMS/leave_encashment/model/leaveEncashment.js")(
  sequelize,
  Sequelize
);
db.payroll_loan_advance =
  require("../HRMS/Advance_Payment/model/advancePaymentModel.js")(
    sequelize,
    Sequelize
  );
db.appDesignation =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/applicabilityDesignation.js")(
    sequelize,
    Sequelize
  );
db.appLocation =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/applicabilityLocation.js")(
    sequelize,
    Sequelize
  );
db.appGender =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/applicabilityGender.js")(
    sequelize,
    Sequelize
  );
db.appMarital =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/applicabilityMarital.js")(
    sequelize,
    Sequelize
  );
db.restrictionsDurations =
  require("../HRMS/Leave_Management/models/leavePolicySubModels/restrictionsDurations.js")(
    sequelize,
    Sequelize
  );

db.complaince_setting =
  require("../HRMS/Employee_Master/models/complaince_setting_model.js")(
    sequelize,
    Sequelize
  );
db.EmployeeDeclaration =
  require("../Payroll/DeclarationForm/model/deduction_chapterModel.js")(
    sequelize,
    Sequelize
  );
db.HouseOnRent =
  require("../Payroll/DeclarationForm/model/houseonRentModel.js")(
    sequelize,
    Sequelize
  );
db.housePropertyDeclaration =
  require("../Payroll/DeclarationForm/model/housePropertyModel.js")(
    sequelize,
    Sequelize
  );

db.declaration_type =
  require("../Payroll/DeclarationForm/model/payroll_declaration_type_model.js")(
    sequelize,
    Sequelize
  );
db.gratuity = require("../Payroll/Gratuity/model/gratuityModel.js")(
  sequelize,
  Sequelize
);
db.user_contract =
  require("../HRMS/Employee_Master/models/user_contract_model.js")(
    sequelize,
    Sequelize
  );
/* Compliances Inspection */
// Health Inspection
db.health_inspection =
  require("../Compliances/Health_Compliances/model/health_inspection_model.js")(
    sequelize,
    Sequelize
  );
// Safety Inspection
db.safety_inspection =
  require("../Compliances/Safety_Compliances/model/safety_inspection_model.js")(
    sequelize,
    Sequelize
  );
// Welfare Inspection
db.welfare_inspection =
  require("../Compliances/Welfare_Compliances/model/welfare_inspection_model.js")(
    sequelize,
    Sequelize
  );

/* Document Management System */
db.document_management_system =
  require("../Document_Management_System/Doc_Management_System/model/document_management_model.js")(
    sequelize,
    Sequelize
  );
// complient

/// Webinar

db.WebinarSession = require("../Webinar/model/webinarSessionModel.js")(
  sequelize,
  Sequelize
);
db.WebinarRegistration =
  require("../Webinar/model/webinarRegistrationModel.js")(sequelize, Sequelize);
db.ZoomMeeting = require("../zoomMeetings/model/zoomMeetingModel.js")(
  sequelize,
  Sequelize
);

/** business unit master **/
db.business_unit_master =
  require("../master/business_unit/business_unit_model.js")(
    sequelize,
    Sequelize
  );

// Kt master
db.kt_master = require("../master/kt_master/model/ktMasterModel.js")(
  sequelize,
  Sequelize
);

// kt assignment
db.ktassignment = require("../ESS/kt-assignment/model/ktAssignmentModel.js")(
  sequelize,
  Sequelize
);
db.ktassignmentemployee =
  require("../ESS/kt-assignment/model/ktAssignmentEmpModel.js")(
    sequelize,
    Sequelize
  );
db.kt_master = require('../master/kt_master/model/ktMasterModel.js')(sequelize, Sequelize);

// kt assignment 
db.ktassignment = require('../ESS/kt-assignment/model/ktAssignmentModel.js')(sequelize, Sequelize);
db.ktassignmentemployee = require('../ESS/kt-assignment/model/ktAssignmentEmpModel.js')(sequelize, Sequelize);
/** asset of asset category master **/
/** asset category master */
db.asset_category_master =
  require("../master/Assets/asset_category/model/asset_category_model.js")(
    sequelize,
    Sequelize
  );
/** asset subcategory master */
db.asset_subcategory_master =
  require("../master/Assets/asset_subcategory/model/asset_subcategory_model.js")(
    sequelize,
    Sequelize
  );

db.asset_subcategory_master = require("../master/Assets/asset_subcategory/model/asset_subcategory_model.js")(
  sequelize,
  Sequelize
);
/** asset master */
db.asset_master = require("../master/Assets/asset_master/model/asset_master_model.js")(
  sequelize,
  Sequelize
);
/** notice period master **/
db.notice_period_master =
  require("../master/Notice_Period/notice_period_model.js")(
    sequelize,
    Sequelize
  );
/** asset management **/
/** asset allotment **/
db.asset_allotment =
  require("../Asset Management/Asset_Allotment/model/asset_allotment_model.js")(
    sequelize,
    Sequelize
  );


// In User model
db.user.belongsTo(db.department, {
  foreignKey: "department_id",
  targetKey: "dept_id",
});

// In Department model
db.department.hasMany(db.user, {
  foreignKey: "department_id",
  sourceKey: "dept_id",
});



db.entityMaster.hasMany(db.Master_Complaint, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.Master_Complaint, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
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
db.entityMaster.hasMany(db.Master_Complaint, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.Master_Complaint, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
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

/** grade master **/
db.grade_master = require("../master/grade/grade_models.js")(
  sequelize,
  Sequelize
);
db.user_location_model =
  require("../HRMS/Employee_Master/models/user_branch_model.js")(
    sequelize,
    Sequelize
  );
db.essApplyLeaveDetail =
  require("../ESS/Leave_Apply/models/leaveAppliedModel.js")(
    sequelize,
    Sequelize
  );
db.essLeavedaysDetail =
  require("../ESS/Leave_Apply/models/leaveapplydaysmodel.js")(
    sequelize,
    Sequelize
  );
db.appliedLeaveDocuments =
  require("../ESS/Leave_Apply/models/appliedLeaveDocumentsModel.js")(
    sequelize,
    Sequelize
  );
db.division_master = require("../master/division/division_models.js")(
  sequelize,
  Sequelize
);

// MASTERS
db.empContributionRate =
  require("../master/Payroll/model/employee_contribution.model")(
    sequelize,
    Sequelize
  );
db.emplrContributionRate =
  require("../master/Payroll/model/employer_contribution_rate.model.js")(
    sequelize,
    Sequelize
  );
db.earning_type = require("../master/Payroll/model/earning_type.js")(
  sequelize,
  Sequelize
);
db.master_payroll_cycle =
  require("../master/Payroll/model/payroll_cycle_model.js")(
    sequelize,
    Sequelize
  );
/** kpa */
db.kpa_master = require("../HRMS/KPA_Master/model/kpaModel.js")(
  sequelize,
  Sequelize
);
db.kpa_objective = require("../HRMS/KPA_Master/model/kpaObjectiveModel.js")(
  sequelize,
  Sequelize
);
db.kpa_employee = require("../HRMS/KPA_Master/model/kpaEmployeeModel.js")(
  sequelize,
  Sequelize
);

db.digitalSignature =
  require("../HRMS/Employee_Master/models/digitalSignature.model.js")(
    sequelize,
    Sequelize
  );

/** self assesment */
db.behaviour =
  require("../ESS/Self_Assessment/model/behavioural_Assessment_Model.js")(
    sequelize,
    Sequelize
  );
db.committee_assign_user =
  require("../ESS/Self_Assessment/model/committee_assign_userlist_Model.js")(
    sequelize,
    Sequelize
  );
db.committee_assess_rating =
  require("../ESS/Self_Assessment/model/committee_approved_model.js")(
    sequelize,
    Sequelize
  );
db.skillDevelopment =
  require("../ESS/Self_Assessment/model/skill_Development_plan_Model.js")(
    sequelize,
    Sequelize
  );
db.suggest_skillDevelopment =
  require("../ESS/Self_Assessment/model/suggest_skill_development_plan.js")(
    sequelize,
    Sequelize
  );
db.technical_assessment =
  require("../ESS/Self_Assessment/model/technical_assessment.js")(
    sequelize,
    Sequelize
  );
db.colleague_review =
  require("../ESS/Colleague_Review/models/colleague_review_model.js")(
    sequelize,
    Sequelize
  );
/** performance management */
db.submitted_assessment =
  require("../Performance_Management/Yearly_Assessment_Setup/model/submitted_Assessment_Model.js")(
    sequelize,
    Sequelize
  );
db.assessment =
  require("../Performance_Management/Yearly_Assessment_Setup/model/yearlyAssessmentModel.js")(
    sequelize,
    Sequelize
  );

db.department_Assessment =
  require("../Performance_Management/Yearly_Assessment_Setup/model/yearly_Assessment_depart.Modal.js")(
    sequelize,
    Sequelize
  );

/** hrms notification */
db.hrms_notification =
  require("../notification/hrms_notification/models/hrms_notification_model.js")(
    sequelize,
    Sequelize
  );

/** global minutes */
db.global_minutes =
  require("../master/global_minutes/models/global_minutes_models.js")(
    sequelize,
    Sequelize
  );
db.global_mint_department =
  require("../master/global_minutes/models/glob_minute_department.js")(
    sequelize,
    Sequelize
  );
db.global_mint_designation =
  require("../master/global_minutes/models/global_minutes_designation.js")(
    sequelize,
    Sequelize
  );
db.employee_minutes =
  require("../master/global_minutes/models/employee_minutes_models.js")(
    sequelize,
    Sequelize
  );
//// CRA provider
db.craProvider = require("../Payroll/NPS/craProviderModel.js")(
  sequelize,
  Sequelize
);
db.NpsScheme = require("../Payroll/NPS/npsModel.js")(sequelize, Sequelize);

/// SuperAnnuation
db.superannuationProvider =
  require("../Payroll/superannuation/model/superannuationProviderModel.js")(
    sequelize,
    Sequelize
  );
db.superannuationScheme =
  require("../Payroll/superannuation/model/superannuationSchemeModel.js")(
    sequelize,
    Sequelize
  );
db.ComplianceFY =
  require("../Payroll/compliance_financial_year/model/comliance_fy.js")(
    sequelize,
    Sequelize
  );
// customer review //

db.customer_review =
  require("../master/customer_review/model/customer_review.js")(
    sequelize,
    Sequelize
  );
///////EXTRA HOUR--Overtime Request/////

db.extrahour_Master = require("../master/extra-hour/model/extrahourModel.js")(
  sequelize,
  Sequelize
);

db.overtime_Request = require("../ESS/Ot_Request/model/otRequestModel.js")(
  sequelize,
  Sequelize
);

db.overtime_Request_Details =
  require("../ESS/Ot_Request/model/otRequestDetails.js")(sequelize, Sequelize);

db.overtime_Approver = require("../ESS/Ot_Request/model/otApprover.js")(
  sequelize,
  Sequelize
);
db.VariableEarningAllotment =
  require("../Payroll/Variable_Earning_Allotment/model/variable_earning_model.js")(
    sequelize,
    Sequelize
  );
//////RTK RK
// Reimbursement Master Starts Here
db.TravelType =
  require("../../app/master/travel-master/model/travel-type.model.js")(
    sequelize,
    Sequelize
  );
db.MASTER_TRAVEL_BUDGET_LIMIT =
  require("../../app/master/travel-master/model/travel-budget-limit.js")(
    sequelize,
    Sequelize
  );
db.MASTER_TRAVEL_LOCAL_BUDGET =
  require("../../app/master/travel-master/model/travel-local-budget-limit.js")(
    sequelize,
    Sequelize
  );
db.MASTER_TRAVEL_DOMESTIC_BUDGET =
  require("../../app/master/travel-master/model/travel-domestic-budget-limit.js")(
    sequelize,
    Sequelize
  );
db.MASTER_REIMBURSEMENT_BUDGET =
  require("../../app/master/travel-master/model/reimbursement-budget.model.js")(
    sequelize,
    Sequelize
  );

// Reimbursement Master Ends Here
/////////////////////////////////Foreign Keys will be listed here////////////////////////////////////

/* PAYROLL */
db.payroll_tax_tracking =
  require("../Payroll/Salary_Process_Details/model/payroll_tax_tracking.js")(
    sequelize,
    Sequelize
  );
db.payroll_tax_slab = require("../Payroll/TaxSlab/model/tax_model.js")(
  sequelize,
  Sequelize
);
db.payroll_epf = require("../Payroll/EPF/model/epf_model.js")(
  sequelize,
  Sequelize
);
db.payroll_esi = require("../Payroll/ESI/model/esi_model.js")(
  sequelize,
  Sequelize
);
db.payroll_pt = require("../Payroll/PT/model/pt_model.js")(
  sequelize,
  Sequelize
);
db.payroll_lwf = require("../Payroll/LWF/model/lwf_model.js")(
  sequelize,
  Sequelize
);
db.payroll_statutory = require("../Payroll/Statutory/model/statutory_model.js")(
  sequelize,
  Sequelize
);
db.payroll_salaryComponentEarning =
  require("../Payroll/SalaryComponents/Earnings/model/earning_model")(
    sequelize,
    Sequelize
  );
db.payroll_salaryComponentVariableEarning =
  require("../Payroll/SalaryComponents/variableEarning/model/variable_earning_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_salaryComponentReimbursement =
  require("../Payroll/SalaryComponents/Reimbursement/model/reimbursement_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_salaryComponentDeduction =
  require("../Payroll/SalaryComponents/Deduction/model/deduction_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_salary_template =
  require("../Payroll/SalaryTemplate/model/salary_template_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_pay_salary =
  require("../HRMS/Employee_Master/models/payroll_grade_salary_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_payslip =
  require("../Payroll/Salary_Process_Details/model/pay_slips_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_process =
  require("../Payroll/Salary_Process_Details/model/payroll_process_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_att_month =
  require("../Payroll/Salary_Process_Details/model/payslip_attendance_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_approval =
  require("../Payroll/Salary_Process_Details/model/payroll_approval_request_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_workflowrange =
  require("../Payroll/Salary_Process_Details/model/payroll_workflow_range")(
    sequelize,
    Sequelize
  );
db.payroll_declaration_form =
  require("../Payroll/DeclarationForm/model/declarationForm_model")(
    sequelize,
    Sequelize
  );
db.payroll_Appraisal_Approval =
  require("../Payroll/Salary_Process_Details/model/payroll_appraisal_approval.js")(
    sequelize,
    Sequelize
  );
db.payroll_Appraisal_Details =
  require("../Payroll/Salary_Process_Details/model/payroll_appraisal_details.js")(
    sequelize,
    Sequelize
  );
db.appraisalDuration =
  require("../Payroll/appraisalDuration/model/appraisalDuration_model.js")(
    sequelize,
    Sequelize
  );
db.arrear_salary =
  require("../Payroll/Arrear_Salary/model/arrear_salary_model.js")(
    sequelize,
    Sequelize
  );
db.payroll_incentive = require("../Payroll/Incentive/model/model.js")(
  sequelize,
  Sequelize
);
db.fine_management =
  require("../Payroll/Fine_Management/model/fine_management_model.js")(
    sequelize,
    Sequelize
  );
/* DESTINATION MASTER*/

// lms start
db.lms_course_category =
  require("../LMS/cource-category/model/category-model.js")(
    sequelize,
    Sequelize
  );
db.lms_course = require("../LMS/course/model/course.js")(sequelize, Sequelize);
db.lms_course_content = require("../LMS/course/model/content.js")(
  sequelize,
  Sequelize
);
db.lms_course_assessment = require("../LMS/course/model/assesment.js")(
  sequelize,
  Sequelize
);
db.lms_course_question = require("../LMS/course/model/question.js")(
  sequelize,
  Sequelize
);
db.lms_assign_course = require("../LMS/course/model/assign_course.js")(
  sequelize,
  Sequelize
);
db.lms_assign_department =
  require("../LMS/course/model/assign_course_department.js")(
    sequelize,
    Sequelize
  );
db.lms_assign_designation =
  require("../LMS/course/model/assign_course_designation.js")(
    sequelize,
    Sequelize
  );
db.lms_assign_employe = require("../LMS/course/model/assign_course_employe.js")(
  sequelize,
  Sequelize
);
db.lms_submit_assessment =
  require("../LMS/course/model/assessment_submission.js")(sequelize, Sequelize);
db.lms_question_attempt =
  require("../LMS/course/model/assessment_question_attempt.js")(
    sequelize,
    Sequelize
  );
db.lms_requested_course = require("../LMS/course/model/request_course.js")(
  sequelize,
  Sequelize
);
db.lms_approval_course =
  require("../LMS/course/model/course_approval_level.js")(sequelize, Sequelize);
db.lms_requested_course_assign =
  require("../LMS/course/model/request_course_assign.js")(sequelize, Sequelize);

db.document_management =
  require("../HRMS/Document_Management/models/documentManagementModel.js")(
    sequelize,
    Sequelize
  );
db.templateAssignment =
  require("../HRMS/Document_Management/models/templateAssignmentModel.js")(
    sequelize,
    Sequelize
  );

db.attendance_request =
  require("../ESS/Attendance_Request/models/attendance_request.model.js")(
    sequelize,
    Sequelize
  );

db.deduction_rules =
  require("../HRMS/Deduction_Rules/models/deduction_rules_model.js")(
    sequelize,
    Sequelize
  );

db.bioAttendance_timelist =
  require("../HRMS/Attendance_total_time/models/bioAttandance_time_model.js")(
    sequelize,
    Sequelize
  );

// Cost Center
db.cost_center = require("../Finance_And_Accounting/Cost_Center/models/cost_center_model.js")(sequelize, Sequelize)
db.cost_center_map = require("../Finance_And_Accounting/Cost_Center/models/costCenterMap.js")(sequelize, Sequelize)




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
db.lms_requested_course.hasMany(db.lms_submit_assessment, {
  foreignKey: "request_id",
  onDelete: "RESTRICT",
});
db.lms_submit_assessment.belongsTo(db.lms_assign_course, {
  foreignKey: "assign_id",
});
db.lms_submit_assessment.belongsTo(db.lms_requested_course, {
  foreignKey: "request_id",
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
db.WorkFlow_Master.hasMany(db.payroll_Appraisal_Approval, {
  foreignKey: "workflow_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.payroll_Appraisal_Approval, {
  foreignKey: "role_id",
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
// lms end
/**resignation */

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
db.employeeResignation.hasMany(db.All_Resignation_approval, {
  foreignKey: "resignnation_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.All_Resignation_approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.All_Resignation_approval.hasMany(db.All_Resignation_review, {
  foreignKey: "review_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.Resignation_approval, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.employeeResignation, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.employeeResignation, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.employeeResignation.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.employeeResignation, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});

db.role_menu_access.belongsTo(db.role_master, {
  through: "HRMS_RBAC_ROLE_MASTER",
  foreignKey: "role_master_id",
});

db.user.hasMany(db.role_master, {
  throgh: "role_master",
  foreignKey: "role_master_id",
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

db.states.belongsTo(db.countryss, {
  throgh: "countryss",
  foreignKey: "countryss_id",
});

db.countryss.hasOne(db.entityMaster, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.user, {
  foreignKey: "primary_entity_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.user, {
  foreignKey: "primary_branch_id",
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
db.user.hasMany(db.user_allowance, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_salary, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_documents, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_contract, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.asset.hasOne(db.ItemMaster, {
  foreignKey: "asset_id",
  onDelete: "RESTRICT",
});
db.ItemMaster.belongsTo(db.asset, { foreignKey: "asset_id" });
db.product_master.hasMany(db.product__variant_master, {
  foreignKey: "product_master_id",
  onDelete: "RESTRICT",
});
db.product__variant_master.belongsTo(db.product_master, {
  foreignKey: "product_master_id",
});
db.uom.hasOne(db.product__variant_master, {
  foreignKey: "uom_id",
  onDelete: "RESTRICT",
});
db.product__variant_master.belongsTo(db.uom, { foreignKey: "uom_id" });
db.uom.hasOne(db.ItemMaster, { foreignKey: "uom_id", onDelete: "RESTRICT" });
db.ItemMaster.belongsTo(db.uom, { foreignKey: "uom_id" });
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
db.user.hasMany(db.extrahour_Master, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.extrahour_Master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.entityMaster.hasMany(db.entityStake, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

// fnf foreign key starts..........

db.user.hasMany(db.fnf_emp_details, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
  as: "fnfdetails",
});
db.fnf_emp_details.belongsTo(db.user, {
  foreignKey: "employee_id",
  as: "fnfdetails",
});
// Relationship: fnf_emp_details → fnf_earning
db.fnf_emp_details.hasMany(db.fnf_earning, {
  foreignKey: "fnf_employee_id",
  onDelete: "RESTRICT",
  as: "earningsByFnfId",
});
db.fnf_earning.belongsTo(db.fnf_emp_details, {
  foreignKey: "fnf_employee_id",
  targetKey: "id",
  as: "fnfEmployeeDetails",
});

// Relationship: user → fnf_earning
db.user.hasMany(db.fnf_earning, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
  as: "earningsByUserId",
});
db.fnf_earning.belongsTo(db.user, {
  foreignKey: "employee_id",
  as: "userDetails",
});

// Deduction

db.fnf_emp_details.hasMany(db.fnf_deduction, {
  foreignKey: "fnf_employee_id",
  onDelete: "RESTRICT",
  as: "deductionsByFnfId",
});
db.fnf_deduction.belongsTo(db.fnf_emp_details, {
  foreignKey: "fnf_employee_id",
  targetKey: "id",
  as: "fnfEmployeeDetailsForDeduction",
});

db.user.hasMany(db.fnf_deduction, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
  as: "userDeductions",
});
db.fnf_deduction.belongsTo(db.user, {
  foreignKey: "employee_id",
  as: "userDetailsForDeduction",
});

db.TaxCessRate.hasMany(db.TaxSurcharge, {
  foreignKey: "tax_master_id",
  onDelete: "RESTRICT",
});
db.TaxSurcharge.belongsTo(db.TaxCessRate, { foreignKey: "tax_master_id" });

// summary

db.fnf_emp_details.hasMany(db.fnf_summary, {
  foreignKey: "fnf_employee_id",
  onDelete: "RESTRICT",
  as: "summariesByFnfId",
});
db.fnf_summary.belongsTo(db.fnf_emp_details, {
  foreignKey: "fnf_employee_id",
  targetKey: "id",
  as: "fnfEmployeeDetailsForSummary",
});

db.user.hasMany(db.fnf_summary, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
  as: "userSummaries",
});
db.fnf_summary.belongsTo(db.user, {
  foreignKey: "employee_id",
  as: "userDetailsForSummary",
});

// docs

db.fnf_emp_details.hasMany(db.fnf_doc, {
  foreignKey: "fnf_employee_id",
  onDelete: "RESTRICT",
  as: "documentsByFnfId",
});
db.fnf_doc.belongsTo(db.fnf_emp_details, {
  foreignKey: "fnf_employee_id",
  targetKey: "id",
  as: "fnfEmployeeDetailsForDoc",
});

db.user.hasMany(db.fnf_doc, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
  as: "userDocuments",
});
db.fnf_doc.belongsTo(db.user, {
  foreignKey: "employee_id",
  as: "userDetailsForDoc",
});

///// hrms announcement foreign key Starts here
db.entityMaster.hasMany(db.hmrs_announcement, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.hmrs_announcement, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.hmrs_announcement, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.hmrs_announcement.hasMany(db.announcementDetails, {
  foreignKey: "announcement_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.announcementDetails, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});
///// hrms announcement foreign key end here

//fnf foreign key ends...........

db.user.hasMany(db.allowance, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.department.hasMany(db.area, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.area.belongsTo(db.department, { foreignKey: "department_id" });
db.entityMaster.hasMany(db.area, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.area.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

//////////OT
db.entityMaster.hasMany(db.overTime, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.overTime.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

/////////////////////////////////////////////////////////////////////////////

db.countryss.hasOne(db.tbl_branch, {
  foreignKey: "country_id",
  onDelete: "RESTRICT",
});
db.states.hasOne(db.tbl_branch, {
  foreignKey: "state_id",
  onDelete: "RESTRICT",
});
db.city.hasOne(db.tbl_branch, { foreignKey: "city_id", onDelete: "RESTRICT" });
db.financial_year.hasMany(db.contract_types, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.contract_types.belongsTo(db.financial_year, { foreignKey: "financial_id" });
db.states.hasMany(db.entityMaster, {
  foreignKey: "states_id",
  onDelete: "RESTRICT",
});
db.entityMaster.belongsTo(db.states, { foreignKey: "states_id" });
db.countryss.hasMany(db.user, {
  foreignKey: "present_country_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.user, {
  foreignKey: "present_state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.user, {
  foreignKey: "present_city_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.user, {
  foreignKey: "permanent_country_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.user, {
  foreignKey: "permanent_state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.user, {
  foreignKey: "permanent_city_id",
  onDelete: "RESTRICT",
});
db.countryss.hasMany(db.user, {
  foreignKey: "personal_country_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.user, {
  foreignKey: "personal_state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.user, {
  foreignKey: "personal_city_id",
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
db.designation.hasMany(db.user, {
  foreignKey: "designation_id",
  onDelete: "RESTRICT",
});
db.area.hasMany(db.user, { foreignKey: "area_id", onDelete: "RESTRICT" });
db.employmenttype.hasMany(db.user, {
  foreignKey: "emplyoment_type_id",
  onDelete: "RESTRICT",
});
db.municipality_name.hasMany(db.user, {
  foreignKey: "municipality_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.user, {
  foreignKey: "role_master_id",
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
db.bank_master.hasMany(db.user, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.user.belongsTo(db.bank_master, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.user.belongsTo(db.user_family, {
  foreignKey: "bank_id",
  onDelete: "RESTRICT",
});
db.contract_types.hasMany(db.user, {
  foreignKey: "contract_types_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user, {
  foreignKey: "reporting_manager_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.WorkFlow_Master, {
  foreignKey: "entity_id",
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
db.entityMaster.hasMany(db.user_entity, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_entity, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_bgv, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.job_descripition, {
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
db.candidate_bgv_company =
  require("../Recruitment/BGV/model/candidate_bgv_company_details.js")(
    sequelize,
    Sequelize
  );
db.company_qual_rating =
  require("../Recruitment/BGV/model/cand_company_qualityrating.js")(
    sequelize,
    Sequelize
  );
db.Job_Request.hasMany(db.job_descripition, {
  foreignKey: "job_request_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.Job_Request, {
  foreignKey: "created_by",
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

db.entityMaster.hasMany(db.department, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.role_master.hasMany(db.department, {
  foreignKey: "role_master_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.department, {
  foreignKey: "employee_id",
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
db.job_descripition.hasMany(db.job_descripition_email, {
  foreignKey: "job_descripition_id",
  onDelete: "RESTRICT",
});
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
db.tbl_branch.hasMany(db.candidate_offer_letter, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.self_rating.hasMany(db.technical_assessment, {
  foreignKey: "self_rating_id",
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

db.job_descripition_email.hasMany(db.user, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
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

db.entityMaster.hasMany(db.read_write_access, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

/** payroll */

db.user.hasMany(db.payroll_payslip, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_payslip, {
  foreignKey: "financial_year_id",
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
db.user.hasMany(db.EmployeeDeclaration, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.EmployeeDeclaration.belongsTo(db.user, {
  foreignKey: "employee_id",
});
db.user.hasMany(db.HouseOnRent, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.HouseOnRent.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.user.hasMany(db.housePropertyDeclaration, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.housePropertyDeclaration.belongsTo(db.user, {
  foreignKey: "employee_id",
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
db.user.hasMany(db.payroll_tax_tracking, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_tax_tracking, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_att_month, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
/** hrms updtaed */
db.countryss.hasMany(db.user, {
  foreignKey: "employee_country_id",
  onDelete: "RESTRICT",
});
db.states.hasMany(db.user, {
  foreignKey: "employee_state_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.user, {
  foreignKey: "employee_city_id",
  onDelete: "RESTRICT",
});

// db.leave_master.hasOne(db.encashment,{foreignKey:"leaveId",onDelete:'RESTRICT'})
// db.encashment.belongsTo(db.leave_master,{foreignKey:"leaveId",onDelete:'RESTRICT'})
db.user.hasOne(db.encashment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.encashment.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.encashment, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.encashment.belongsTo(db.user, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.department.hasOne(db.encashment, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.encashment.belongsTo(db.department, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasOne(db.encashment, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.encashment.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

/*--- For Advance Payment start     */
db.user.hasOne(db.payroll_loan_advance, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
  as: "EmployeeAdvance",
});
db.payroll_loan_advance.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
  as: "Employee",
});

db.department.hasOne(db.payroll_loan_advance, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.payroll_loan_advance.belongsTo(db.department, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});

db.financial_year.hasOne(db.payroll_loan_advance, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.payroll_loan_advance.belongsTo(db.financial_year, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

/*--- For Advance Payment end     */
db.grade_master.hasOne(db.user, {
  foreignKey: "grade_id",
  onDelete: "RESTRICT",
});

db.tbl_branch.hasMany(db.user_location_model, {
  foreignKey: "location_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user_location_model, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.user, {
  foreignKey: "approval_manager_id",
  onDelete: "RESTRICT",
});
db.designation.hasMany(db.user_salary, {
  foreignKey: "from_designation_id",
  onDelete: "RESTRICT",
});
db.designation.hasMany(db.user_salary, {
  foreignKey: "to_designation_id",
  onDelete: "RESTRICT",
});
db.grade_master.hasMany(db.user_salary, {
  foreignKey: "from_grade_id",
  onDelete: "RESTRICT",
});
db.grade_master.hasMany(db.user_salary, {
  foreignKey: "to_grade_id",
  onDelete: "RESTRICT",
});
db.user_salary.belongsTo(db.designation, {
  foreignKey: "from_designation_id",
  as: "FromDesignation",
});
db.user_salary.belongsTo(db.designation, {
  foreignKey: "to_designation_id",
  as: "ToDesignation",
});
db.user_salary.belongsTo(db.grade_master, {
  foreignKey: "from_grade_id",
  as: "FromGrade",
});
db.user_salary.belongsTo(db.grade_master, {
  foreignKey: "to_grade_id",
  as: "ToGrade",
});
db.division_master.hasOne(db.user, {
  foreignKey: "division_id",
  onDelete: "RESTRICT",
});
db.department.belongsTo(db.role_master, { foreignKey: "role_master_id" });
db.entityMaster.hasMany(db.tbl_branch, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.city.hasMany(db.states, { foreignKey: "states_id", onDelete: "RESTRICT" });

/** grade master */
db.entityMaster.hasMany(db.grade_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

/** division master */
db.entityMaster.hasMany(db.division_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

/** leave module */
db.leavePolicyDetail =
  require("../master/Leave_Master/Leave_Master/model/leave_master.model.js")(
    sequelize,
    Sequelize
  );
db.screenOnOffDetail =
  require("../master/Leave_Master/Attendance_Calendar/model/screen_on_off.model.js")(
    sequelize,
    Sequelize
  );
db.essApplyLeaveDetail =
  require("../ESS/Leave_Apply/models/leaveAppliedModel.js")(
    sequelize,
    Sequelize
  );
db.essLeavedaysDetail =
  require("../ESS/Leave_Apply/models/leaveapplydaysmodel.js")(
    sequelize,
    Sequelize
  );
db.appliedLeaveDocuments =
  require("../ESS/Leave_Apply/models/appliedLeaveDocumentsModel.js")(
    sequelize,
    Sequelize
  );
db.essApplyLeaveDetail.hasMany(db.essLeavedaysDetail, {
  foreignKey: "apply_leave_id",
  onDelete: "RESTRICT",
});

/** END */

db.essApplyLeaveDetail.hasMany(db.appliedLeaveDocuments, {
  foreignKey: "applyDetailId",
});

db.appliedLeaveDocuments.belongsTo(db.essApplyLeaveDetail, {
  foreignKey: "applyDetailId",
});
// ESS APPLY LEAVE HAS MANY (MASTER LEAVE ID and APP DEPARTMENT ID )

db.user.hasMany(db.essApplyLeaveDetail, {
  throgh: "HRMS_APPLIED_LEAVE_DETAIL",
  foreignKey: "employee_id",
});

db.essApplyLeaveDetail.belongsTo(db.user, {
  throgh: "HRMS_REGISTERED_USER",
  foreignKey: "employee_id",
});

db.department.hasMany(db.essApplyLeaveDetail, {
  throgh: "HRMS_APPLIED_LEAVE_DETAIL",
  foreignKey: "dept_id",
});

db.essApplyLeaveDetail.belongsTo(db.department, {
  throgh: "MASTER_DEPARTMENT",
  foreignKey: "dept_id",
});

db.leave_master.hasMany(db.essApplyLeaveDetail, {
  throgh: "HRMS_APPLIED_LEAVE_DETAIL",
  foreignKey: "leaveId",
});

db.essApplyLeaveDetail.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
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

//////////////Foreign Keys for Leave Policy Details Starts /////////////
//  DETAIL HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.leavePolicyDetailModel, {
  foreignKey: "leaveId",
});

db.leavePolicyDetailModel.belongsTo(db.leave_master, {
  foreignKey: "leaveId",
});
// Entity Id
db.entityMaster.hasMany(db.leavePolicyDetailModel, {
  foreignKey: "entity_id",
});
db.leavePolicyDetailModel.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});
// Financial Year Id
db.financial_year.hasMany(db.leavePolicyDetailModel, {
  foreignKey: "financial_id",
});
db.leavePolicyDetailModel.belongsTo(db.financial_year, {
  foreignKey: "financial_id",
});
//////////////Foreign Keys for Leave Policy Details Ends /////////////

db.craProvider.hasMany(db.NpsScheme, {
  foreignKey: "craProvider_id",
  onDelete: "RESTRICT",
});
db.NpsScheme.belongsTo(db.craProvider, { foreignKey: "craProvider_id" });

//////////////Foreign Keys for User Leave Allotment Starts /////////////

db.user.hasMany(db.hrmsLeaveAllotment, {
  foreignKey: "employee_id",
});
db.hrmsLeaveAllotment.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.leave_master.hasMany(db.hrmsLeaveAllotment, {
  foreignKey: "leave_id",
});
db.hrmsLeaveAllotment.belongsTo(db.leave_master, {
  foreignKey: "leave_id",
});
//////////////Foreign Keys for User Leave Allotment Starts /////////////

//  ENTILEMENT HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.leavePolicyEntitlement, {
  throgh: "HRMS_LEAVE_POLICY_ENTITLEMENT",
  foreignKey: "leaveId",
});

db.leavePolicyEntitlement.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

//  RESTRICTIONS HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.leavePolicyRestrictions, {
  throgh: "HRMS_LEAVE_POLICY_RESTRICTIONS",
  foreignKey: "leaveId",
});

db.leavePolicyRestrictions.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

// (FOR ALL) APPLICABLITY HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.applicabilityAll, {
  throgh: "HRMS_APPLICABILITY_ALL",
  foreignKey: "leaveId",
});

db.applicabilityAll.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

// Marital HAS MANY MASTER LEAVE
db.leave_master.hasMany(db.appMarital, {
  throgh: "HRMS_APPLICABILITY_MARITAL",
  foreignKey: "leaveId",
});

db.appMarital.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
  foreignKey: "leaveId",
});

db.leave_master.hasMany(db.appGender, {
  throgh: "HRMS_APPLICABILITY_GENDER",
  foreignKey: "leaveId",
});

db.appGender.belongsTo(db.leave_master, {
  throgh: "HRMS_LEAVE_MASTER",
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

db.entityMaster.hasMany(db.leave_master, {
  foreignKey: "entity_id",
});

db.leave_master.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.user.hasMany(db.leave_master, {
  foreignKey: "employee_id",
});

/*** kpa relation */
db.kpa_master.hasMany(db.technical_assessment, {
  foreignKey: "kpa_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.kpa_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.kpa_master, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.kpa_master.hasMany(db.kpa_employee, {
  foreignKey: "kpa_master_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.kpa_employee, {
  foreignKey: "applicable_department_id",
  onDelete: "RESTRICT",
});
db.kpa_objective.hasMany(db.kpa_master, {
  foreignKey: "objective_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.kpa_master, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});

/** self assesment relation */
db.submitted_assessment.hasMany(db.behaviour, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.behaviour, {
  foreignKey: "submit_assessment_id",
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
db.submitted_assessment.hasMany(db.skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.suggest_skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.skillDevelopment, {
  foreignKey: "financial_year_id",
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
db.kpa_master.hasMany(db.technical_assessment, {
  foreignKey: "kpa_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.technical_assessment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
//extra hour **overtime request//
db.user.hasMany(db.overtime_Request, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.overtime_Request, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.overtime_Request, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.overtime_Request, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.overtime_Request.hasMany(db.overtime_Request_Details, {
  foreignKey: "request_id",
  onDelete: "RESTRICT",
});
db.overtime_Request.hasMany(db.overtime_Approver, {
  foreignKey: "request_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.overtime_Approver, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

/***performance management */
db.user.hasMany(db.department_Assessment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});

db.assessment.hasMany(db.department_Assessment, {
  foreignKey: "yearly_assessment_id",
  onDelete: "RESTRICT",
});

db.department.hasMany(db.assessment, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});
db.assessment.belongsTo(db.department, { foreignKey: "dept_id" });

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
db.submitted_assessment.hasMany(db.committee_assign_user, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});

db.submitted_assessment.hasMany(db.suggest_skillDevelopment, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.committee_assess_rating, {
  foreignKey: "submit_assessment_id",
  onDelete: "RESTRICT",
});
db.submitted_assessment.hasMany(db.technical_assessment, {
  foreignKey: "submit_assessment_id",
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
db.financial_year.hasMany(db.assessment, {
  foreignKey: "filter_fy",
  onDelete: "RESTRICT",
});
db.assessment.hasMany(db.submitted_assessment, {
  foreignKey: "yearly_assessment_id",
  onDelete: "RESTRICT",
});

/** hrms notification */
db.entityMaster.hasMany(db.hrms_notification, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

/** calender and attendence */
db.entityMaster.hasMany(db.setup_work_calender, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.setup_work_calender, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.setup_work_calender, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.daily_attendance, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.daily_attendance, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.daily_attendance_master, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.attendance_verification_audit, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.attendance_verification_audit.belongsTo(db.user, {
  foreignKey: "employee_id",
});
db.entityMaster.hasMany(db.daily_attendance_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_pay_salary, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
// db.financial_year.hasMany(db.payroll_pay_salary, {
//   foreignKey: "financial_year_id",
//   onDelete: "RESTRICT",
// });
db.user.hasMany(db.payroll_pay_salary, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
/** global minutes */
db.entityMaster.hasMany(db.global_minutes, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.global_minutes.hasMany(db.global_mint_department, {
  foreignKey: "gm_id",
  as: "applicable_department",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.global_mint_department, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});
db.global_minutes.hasMany(db.global_mint_designation, {
  foreignKey: "gm_id",
  as: "applicable_designation",
  onDelete: "RESTRICT",
});
db.designation.hasMany(db.global_mint_designation, {
  foreignKey: "designation_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.employee_minutes, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.employee_minutes, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.global_minutes.hasMany(db.employee_minutes, {
  foreignKey: "global_minute_id",
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
db.employmenttype.hasMany(db.Job_Request, {
  foreignKey: "emplyoment_type_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.entityMaster, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
db.company_master.hasMany(db.entityMaster, {
  foreignKey: "company_id",
  onDelete: "RESTRICT",
});
db.employmenttype.hasMany(db.job_descripition, {
  foreignKey: "emplyoment_type_id",
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
  foreignKey: "closed_login_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_payslip, {
  foreignKey: "rejected_login_id",
  onDelete: "RESTRICT",
});

db.job_descripition_email.hasMany(db.candidate_docs, {
  foreignKey: "candidate_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.complaince_setting, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.complaince_setting.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.complaince_setting, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.complaince_setting.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.job_descripition_question.hasMany(db.candidate_answer, {
  foreignKey: "question_id",
  as: "dept_officer",
  onDelete: "RESTRICT",
});
db.job_descripition_email.hasMany(db.candidate_answer, {
  foreignKey: "candidate_id",
  as: "dept_officer",
  onDelete: "RESTRICT",
});

db.payroll_pay_salary.hasMany(db.payroll_Appraisal_Details, {
  foreignKey: "salary_template_id",
  onDelete: "RESTRICT",
});
db.payroll_Appraisal_Details.hasMany(db.payroll_Appraisal_Approval, {
  foreignKey: "payrollDetails_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_Appraisal_Approval, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_Appraisal_Details, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.payroll_Appraisal_Details.hasMany(db.payroll_Appraisal_Approval, {
  foreignKey: "payrollDetails_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_Appraisal_Details, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_Appraisal_Details, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.payroll_Appraisal_Details, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});

//// foreign key form elan travel request

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
db.city.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "plan_city_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.city, {
  foreignKey: "plan_city_id",
  as: "planCity",
});
db.city.hasMany(db.ESS_TRAVEL_PLAN_DATA, {
  foreignKey: "actual_city_id",
  onDelete: "RESTRICT",
});
db.ESS_TRAVEL_PLAN_DATA.belongsTo(db.city, {
  foreignKey: "actual_city_id",
  as: "actualCity",
});
db.user.hasMany(db.travel_request, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
});
db.travel_request.belongsTo(db.user, { foreignKey: "user_id" });
db.entityMaster.hasMany(db.travel_request, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.travel_request, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
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
db.travel_request_data.belongsTo(db.travel_request, {
  foreignKey: "travel_request_id",
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
// db.entityMaster.hasMany(db.additionalCharge, { foreignKey: "entity_id", onDelete: 'RESTRICT' })
// db.financial_year.hasMany(db.additionalCharge, { foreignKey: "financial_id", onDelete: 'RESTRICT' })
// db.hsn_sac_master.hasMany(db.additionalCharge,{foreignKey:"additional_hsn_code",onDelete:'RESTRICT'})

db.travel_request_data.belongsTo(db.travel_request, {
  foreignKey: "travel_request_id",
});

/// Expense Request

//// superannuation
db.superannuationProvider.hasMany(db.superannuationScheme, {
  foreignKey: "provider",
  onDelete: "RESTRICT",
});
db.superannuationScheme.belongsTo(db.superannuationProvider, {
  foreignKey: "provider",
});

// add masterid

db.user.hasMany(db.attendance_userid, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.attendance_userid, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.user.hasMany(db.colleague_review, {
  foreignKey: "colleague_id",
  onDelete: "RESTRICT",
});
db.colleague_review.belongsTo(db.user, { foreignKey: "colleague_id" });

db.self_rating.hasMany(db.technical_assessment, {
  foreignKey: "approval_manager_rating_Id",
  onDelete: "RESTRICT",
});
db.self_rating.hasMany(db.behaviour, {
  foreignKey: "approval_m_r_id",
  onDelete: "RESTRICT",
});

db.ticket_category = require("../ESS/Help_Desk/models/ticketcartogerymodal.js")(
  sequelize,
  Sequelize
);
db.my_allocatedticket = require("../ESS/Help_Desk/models/helpdeskticket.js")(
  sequelize,
  Sequelize
);
db.myticket_document =
  require("../ESS/Help_Desk/models/tiketdocument.modal.js")(
    sequelize,
    Sequelize
  );

db.department.hasMany(db.ticket_category, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});
db.ticket_category.belongsTo(db.department, { foreignKey: "dept_id" });

db.user.hasMany(db.my_allocatedticket, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.my_allocatedticket.belongsTo(db.user, { foreignKey: "employee_id" });

db.ticket_category.hasMany(db.my_allocatedticket, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
});
db.my_allocatedticket.belongsTo(db.ticket_category, {
  foreignKey: "category_id",
});

db.my_allocatedticket.hasMany(db.myticket_document, {
  foreignKey: "ticket_id",
  onDelete: "RESTRICT",
});
db.myticket_document.belongsTo(db.my_allocatedticket, {
  foreignKey: "ticket_id",
});
db.user.hasMany(db.my_allocatedticket, {
  foreignKey: "allocate_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.my_allocatedticket, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});

db.employee_Transfer =
  require("../HRMS/Employee_Transfer/modal/employee.Transfer.modal.js")(
    sequelize,
    Sequelize
  );

db.entityMaster.hasMany(db.employee_Transfer, {
  foreignKey: "fromEntityId",
  onDelete: "RESTRICT",
});
db.employee_Transfer.belongsTo(db.entityMaster, { foreignKey: "fromEntityId" });

db.entityMaster.hasMany(db.employee_Transfer, {
  foreignKey: "toEntityId",
  onDelete: "RESTRICT",
});
db.employee_Transfer.belongsTo(db.entityMaster, { foreignKey: "toEntityId" });

db.entityMaster.hasMany(db.employee_Transfer, {
  foreignKey: "approvalEntityId",
  onDelete: "RESTRICT",
});
db.employee_Transfer.belongsTo(db.entityMaster, {
  foreignKey: "approvalEntityId",
});

db.user.hasMany(db.employee_Transfer, {
  foreignKey: "fromEmpId",
  onDelete: "RESTRICT",
});
db.employee_Transfer.belongsTo(db.user, { foreignKey: "fromEmpId" });

db.user.hasMany(db.employee_Transfer, {
  foreignKey: "approvalEmpId",
  onDelete: "RESTRICT",
});
db.employee_Transfer.belongsTo(db.user, { foreignKey: "approvalEmpId" });

db.shift_Allocation =
  require("../HRMS/Shift_Allocation/model/shift_Allocation_modal.js")(
    sequelize,
    Sequelize
  );

db.department.hasMany(db.shift_Allocation, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});
db.shift_Allocation.belongsTo(db.department, { foreignKey: "dept_id" });

db.user.hasMany(db.shift_Allocation, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.shift_Allocation.belongsTo(db.user, { foreignKey: "employee_id" });

db.entityMaster.hasMany(db.shift_Allocation, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.shift_Allocation.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

db.shift.hasMany(db.shift_Allocation, {
  foreignKey: "shift_master_id",
  onDelete: "RESTRICT",
});
db.shift_Allocation.belongsTo(db.shift, { foreignKey: "shift_master_id" });

db.entityMaster.hasMany(db.shift, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.shift.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.department.hasMany(db.setup_work_calender, {
  foreignKey: "dept_id",
  onDelete: "RESTRICT",
});
db.setup_work_calender.belongsTo(db.department, { foreignKey: "dept_id" });

db.entityMaster.hasMany(db.shift, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.shift.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.bank_master.hasMany(db.user, {
  foreignKey: { name: "alt_bank_id", allowNull: true },
  onDelete: "RESTRICT",
});

db.assign_comp_off = require("../HRMS/CompOFF/modal/compemployee.modal.js")(
  sequelize,
  Sequelize
);
db.assign_comp_off_employee = require("../HRMS/CompOFF/modal/compoff.modal.js")(
  sequelize,
  Sequelize
);
db.comp_off_credit_logs = require("../HRMS/CompOFF/modal/credit_logs.js")(
  sequelize,
  Sequelize
);

db.assign_comp_off.hasMany(db.assign_comp_off_employee, {
  foreignKey: "comp_id",
  onDelete: "RESTRICT",
});
db.assign_comp_off_employee.belongsTo(db.assign_comp_off, {
  foreignKey: "comp_id",
});

db.user.hasMany(db.assign_comp_off_employee, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.assign_comp_off_employee.belongsTo(db.user, { foreignKey: "employee_id" });
///////////
db.assign_comp_off.hasMany(db.comp_off_credit_logs, {
  foreignKey: "comp_id",
  onDelete: "RESTRICT",
});
db.comp_off_credit_logs.belongsTo(db.assign_comp_off, {
  foreignKey: "comp_id",
});

db.user.hasMany(db.comp_off_credit_logs, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.comp_off_credit_logs.belongsTo(db.user, { foreignKey: "employee_id" });

db.leave_master.hasMany(db.comp_off_credit_logs, {
  foreignKey: "leave_id",
  onDelete: "RESTRICT",
});
db.comp_off_credit_logs.belongsTo(db.leave_master, { foreignKey: "leave_id" });

////////
db.serial_number = require("../HRMS/Attendance_Calender/model/serial.modal.js")(
  sequelize,
  Sequelize
);

db.google_api_key =
  require("../HRMS/Attendance_Calender/model/google-api-key-model.js")(
    sequelize,
    Sequelize
  );

// pms tables
db.assessment_grading =
  require("../HRMS/KPA_Master/model/assessmet-grading-model.js")(
    sequelize,
    Sequelize
  );

// pms models
db.assessment_grading =
  require("../HRMS/KPA_Master/model/assessmet-grading-model.js")(
    sequelize,
    Sequelize
  );
db.assessment_result_parameters =
  require("../HRMS/KPA_Master/model/assessment-result-parameters-model.js")(
    sequelize,
    Sequelize
  );

db.assessment_grading.belongsTo(db.technical_assessment, {
  foreignKey: "self_rating_id",
  onDelete: "RESTRICT",
});
db.technical_assessment.hasMany(db.assessment_grading, {
  foreignKey: "self_rating_id",
  onDelete: "RESTRICT",
});
// Reimbursement Master Starts Here

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
// Reimbursement Master Ends Here

// Bonus Master starts here

db.entityMaster.hasMany(db.masterBonus, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.masterBonus, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.masterBonus, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.masterBonus, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.masterBonus, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});

//variable allotment relations
db.VariableEarningAllotment.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.VariableEarningAllotment, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.VariableEarningAllotment, {
  foreignKey: "financial_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.VariableEarningAllotment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

//arrear salary relations
db.arrear_salary.belongsTo(db.user, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.arrear_salary, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.arrear_salary, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.arrear_salary, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.arrear_salary, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

//Incentive relations
db.user.hasMany(db.payroll_incentive, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.payroll_incentive, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.payroll_incentive, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

//Fine_Management relations
db.user.hasMany(db.fine_management, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.financial_year.hasMany(db.fine_management, {
  foreignKey: "financial_year_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.fine_management, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.attendance_request, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.attendance_request.belongsTo(db.entityMaster, {
  foreignKey: "entity_id",
});

db.user.hasMany(db.attendance_request, {
  foreignKey: "employee_id",
  sourceKey: "employee_id",
  as: "attendances",
  onDelete: "RESTRICT",
});

db.attendance_request.belongsTo(db.user, {
  foreignKey: "employee_id",
  targetKey: "employee_id",
  as: "employee",
});

// Compliances_Inspection relation For Health
db.user.hasMany(db.health_inspection, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.health_inspection, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.health_inspection, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});

// Compliances_Inspection relation For Safety
db.user.hasMany(db.safety_inspection, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.safety_inspection, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.safety_inspection, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});

// Compliances_Inspection relation For Welfare
db.user.hasMany(db.welfare_inspection, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.welfare_inspection, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.tbl_branch.hasMany(db.welfare_inspection, {
  foreignKey: "branch_id",
  onDelete: "RESTRICT",
});
// Document Management System relation
db.entityMaster.hasMany(db.document_management_system, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.document_management_system, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.department.hasMany(db.document_management_system, {
  foreignKey: "department_id",
  onDelete: "RESTRICT",
});
/** business unit master */
db.entityMaster.hasMany(db.business_unit_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});

/** Assets of */
/** asset category master */
db.entityMaster.hasMany(db.asset_category_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.asset_category_master, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
/** asset subcategory master */
db.entityMaster.hasMany(db.asset_subcategory_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.asset_subcategory_master, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.asset_category_master.hasMany(db.asset_subcategory_master, {
  foreignKey: "asset_category_id",
  onDelete: "RESTRICT",
});
/** asset master */
db.entityMaster.hasMany(db.asset_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.asset_master, {
  foreignKey: "assigned_to",
  onDelete: "RESTRICT",
});
db.asset_category_master.hasMany(db.asset_master, {
  foreignKey: "asset_category_id",
  onDelete: "RESTRICT",
});
db.asset_subcategory_master.hasMany(db.asset_master, {
  foreignKey: "asset_subcategory_id",
  onDelete: "RESTRICT",
});
/** notice period master */
db.entityMaster.hasMany(db.notice_period_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.notice_period_master, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});

db.shift.hasMany(db.deduction_rules, {
  foreignKey: "shift_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.bioAttendance_timelist, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.shift.hasMany(db.bioAttendance_timelist, {
  foreignKey: "shift_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.bioAttendance_timelist, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.entityMaster.hasMany(db.deduction_rules, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.deduction_rules.hasMany(db.bioAttendance_timelist, {
  foreignKey: "deduction_rule_id",
  onDelete: "RESTRICT",
});

//// Webinar Foreign  Key

db.user.hasMany(db.WebinarSession, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.WebinarSession.belongsTo(db.user, { foreignKey: "created_by" });
db.entityMaster.hasMany(db.WebinarSession, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.WebinarSession.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
db.entityMaster.hasMany(db.ZoomMeeting, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ZoomMeeting.belongsTo(db.entityMaster, { foreignKey: "entity_id" });
// db.WebinarSession.hasMany(db.WebinarRegistration,{foreignKey:"session_id",onDelete:"RESTRICT"})
// db.WebinarSession.belongsTo(db.WebinarRegistration,{foreignKey:"session_id"})

/// kt master Foreign Key

db.entityMaster.hasMany(db.kt_master, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.kt_master.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

// kt assignment
db.kt_master.hasMany(db.ktassignment, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
});
db.ktassignment.belongsTo(db.kt_master, { foreignKey: "category_id" });

db.user.hasMany(db.ktassignment, {
  foreignKey: "created_by",
  onDelete: "RESTRICT",
});
db.ktassignment.belongsTo(db.user, { foreignKey: "created_by" });

db.user.hasMany(db.ktassignment, {
  foreignKey: "from_emp",
  onDelete: "RESTRICT",
});
db.ktassignment.belongsTo(db.user, { foreignKey: "from_emp" });

db.entityMaster.hasMany(db.ktassignment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.ktassignment.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.ktassignment.hasMany(db.ktassignmentemployee, {
  foreignKey: "assignment_id",
  onDelete: "RESTRICT",
});
db.ktassignmentemployee.belongsTo(db.ktassignment, {
  foreignKey: "assignment_id",
});

db.user.hasMany(db.ktassignmentemployee, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.ktassignmentemployee.belongsTo(db.user, { foreignKey: "employee_id" });
db.entityMaster.hasMany(db.kt_master, { foreignKey: "entity_id", onDelete: "RESTRICT" });
db.kt_master.belongsTo(db.entityMaster, { foreignKey: "entity_id", });

// kt assignment 
db.kt_master.hasMany(db.ktassignment, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
db.ktassignment.belongsTo(db.kt_master, { foreignKey: 'category_id', });

db.user.hasMany(db.ktassignment, { foreignKey: 'created_by', onDelete: 'RESTRICT' });
db.ktassignment.belongsTo(db.user, { foreignKey: 'created_by', });

db.user.hasMany(db.ktassignment, { foreignKey: 'from_emp', onDelete: 'RESTRICT' });
db.ktassignment.belongsTo(db.user, { foreignKey: 'from_emp', });

db.entityMaster.hasMany(db.ktassignment, { foreignKey: "entity_id", onDelete: "RESTRICT" });
db.ktassignment.belongsTo(db.entityMaster, { foreignKey: "entity_id", });

db.ktassignment.hasMany(db.ktassignmentemployee, { foreignKey: 'assignment_id', onDelete: 'RESTRICT' });
db.ktassignmentemployee.belongsTo(db.ktassignment, { foreignKey: 'assignment_id', });

db.user.hasMany(db.ktassignmentemployee, { foreignKey: 'employee_id', onDelete: 'RESTRICT' });
db.ktassignmentemployee.belongsTo(db.user, { foreignKey: 'employee_id', });

////Exit Form
db.entityMaster.hasMany(db.exit_form, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.exit_form.belongsTo(db.entityMaster, { foreignKey: "entity_id" });

db.user.hasMany(db.exit_form, {
  foreignKey: "employee_id",
  onDelete: "RESTRICT",
});
db.exit_form.belongsTo(db.user, { foreignKey: "employee_id" });

db.user.hasMany(db.exit_form, {
  foreignKey: "approver_id",
  onDelete: "RESTRICT",
});
db.exit_form.belongsTo(db.user, { foreignKey: "approver_id" });

db.employeeResignation.hasMany(db.exit_form, {
  foreignKey: "resignation_id",
  onDelete: "RESTRICT",
});
db.exit_form.belongsTo(db.employeeResignation, {
  foreignKey: "resignation_id",
});
db.business_unit_master.hasMany(db.department, { foreignKey: "bussiness_unit", onDelete: "RESTRICT" });
db.department.belongsTo(db.business_unit_master, { foreignKey: "bussiness_unit" });

db.tbl_branch.hasMany(db.department, { foreignKey: "location", onDelete: "RESTRICT" });
db.department.belongsTo(db.tbl_branch, { foreignKey: "location" })

db.user.hasMany(db.department, {
  foreignKey: "head_of_dept",
  onDelete: "RESTRICT",
});
db.department.belongsTo(db.user, { foreignKey: "head_of_dept" });

db.business_unit_master.hasMany(db.user,{foreignKey:"business_unit",onDelete:'RESTRICT'});
db.user.belongsTo(db.business_unit_master,{foreignKey:"business_unit"});
/** asset management */
/** asset allotment */
db.entityMaster.hasMany(db.asset_allotment, {
  foreignKey: "entity_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.asset_allotment, {
  foreignKey: "assigned_to",
  onDelete: "RESTRICT",
});
db.asset_master.hasMany(db.asset_allotment, {
  foreignKey: "asset_master_id",
  onDelete: "RESTRICT",
});
db.user.hasMany(db.asset_allotment, {
  foreignKey: "alloted_by",
  onDelete: "RESTRICT",
});

// cost center foreignKey

db.financial_year.hasMany(db.cost_center, { foreignKey: "financial_year_id", onDelete: 'RESTRICT' });
db.cost_center.belongsTo(db.financial_year, { foreignKey: "financial_year_id" });

db.department.hasMany(db.cost_center, { foreignKey: "department_id", onDelete: 'RESTRICT' });
db.cost_center.belongsTo(db.department, { foreignKey: "department_id", onDelete: 'RESTRICT' });

db.regionMaster.hasOne(db.cost_center, { foreignKey: "region_id", onDelete: "RESTRICT" });
db.cost_center.belongsTo(db.regionMaster, { foreignKey: "region_id", onDelete: "RESTRICT" });

db.entityMaster.hasMany(db.cost_center, { foreignKey: "entity_id", onDelete: "RESTRICT" });
db.cost_center.belongsTo(db.entityMaster, { foreignKey: "entity_id", onDelete: "RESTRICT" });

db.cost_center.hasMany(db.cost_center_map, { foreignKey: "cost_center_id", onDelete: 'RESTRICT' });
db.cost_center_map.belongsTo(db.cost_center, { foreignKey: "cost_center_id" });
// Project Management Models
db.project = require("../master/project_management/model/project.model.js")(sequelize, Sequelize);
db.projectMember = require("../master/project_management/model/project_member.model.js")(sequelize, Sequelize);
db.task = require("../master/project_management/model/task.model.js")(sequelize, Sequelize);
db.taskComment = require("../master/project_management/model/task_comment.model.js")(sequelize, Sequelize);
db.timesheetLog = require("../master/project_management/model/timesheet_log.model.js")(sequelize, Sequelize);
db.timesheetSubmission = require("../master/project_management/model/timesheet_submission.model.js")(sequelize, Sequelize);
db.timesheetActivity = require("../master/project_management/model/timesheet_activity.model.js")(sequelize, Sequelize);
db.projectMilestone = require("../master/project_management/model/project_milestone.model.js")(sequelize, Sequelize);
db.projectExpense = require("../Expenses/project_expense/model/project_expense.model.js")(sequelize, Sequelize);
db.projectExpenseHistory = require("../Expenses/project_expense/model/project_expense_history.model.js")(sequelize, Sequelize);

db.projectExpense.hasMany(db.projectExpenseHistory, { foreignKey: "expense_id", as: "history" });
db.projectExpenseHistory.belongsTo(db.projectExpense, { foreignKey: "expense_id" });
db.project.hasMany(db.projectExpense, { foreignKey: "project_id", as: "expenses" });
db.projectExpense.belongsTo(db.project, { foreignKey: "project_id", as: "project" });
db.projectCostTransaction = require("../master/project_management/model/project_cost_transaction.model.js")(sequelize, Sequelize);
db.project.hasMany(db.projectCostTransaction, { foreignKey: "project_id", as: "cost_transactions" });
db.projectCostTransaction.belongsTo(db.project, { foreignKey: "project_id", as: "project" });

module.exports = db;

