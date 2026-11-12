const express = require("express");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
var cron = require("node-cron");
// const {
//   attendanceMarkedData,
//   markdailyAttendance,
//   WFHattendanceData,
// } = require("./app/HRMS/Attendance_Calender/controller/att_calender_controller.js");



global.__basedir = __dirname;
dotenv.config();

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const bridgeSecret = String(process.env.BRIDGE_SECRET || "").trim();
if (bridgeSecret) {
  const expectedBridgeBuf = Buffer.from(bridgeSecret, "utf8");
  app.use((req, res, next) => {
    const provided = String(req.headers["x-bridge-secret"] || "");
    const providedBuf = Buffer.from(provided, "utf8");
    if (
      providedBuf.length !== expectedBridgeBuf.length ||
      !crypto.timingSafeEqual(providedBuf, expectedBridgeBuf)
    ) {
      return res.status(403).json({
        status: "failed",
        message: "Forbidden: Invalid bridge authentication",
      });
    }
    next();
  });
}

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOpts = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-domain",
    "x-access-token",
    "x-entity-id",
    "x-user-id",
    "session-id",
    "x-skip-loader",
    "x-idempotency-key",
  ],
  credentials: true,
};
app.use(cors(corsOpts));
app.options("*", cors(corsOpts));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));



////////////Daily attendance Scheduler///////////////
// cron.schedule(
//   "0 * * * *",
//   async () => {
//     try {
//       await markdailyAttendance(
//         { send: () => { } },
//         {
//           status: () => ({
//             send: () => { },
//           }),
//         }
//       );
//       console.log("Attendance marked successfully.");
//     } catch (error) {
//       console.error("Error marking attendance:", error.message);
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );


//////////////// Daily Bio Attendance Data Scheduler //////////////////

// ////////////Daily attendance Scheduler///////////////
// cron.schedule(
//   // "0 * * * *",
//   // "*/10 * * * *",
//    "* * * * *",   // 
//   async () => {
//     try {
//       await createBioAtt_workingList(       

//         { send: () => { } },
//         {
//           status: () => ({
//             send: () => { },
//           }),
//         }
//       );
//       console.log("Bio Attendance marked successfully.");
//     } catch (error) {
//       console.error("Error marking attendance:", error.message);
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );

/////////////// Database ///////////////

const db = require("./app/models");
const Role = db.role;

// Sync the model to the database (create the table)

// db.sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("Synced db success...");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db...", err.message);
//   });

const { initAttendanceVerificationDb } = require("./app/utils/dbInit");

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to direct database successfully.");
    initAttendanceVerificationDb();
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Kiran Automation HRMS Application!" });
});

app.get("/health", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "degraded", database: "disconnected" });
  }
});

/////////////// Images routes will be listed here ///////////////
app.use(
  "/digital_signature",
  express.static(path.join(__dirname, "digital_signature"))
);
app.use(
  "/uploaded_files",
  express.static(path.join(__dirname, "/uploaded_files"))
);
app.use("/leadfile", express.static(path.join(__dirname, "/leadfile")));
app.use(
  "/masterDocument",
  express.static(path.join(__dirname, "masterDocument"))
);

