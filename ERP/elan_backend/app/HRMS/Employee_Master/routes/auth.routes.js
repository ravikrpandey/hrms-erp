const { verifySignUp } = require("../../../middleware");
const { upload } = require("../../../middleware/uploadDocs");
const authController = require("../controllers/auth.controller");

module.exports = (app) => {
  app.post(
    "/api/auth/signup/:employee_id?",
    upload.single(""),
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    authController.signup
  );
  app.post("/api/auth/signin", authController.signin);
  app.post("/api/auth/sso-login", authController.ssoLogin);
  app.post("/api/auth/generate-sso-token", authController.generateSsoToken);
  app.post("/api/auth/Vendorsignin", authController.Vendorsignin);
  app.post("/api/auth/generateEmpCode", authController.generate_Employee_Code);
  app.post("/api/auth/logout", authController.logout);
  app.get("/api/auth/registrationall", authController.alluserlist);
  app.get("/api/v1/get_all_user_roles", authController.get_all_role);
  app.put("/api/auth/changepassword", authController.changepassword);
  app.put("/api/auth/sendOTP", authController.sendOTP);
  app.put("/api/auth/forgotpassword", authController.forgotpassword);
  app.get("/api/auth/logout", authController.logout);
  app.get("/api/auth/timeoutlogout", authController.timeoutlogout);
  app.get("/api/auth/checkSession", authController.checkSession);
  app.post("/api/auth/login_history", authController.login_history);
  app.get("/api/WL/userbyid/:employee_id", authController.userById);
  app.get("/api/auth/get_employee_by_id/:id", authController.emp_by_id);
  app.get(
    "/api/auth/user_status_for_logout/:id",
    authController.user_status_for_logout
  );
  app.get(
    "/api/auth/alluserlistbyEmpid/:employee_id",
    authController.alluserlistbyEmpid
  );
  app.get("/api/v1/get_entity_list", authController.get_entity_list);
  app.get("/api/WL/getAll_Country_codes", authController.getAll_Country_codes);
  app.get(
    "/api/v1/get_user_details_id/:id",
    authController.get_user_details_id
  );
  app.put(
    "/api/auth/updateUserStatusOrDelete",
    authController.updateUserStatusOrDelete
  );
  app.post(
    "/api/v1/get_all_employeeBy_User_role/:role_masterId",
    authController.get_all_employeeBy_User_role
  );
  app.get(
    "/api/v1/getAllEmployeeByEntityId/:entityId",
    authController.getAllEmployeeByEntityId
  );

  app.post("/api/v1/downloadEmployeeData", authController.downloadEmployeeData);

  //employee by website
  app.post(
    "/api/v1/createEmployee_by_website",
    authController.createEmployee_by_website
  );
  app.post("/api/export-login-history", authController.exportLoginHistoryForAllEmployees);
  app.put("/api/auth/customerVendorSendOTP", authController.customerVendorSendOTP);
  app.put("/api/auth/customerVendorLogin", authController.customerVendorLogin);
};
