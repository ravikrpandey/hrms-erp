const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");

// --------------------------------------
// EXCLUDED ROUTES (NO AUTH REQUIRED)
// --------------------------------------
const excludedRoutes = [
  "/ping",
  "/api/auth/signup",
  "/api/auth/signin",
  "/api/auth/sso-login",
  "/api/auth/generate-sso-token",
  "/api/auth/sendOTP",
  "/api/auth/customerVendorSendOTP",
  "/api/auth/customerVendorLogin",
  "/api/v1/getCustomerByIDForPanel",
  "/api/v1/getSOListForCustomer",
  "/api/v1/getCustomerContactAddress",
  "/api/v1/customerCreditDebit",
  "/api/v1/getCustomerDashboard",
  "/api/auth/forgotpassword",
  "/api/auth/Vendorsignin",
  "/api/auth/generateEmpCode",
  "/api/auth/get_employee_by_id",
  "/api/auth/user_status_for_logout",
  "/api/auth/alluserlistbyEmpid",
  "/api/WL/userbyid",
  "/api/WL/getAll_Country_codes",
  "/api/v1/get_all_user_roles",
  "/api/v1/get_entity_list",
  "/api/v1/get_user_details_id",
  "/api/v1/get_all_employeeBy_User_role",
  "/api/v1/downloadEmployeeData",
  "/api/v1/getAll_vendorMenu",
  "/api/v1/getAll_vendor_SubMenu",
  "/api/v1/createEmployee_by_website",
  "/api/v1/create_Attendance",
  "/api/v1/getVendor_replyData",
  "/api/v1/getAll_Currency",
  "/api/v1/update_vendorData/",
  "/api/v1/getVendrosDataById/",
  "/api/v1/get_All_Type_Of_Vendor",
  "/api/v1/proposalVersionMailData",
  "/api/v1/previewProposal",
  "/api/v1/download_qoutationProforma_pdf",
  "/api/v1/updateMailStatus",
  "/api/v1/getPlanningByTransporter",
  "/api/v1/getsShippingAlertHistory",
  "/api/v1/getVendorDashboard",
  "/api/v1/getPOListForVendor",
  "/api/v1/getAllRfpListForVendor",
  "/api/v1/getAllNegotiationListForVendor",
  "/api/v1/getAll_port",
  "/api/v1/transporterAcceptance",
  "/api/v1/getPoWithVendorDetails/",
  "/api/v1/createShippingAlert",
  "/api/v1/upload-documents",
  "/api/v1/uploadDoc",
  "/api/v1/getVoucherMainSeries",
  "/uploads/performa_invoices/",
  "/uploads/performa_invoices/**",
  "/uploads/quotation_invoices/",
  "/uploads/quotation_invoices/**",
  "/uploaded_files",
  "/app/CRM/utils/pdfs/",
  "/app/CRM/utils/pdfs/**",
  "/api/v1/get_by_vendorID", // Login/without login
  "/api/v1/updateVendorsBid",
  "/api/v1/updateShippingAlertStatus",
  "/api/v1/purchase-return-vendor",
  "/api/v1/purchase-return",
  "/send-pi-link",
  "/api/v1/customer-wise-sales-booking"
];

function isExcluded(req) {
  return excludedRoutes.some((route) => req.path.startsWith(route));
}

// =====================================
// MAIN MIDDLEWARE
// =====================================
const verifyAuthToken = async (req, res, next) => {
  try {
    // Allow excluded routes
    if (isExcluded(req)) return next();

    // -----------------------------------
    // CHECK TOKEN IN HEADER
    // -----------------------------------
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).send({
        status: "failed",
        message: "Unauthorized User, No Token",
        error: "Session Expired!"
      });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, config.secret, async (err, user) => {

      const decoded = jwt.decode(token);

      req.userId = decoded?.employee_id;
      req.session_id = decoded?.session_id;

      // -----------------------------------
      // CHECK ACTIVE SESSION
      // -----------------------------------
      const session = await db.user_sessions.findOne({
        where: {
          user_id: decoded?.employee_id,
          id: decoded?.session_id,
          status: "ACTIVE",
        },
      });

      // -----------------------------------
      // CHECK LOGIN FROM ANOTHER DEVICE
      // -----------------------------------

      // if (!session) {
      //   return res.status(420).send({code: 420, message: "Session expired due to login from another device", error: "Session Expired!" });
      // }

      // -----------------------------------
      // TOKEN EXPIRED
      // -----------------------------------
      if (err && err.name === "TokenExpiredError") {
        if (session) {
          await db.user_sessions.update(
            {
              logout_time: new Date(),
              session_duration:
                (new Date() - new Date(session.login_time)) / 1000,
              timeout: 1,
              status: "ENDED",
            },
            {
              where: {
                id: decoded?.session_id,
                user_id: decoded?.employee_id,
              },
            }
          );
        }
        return res.status(420).json({ code: 420, message: "Token expired", error: "Session Expired!" });
      }

      // INVALID TOKEN
      if (err) {
        return res.status(420).json({ code: 420, message: "Your session has expired. Please login again.", error: "Session Expired!" });
      }

      // -----------------------------------
      // AUTO LOGOUT AFTER INACTIVITY
      // -----------------------------------
      const lastActivity = await db.user_activity_logs.findOne({
        where: { session_id: decoded?.session_id },
        order: [["createdAt", "DESC"]],
      });

      if (lastActivity) {
        const now = new Date();
        const diffMinutes = (now - new Date(lastActivity.createdAt)) / (1000 * 60);
        const AUTO_LOGOUT_MIN = 180; // in minutes

        if (diffMinutes >= AUTO_LOGOUT_MIN) {
          if (session) {
            await db.user_sessions.update(
              {
                logout_time: now,
                session_duration:
                  (now - new Date(session.login_time)) / 1000,
                timeout: 1,
                status: "ENDED",
              },
              { where: { id: decoded?.session_id } }
            );
          }

          return res.status(420).json({ code: 420, message: "You have been inactive for a while.", error: "Session Expired!" });
        }
      }

      // -----------------------------------
      // GET USER DATA
      // -----------------------------------
      const usrData = await db.user.findByPk(decoded?.employee_id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.THIRD_PARTY_ORGANIZATION,
            as: "organization",
            attributes: ["id", "name", "address", "isDeleted"],
          },
        ],
      });

      if (!usrData) {
        return res.status(420).json({ message: "User not found", error: "Session Expired!" });
      }

      if (usrData.organization_id && usrData.organization && usrData.organization.isDeleted === true) {
        return res.status(420).send({
          code: 420,
          message: "Your Organization is Inactive",
          error: "Session Expired!"
        });
      }

      // find role name
      const roleData = await db.role_master.findOne({
        where: { role_master_id: usrData.role_master_id },
        attributes: ['role_master_name', 'role_code']
      });

      Object.assign(usrData.dataValues, {
        role_name: roleData?.role_master_name ?? null,
        role_code: roleData?.role_code ?? null
      });

      req.user = {
        ...usrData.dataValues,
        session_id: decoded.session_id,
      };

      next();
    });
  } catch (e) {
    console.error("Error in token middleware:", e);
    return res.status(500).send({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

module.exports = verifyAuthToken;