/////////////// Routes will be listed here ///////////////
require("./app/HRMS/whatsapp/whatsapp_attendance.js")(app);
require("./app/HRMS/Employee_Master/routes/user.routes")(app);
require("./app/master/checklist/router/checklist.router.js")(app);
require("./app/HRMS/Employee_Master/routes/auth.routes")(app);
require("./app/HRMS/Employee_Master/routes/employmenttype.routes")(app);
require("./app/HRMS/Employee_Master/routes/maritalStatus.routes.js")(app);
require("./app/HRMS/RBAC/Role/routes/role.routes")(app);
require("./app/ESS/Help_Desk/routes/helpdesk.routes")(app);
require("./app/ESS/Complaint/routes/complaint.routes")(app);
require("./app/master/Complain_Type/router/complain_typerouter.js")(app);
require("./app/ESS/Resignation/routes/employeeResignation.routes")(app);
require("./app/ESS/fnf/router/fnf.routes.js")(app);
require("./app/Payroll/NPS/craProviderRouter.js")(app);
require("./app/HRMS/RBAC/role_back/role_master/routes/roleMaster.routes.js")(
  app
);
require("./app/HRMS/RBAC/role_back/menu_master/routes/menuMaster.routes")(app);
require("./app/HRMS/RBAC/role_back/submenu_master/routes/submenuMaster.routes")(
  app
);
require("./app/HRMS/RBAC/role_back/role_module_master/routes/role_module_master.routes")(
  app
);
require("./app/HRMS/RBAC/role_back/role_menu_access/routes/roleMenuAccess.routes")(
  app
);
require("./app/HRMS/leave_encashment/router/leaveEncashment.js")(app);
require("./app/HRMS/Advance_Payment/router/advancePaymentRouter.js")(app);
require("./app/master/department/routes/department")(app);
require("./app/master/area/routes/areaRoute.js")(app);
require("./app/master/designation/routes/designation")(app);
require("./app/master/new_region/router/new_region.router")(app);
require("./app/master/new_spa/router/new_spa.router")(app);
require("./app/master/customer_type/router/customer_type.router")(app);
require("./app/master/traning_name/router/traning_name.router")(app);
require("./app/Entity_Master/router/entity_mst_router.js")(app);
require("./app/master/location_mapping/pincode/routers/pincode_router")(app);
require("./app/master/location_mapping/country/routes/country.routes")(app);
require("./app/master/location_mapping/states/routers/states_router")(app);
require("./app/master/location_mapping/city/routers/city_router")(app);
require("./app/master/segment/router/segment.router")(app);
require("./app/ESS/Leave/routes/leaveTypes.routes")(app);
require("./app/ESS/Leave/routes/leaveMaster.routes")(app);
require("./app/master/Leave_Master/Leave_Master/routes/leave_master.routes")(
  app
);
require("./app/master/Leave_Master/Attendance_Calendar/routes/attendance_calendar.routes")(
  app
);
require("./app/HRMS/Leave_Management/routes/routes.js")(app);
require("./app/master/Leave_Master/Holiday/routes/holiday.route.js")(app);
require("./app/ESS//Leave_Apply/routes/routes.js")(app);
require("./app/master/Currency_Convert/routers/router.js")(app);
require("./app/config_master/configmaster_router")(app);
require("./app/HRMS/Employee_Master/routes/emp_sign_router.js")(app);
require("./app/master/branch/routes/BranchRoutes.js")(app);
require("./app/master/UOM/router/uom.router.js")(app);
require("./app/master/product/router/productrouter.js")(app);
require("./app/master/location_mapping/states/routers/states_router.js")(app);
require("./app/master/Itemmaster/router/itemrouter.js")(app);
require("./app/master/servicecategory/router/servicesrouter.js")(app);
require("./app/master/servicemaster/router/servicemasterrouter.js")(app);
require("./app/master/Bank/routers/bankRouter.js")(app);
require("./app/master/Financial_Year/router/financialRouter.js")(app);
require("./app/master/area/routes/areaRoute.js")(app);
require("./app/master/area/routes/areaRoute.js")(app);
require("./app/master/Municipality/router/municipalityRouter.js")(app);
require("./app/master/Contract/Router/ContractRouter.js")(app);
require("./app/master/assetcategory/router/assetrouter.js")(app);
require("./app/master/reason/router/reasonRouter.js")(app);
require("./app/ESS/job_request/routes/jobRoutes.js")(app);
require("./app/ESS/workFlow/routes/workFolwRoutes.js")(app);
require("./app/master/Region/router/regionRoute.js")(app);
require("./app/master/Budget_Category/router/budget_Category_Route.js")(app);
require("./app/master/Expense_Type/router/expenseRoute.js")(app);
require("./app/master/Need_Type/router/needRoute.js")(app);
require('./app/Payroll/superannuation/router/superannuationRouter.js')(app);
require("./app/Documents/router/upload_doc_routes.js")(app);
require("./app/Payroll/compliance_financial_year/router/compliance_fyRouter.js")(app);
require("./app/master/Allowance/router/allowanceRouter.js")(app);
require("./app/Recruitment/Job_description/router/job_descripition.js")(app);
require("./app/master/seal_master/router/sealRoute.js")(app);
require("./app/Recruitment/Candidate_Profile/router/candidate_profile_routes.js")(
  app
);
require("./app/HRMS/Document_Management/routes/documentManagementRoutes.js")(
  app
);
require("./app/ESS/Ot_Request/router/otRequestRoute.js")(app);
///Hii//

