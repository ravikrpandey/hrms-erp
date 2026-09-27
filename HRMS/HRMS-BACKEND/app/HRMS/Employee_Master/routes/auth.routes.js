const { verifySignUp } = require("../../../middleware");
const { upload } = require("../../../middleware/uploadDocs");
const { digitalSignature } = require("../../../middleware/digitalSignature");
const authController = require("../controllers/auth.controller");
const AuthVerifyToken = require("../../../middleware/AuthVerifyToken");
const multerWrapper = (req, res, next) => {
  req.method = "POST"; // trick multer
  upload.single("file")(req, res, function (err) {
    req.method = "PUT"; // restore method
    next(err);
  });
};
module.exports = (app) => {
  app.post("/api/auth/signup/:employee_id?", authController.signup);
  app.post(
    "/api/auth/create_candidate",
    upload.single(""),
    authController.create_candidate
  );

  app.put(
    "/api/v1/me/update-basic-details",
    AuthVerifyToken,
    multerWrapper,
    authController.updateEmployeeBasicData
  );

  app.post("/api/auth/signin", authController.signin);
  app.post("/api/auth/sso-login", authController.ssoLogin);
  app.post("/api/auth/generate-sso-token", authController.generateSsoToken);
  app.post("/api/auth/generateEmpCode", authController.generate_Employee_Code);
  app.post("/api/auth/logout", authController.logout);
  app.post("/api/auth/forgetPassword", authController.forgetPassword);
  app.get("/api/auth/registrationall", authController.alluserlist);
  app.get("/api/auth/all_userby_entity", authController.alluserlist_byentity);
  app.get("/api/auth/allsalesPreson", authController.allsalesPreson);
  app.get("/api/auth/alll1approver", authController.alll1approver);
  app.get("/api/auth/alll2approver", authController.alll2approver);
  app.post(
    "/api/v1/create_digital_empsignature",
    digitalSignature.single("digital_signature"),
    authController.create_digitalEMPSignature
  );
  app.put(
    "/api/v1/edit_digital_empsignature/:id",
    digitalSignature.single("digital_signature"),
    authController.edit_digitalEMPSignature
  );
  app.get(
    "/api/v1/getAll_digitalempSignature",
    authController.getAll_digitalEMPSignature
  );
  app.get(
    "/api/v1/get_digitalSignature_details_by_id/:id",
    authController.get_digitalSignature_details_by_id
  );
  app.put(
    "/api/v1/delete_digital_signature/:id",
    authController.delete_digital_signature
  );
  app.put(
    "/api/v1/digital_signature_approval/:id",
    authController.digital_signature_approval
  );
  app.get(
    "/api/auth/form_submit_status/:id",
    authController.get_candidates_final_formsubmit
  );

  app.get("/api/auth/registrationallName", authController.alluserlistName);
  app.get(
    "/api/auth/get_All_Aduitorlistwithname",
    authController.get_All_Aduitorlistwithname
  );

  app.get(
    "/api/v1/get_all_unverifid_emp",
    authController.get_all_unapproved_emp
  );
  app.patch(
    "/api/v1/apprrove_pending_emp/:id",
    authController.approved_unapproved_emp
  );
  app.get("/api/v1/get_all_user_roles", authController.get_all_role);
  app.post(
    "/api/v1/sending_status_on_form_submit/:id",
    authController.send_form_status
  );
  app.get(
    "/api/auth/allListGlobalSalesManager",
    authController.allListGlobalSalesManager
  );
  app.get("/api/auth/allListAgent", authController.allListAgent);

  app.get(
    "/api/auth/allListRegionalBusinessHead",
    authController.allListRegionalBusinessHead
  );
  app.get("/api/auth/userbyid/:employee_id", authController.userById);
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
  app.get("/api/v1/getAll_Country_codes", authController.getAll_Country_codes);

  app.get(
    "/api/auth/getAllUserByManager/:id",
    authController.getAllUserByManager
  );

  app.post(
    "/api/v1/get_all_employeeBy_User_role/:role_masterId",
    authController.get_all_employeeBy_User_role
  );

  app.get(
    "/api/auth/getAllUserExportInExcel",
    authController.getAllDataShowInExcel
  );
  app.get(
    "/api/auth/getAutofetchBranchname/:id",
    authController.getAutofetchBranchName
  );

  app.post("/api/v1/changePassword", authController.changePassword);
  app.post("/api/v1/forgotSendOtp", authController.forgotSendOtp);
  app.post("/api/v1/forgotPassword", authController.forgotPassword);
  app.get("/api/v1/allRegisterUser", authController.getAllRegisteredUser);
  /////////////////////////
  app.post("/api/v1/forgot-password-link", authController.forgotPassLink);
  app.post("/api/v1/reset-password", authController.resetPassword);
  app.get("/api/v1/getAll_userRecords", authController.getAllUserData);
  app.get(
    "/api/v1/getProbationaryUserList",
    authController.getProbationaryUserList
  );

 app.post("/api/v1/patient/search-by-photo/:entity_id",upload.single("photo"),authController.searchPatientByPhoto);

  /////////////
  app.get("/api/v1/getAll_userRecords", authController.getAllUserData);
};