require("./app/Recruitment/BGV/router/bgv_routes.js")(app);
require("./app/Recruitment/Candidate_onboarding/router/candidate_onboarding_routes.js")(
  app
);
// require("./app/Finance_And_Accounting/Cost_Center/router/cost_center_routes.js")(
//   app
// );
require("./app/master/grade/grade_routes.js")(app);
require("./app/master/division/division_routes.js")(app);
require("./app/master/Payroll/routes/employee_contribution.routes.js")(app);
require("./app/Entity_Master/router/company_master_router.js")(app);
require("./app/master/customer_review/router/customer_review.js")(app);
require("./app/master/Shift/router/shiftrouter.js")(app);
require("./app/HRMS/ot_master/routes/otRoute.js")(app)
require("./app/reports/all_reports_routes.js")(app);

//////////////////// copy form elan travel request

require("./app/ESS/Travel_Request/Routes/travel_Request_Router.js")(app);

///// Expense Request
require("./app/Expenses/travel_expense/routes/expense_request_routes.js")(app);
require("./app/Expenses/project_expense/routes/project_expense.routes.js")(app);


////////
// hrms annoucement
require("./app/HRMS/Announcement/router/announcementRouter.js")(app);

require('./app/Payroll/tax_calculation_master/router/taxCalculationRouter.js')(app);



/*************** travel module routes Start from here ***************/
// require("./app/Finance_And_Accounting/Travel_Advance_Booking/router/travel_booking_route.js")(
//   app
// );


// meetings
// require('./app/Webinar/routes/webinarSessionRouter.js')(app);
require('./app/zoomMeetings/router/zoomMeetingRouter.js')(app);

/*************** Payroll routes Start from here ***************/
require("./app/Payroll/EPF/routes/epf_routes.js")(app);
require("./app/Payroll/ESI/routes/esi_route.js")(app);
require("./app/Payroll/PT/routes/pt_routes.js")(app);
require("./app/Payroll/LWF/routes/lwf_routes.js")(app);
require("./app/Payroll/Statutory/routes/statutory_route.js")(app);
require("./app/Payroll/SalaryComponents/Earnings/routes/earning_route")(app);
require("./app/Payroll/SalaryComponents/variableEarning/routes/variable_earning_route.js")(app);
require("./app/Payroll/SalaryComponents/Reimbursement/routes/reimbursement_route.js")(
  app
);
require("./app/Payroll/SalaryComponents/Deduction/routes/deduction_route")(app);
require("./app/Payroll/SalaryTemplate/routes/salary_template_route.js")(app);
require("./app/Payroll/Salary_Process_Details/router/payroll_routes.js")(app);
require("./app/Payroll/TaxSlab/routes/tax_route.js")(app);
require("./app/Payroll/DeclarationForm/routes/declarationForm_route.js")(app);
require("./app/Payroll/appraisalDuration/routes/appraisalDuration_routes.js")(
  app
);
require("./app/Payroll/Variable_Earning_Allotment/routes/variable_earning_route.js")(app);
require("./app/Payroll/Arrear_Salary/routes/arrear_salary_route.js")(app);
require("./app/Payroll/Fine_Management/routes/fine_management_router.js")(app);

////////////////////////////// Dashboard Routes //////////////////////////////

require("./app/dashboard/routes/dashboard.routes.js")(app);

/** kpa and self rating */
require("./app/HRMS/KPA_Master/router/kpaRouter.js")(app);
require("./app/Performance_Assessment/routes/all_assessment_route.js")(app);
require("./app/Performance_Management/Yearly_Assessment_Setup/router/yearlyAssessmentRouter.js")(
  app
);
require("./app/ESS/Self_Assessment/router/self_AssessmentRouter.js")(app);
require("./app/Performance_Management/Team_Performance/router/team_performanceRouter.js")(
  app
);

/** Setup_Work_Calender and attendence*/
require("./app/HRMS/Setup_Work_Calender/routes/setUpWorkCalender.routes.js")(
  app
);
require("./app/HRMS/Attendance_Calender/routes/att_calender_route.js")(app);

/** notification */
require("./app/notification/hrms_notification/routes/hrms_notification_routes.js")(
  app
);

/** global minutes */
require("./app/master/global_minutes/routes/global_minutes_routes.js")(app);

/*** Performance Assessment */
require("./app/Performance_Assessment/routes/all_assessment_route.js")(app);

// ***Performance_Management
require("./app/Performance_Management/Yearly_Assessment_Setup/router/yearlyAssessmentRouter.js")(
  app
);
// ****lms route//

require("./app/LMS/cource-category/router/index.js")(app);
require("./app/LMS/course/router/course.js")(app);
//

// **Colleague_Review
require("./app/ESS/Colleague_Review/routes/colleague_review_route.js")(app);

require("./app/ESS/Help_Desk/routes/helpdesk.routes.js")(app);
require("./app/HRMS/Employee_Transfer/routes/employee.trasnfer.route.js")(app);
require("./app/HRMS/HRMS_Dashboard/router/dashboard.router.js")(app);
require("./app/HRMS/Shift_Allocation/router/shift_Allocation_router.js")(app);
require("./app/HRMS/Bulk_Data_Upload/router/bulkData.router.js")(app);

//Assign comp off
require("./app/HRMS/CompOFF/router/compoff.router.js")(app);

// Gratuity
require("./app/Payroll/Gratuity/router/gratuityRouter.js")(app);
// Reimbursement
require("./app/master/travel-master/routes/travel-type.routes.js")(app);
//Bonus
require("./app/master/bonus_master/router/bonusRouter.js")(app);
//Incentive
require("./app/Payroll/Incentive/routes/router.js")(app);

require("./app/ESS/Attendance_Request/routes/attendance_request.routes.js")(app);

//Compliances Inspection
// Health Inspection List
require("./app/Compliances/Health_Compliances/routes/health_inspection_router.js")(app);
// Safety Inspection List
require("./app/Compliances/Safety_Compliances/routes/safety_inspection_router.js")(app);
// Welfare Inspection List
require("./app/Compliances/Welfare_Compliances/routes/welfare_inspection_router.js")(app);

//Document Management System
require("./app/Document_Management_System/Doc_Management_System/routes/document_management_routes.js")(app);
// set port, listen for requests

require("./app/HRMS/Deduction_Rules/routes/deduction_rules.js")(app);
require("./app/HRMS/Attendance_total_time/routes/bioAttandance_time_routes.js")(app);

// KT Master
require("./app/master/kt_master/router/ktMasterRouter.js")(app);
require("./app/ESS/kt-assignment/router/ktassignmentRouter.js")(app);


/** business unit master */
require("./app/master/business_unit/business_unit_routes.js")(app);

/** Assets of */
/**  asset category master */
require("./app/master/Assets/asset_category/routes/asset_category_routes.js")(app);
/**  asset subcategory master */
require("./app/master/Assets/asset_subcategory/routes/asset_subcategory_routes.js")(app);
/**  asset master */
require("./app/master/Assets/asset_master/routes/asset_master_routes.js")(app);

/** notice period master */
require("./app/master/Notice_Period/notice_period_routes.js")(app);

// Exit Form
require("./app/ESS/ExitForm/exit-form-routes.js")(app);

/** Asset Management */
/** Asset Allotment */
require("./app/Asset Management/Asset_Allotment/routes/asset_allotment_routes.js")(app);

// Cost Center
require('./app/Finance_And_Accounting/Cost_Center/router/cost_center_routes.js')(app);

require('./app/Tds/authorization/routes/auth.routes.js')(app);
require('./app/Tds/deductor/routes/deductor.routes.js')(app);
require('./app/Tds/return/routes/return.routes.js')(app);

require('./app/Tds/routes/appraisalDuration_routes.js')(app);

// Project Management & Tasks
require('./app/master/project_management/routes/project.routes.js')(app);
require('./app/master/project_management/routes/timesheet.routes.js')(app);

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
app.listen(PORT, HOST, () => {
  console.log(` \u001b[1;32m Server is running on http://${HOST}:${PORT}.. \u001b[0m`);
});
