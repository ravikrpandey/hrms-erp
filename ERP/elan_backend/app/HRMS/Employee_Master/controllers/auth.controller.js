const db = require("../../../models");
const { Sequelize, Op } = require("sequelize");
const config = require("../../../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const empFamilyDetails = db.empFamilyDetails;
const Role_menu = db.role_menu_access;
const CryptoJS = require("crypto-js");
const logger = require("../../../../logger/index");
const ExcelJS = require("exceljs");

const {
  checkAndRunMigrations,
} = require("../../../../helpers/checkAndRunMigrations");
const sequelize = require("../../../models").sequelize; // Adjust this path based on your project
const {
  sendChangePasswordMail,
  sendEmployeeSignupMail,
  sendOTPMail,
} = require("../../../Recruitment/utils/mail/mail");

/////////////// Signup ///////////////

exports.signup = async (req, res) => {
  try {
    let {
      title,
      employee_id,
      primary_entity_id,
      employee_code,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      emp_personal_email,
      employee_official_email,
      contact_number,
      country_code,
      reporting_manager_id,
      location_id,
      department_id,
      designation_id,
      emplyoment_type_id,
      role_master_id,
      employee_photo,
      entityList,
      tab_type,
      serverUrl, // use for mail
      holiday_category_id,
      shift_id,
      grade_id,
    } = req.body;

    location_id = location_id ? parseInt(location_id) : null;
    reporting_manager_id = reporting_manager_id
      ? parseInt(reporting_manager_id)
      : null;

    if (employee_official_email && !employee_id) {
      const newPassword = generateSecurePassword(); // visiable password
      let password = newPassword.toString(CryptoJS.enc.Utf8); // encrypt password

      const employee_save = await db.user.create({
        title,
        employee_code,
        primary_entity_id,
        first_name,
        middle_name,
        last_name,
        gender,
        date_of_birth,
        emp_personal_email,
        employee_official_email,
        contact_number,
        country_code,
        reporting_manager_id,
        location_id,
        department_id,
        designation_id,
        emplyoment_type_id,
        role_master_id,
        employee_photo,
        password: bcrypt.hashSync(password, 8),
        grade_id,
        shift_id,
        holiday_category_id,
      });

      const entity_list = await Promise.all(
        entityList.map(async (details) => {
          const { entity_id } = details;
          const entitys = await db.user_entity.create({
            entity_id,
            employee_id: employee_save.employee_id,
          });
          return entitys;
        }),
      );

      if (employee_save && entity_list) {
        sendEmployeeSignupMail(
          serverUrl,
          primary_entity_id,
          employee_official_email,
          title + " " + first_name,
          newPassword,
        );
        return res.status(200).send({
          code: 200,
          message: "Employee Registered Successfully!",
          user_id: employee_save.employee_id,
        });
      } else {
        return res
          .status(404)
          .send({ code: 404, message: "Unable To Registered" });
      }
    } else {
      if (employee_id && tab_type == "Basic") {
        const alreadyExists = await db.user.findOne({
          where: {
            [Sequelize.Op.or]: [
              { employee_official_email: employee_official_email },
              { contact_number: contact_number },
            ],
            employee_id: { [Sequelize.Op.ne]: employee_id },
          },
        });
        if (alreadyExists) {
          return res.status(403).send({
            code: 403,
            message: "Official Email or Contact Number Already Exist",
          });
        } else {
          var basic_details = await db.user.update(
            {
              title,
              employee_official_email,
              primary_entity_id,
              first_name,
              middle_name,
              last_name,
              gender,
              date_of_birth,
              emp_personal_email,
              contact_number,
              country_code,
              reporting_manager_id,
              location_id,
              department_id,
              designation_id,
              emplyoment_type_id,
              role_master_id,
              employee_photo,
              grade_id,
              shift_id,
              holiday_category_id,
            },
            { where: { employee_id: employee_id } },
          );
        }

        await db.user_entity.destroy({ where: { employee_id } });
        const entity_list = await Promise.all(
          entityList.map(async (details) => {
            const { entity_id, entity_name } = details;
            const entitys = await db.user_entity.create({
              entity_id,
              employee_id,
            });
            return entitys;
          }),
        );
        if (basic_details && entity_list) {
          return res.status(200).send({
            code: 200,
            message: "Basic Details Updated Successfully!",
            user_id: employee_id,
          });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      }

      return res.status(200).send({
        code: 200,
        message: "Basic Details Updated Successfully!",
        user_id: employee_id,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .json({ code: 500, message: error.message || "Server Error" });
  }
};

function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
}

// Find only active session of that user
async function activeSession(employeeId) {
  const activeSessions = await db.user_sessions.findAll({
    where: {
      user_id: employeeId,
      status: "ACTIVE",
    },
  });

  if (activeSessions && activeSessions.length > 0) {
    for (const session of activeSessions) {
      session.logout_time = new Date();
      session.session_duration =
        (new Date() - new Date(session.login_time)) / 1000;
      session.status = "ENDED";
      await session.save();
    }
  }
}

/////////////// Signin ///////////////
exports.signin = async (req, res) => {
  if (!global.migrationRan) {
    // await checkAndRunMigrations(sequelize);
    global.migrationRan = true;
  }
  const bytesEmail = CryptoJS.AES.decrypt(req.body.encryptedEmail, "email");
  const bytesPassword = CryptoJS.AES.decrypt(
    req.body.encryptedPassword,
    "password",
  );

  const loginId = bytesEmail.toString(CryptoJS.enc.Utf8).trim();
  const loginPassword = bytesPassword.toString(CryptoJS.enc.Utf8);

  if (loginId && loginPassword) {
    // contact number normalize (leading zero remove)
    const normalizedNumber = loginId?.replace(/^0+/, ""); // 079704 -> 79704

    await db.user
      .findOne({
        where: {
          status: "ACTIVE",
          isDeleted: 0,
          [Op.or]: [
            { employee_official_email: loginId },
            { employee_code: loginId },
            { contact_number: loginId },
            { contact_number: normalizedNumber },
          ],
        },
        include: [
          {
            model: db.THIRD_PARTY_ORGANIZATION,
            as: "organization",
            attributes: ["id", "name", "address", "isDeleted"],
          },
        ],
      })
      .then(async (user) => {
        // Check here
        if (!user) {
          return res.status(400).send({
            code: 400,
            message: "User not found or inactive",
          });
        }
        if (!user.password) {
          return res.status(400).send({
            code: 400,
            message: "Password is not correct format Contact to admin",
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          loginPassword,
          user.password,
        );

        if (!passwordIsValid) {
          return res.status(400).send({
            message: "Your Password is Incorrect",
          });
        }
        if (
          user.organization_id &&
          user.organization &&
          user.organization.isDeleted === true
        ) {
          return res.status(400).send({
            code: 400,
            message: "Your Organization is Inactive",
          });
        }

        // END all other active sessions
        await activeSession(user.employee_id);

        const ip = getClientIP(req);

        const session = await db.user_sessions.create({
          user_id: user.employee_id,
          login_time: new Date(),
          ip_address: ip,
          user_agent: req.headers["user-agent"],
          status: "ACTIVE",
        });

        // Create session token
        const generateToken = jwt.sign(
          { session_id: session.id, employee_id: user.employee_id },
          config.secret,
          { expiresIn: "10h" },
        );

        const entitydata = `SELECT ue.entity_id,em.entity_name,em.logo FROM HRMS_REGISTERED_USERS_ENTITY AS ue
        INNER JOIN ENTITY_MASTER AS em ON em.id=ue.entity_id
        WHERE ue.employee_id=${user.employee_id} AND ue.status="ACTIVE" AND em.status="ACTIVE" AND em.isDeleted=0`;
        const entityList = await db.sequelize.query(entitydata, {
          type: db.sequelize.QueryTypes.SELECT,
        });

        const financedata = `SELECT DISTINCT fy.id,fy.financial_year, H.entity_id
FROM ENTITY_MASTER AS E
INNER JOIN MASTER_FINANCIAL_YEAR AS fy
 INNER JOIN  HRMS_REGISTERED_USERS_ENTITY AS H ON H.entity_id=E.id
WHERE JSON_CONTAINS(E.financial_id, CAST(fy.id AS JSON), '$') 
AND fy.isDeleted=0 AND H.status="ACTIVE" AND H.employee_id=${user.employee_id}`;
        const financeList = await db.sequelize.query(financedata, {
          type: db.sequelize.QueryTypes.SELECT,
        });

        let [employeeDetail] = await db.sequelize.query(`
        SELECT U.*, D.department_name, R.role_master_name, R.role_code
        FROM HRMS_REGISTERED_USER AS U 
        INNER JOIN HRMS_RBAC_ROLE_MASTER AS R ON R.role_master_id = U.role_master_id
        LEFT JOIN MASTER_DEPARTMENT AS D 
        ON U.department_id = D.dept_id where U.employee_id=${user?.employee_id};`);

        // ==========================================================
        // 🚀 Single optimized query with LEFT JOINs
        // ==========================================================
        const [result] = await db.sequelize.query(
          `SELECT 
              EXISTS (
                SELECT 1 
                FROM HRMS_RBAC_MODULE_MASTER m
                LEFT JOIN HRMS_RBAC_ROLE_PERMISSION rp
                  ON rp.moduleId = m.id 
                  AND rp.roleId = :roleId
                  AND rp.entityId = :entityId
                LEFT JOIN HRMS_RBAC_USER_PERMISSION up
                  ON up.moduleId = m.id 
                  AND up.userId = :employeeId
                WHERE 
                  m.status = 1
                  AND (
                    rp.read = 1 OR rp.write = 1 OR rp.remove = 1 OR
                    up.read = 1 OR up.write = 1 OR up.remove = 1
                  )
              ) AS hasAccess;
            `,
          {
            replacements: {
              roleId: user?.role_master_id,
              employeeId: user?.employee_id,
              entityId: user?.primary_entity_id,
            },
            type: db.sequelize.QueryTypes.SELECT,
          },
        );

        const hasAccess = !!result?.hasAccess;
        const responseData = {
          employee_official_email: employeeDetail?.[0]?.employee_official_email,
          title: employeeDetail?.[0]?.title,
          employee_photo: employeeDetail?.[0]?.employee_photo,
          first_name: employeeDetail?.[0]?.first_name,
          last_name: employeeDetail?.[0]?.last_name,
          contact_number: employeeDetail?.[0]?.contact_number,
          type: user?.type,
          trail_days: user?.trail_days,
          createdAt: user?.createdAt,
          employee_id: employeeDetail?.[0]?.employee_id,
          roles: user.role_master_name,
          role_master_id: employeeDetail?.[0]?.role_master_id,
          role_name: employeeDetail?.[0]?.role_master_name,
          role_code: employeeDetail?.[0]?.role_code,
          accessToken: generateToken,
          primary_entity_id: user.primary_entity_id,
          department_id: employeeDetail?.[0]?.department_id,
          department_name: employeeDetail?.[0]?.department_name,
          employee_code: employeeDetail?.[0]?.employee_code,
          entityList: entityList,
          financeList: financeList,
          hasAccess,
          forceReset: user.forceReset,
          organization_id: user.organization_id,
          middle_name: user.middle_name,
          organization: user.organization,
        };
        return res.status(200).send(responseData);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ code: 500, message: err.message });
      });
  } else {
    return res
      .status(404)
      .send({ code: 404, message: "Your User Name or Password Incorrect " });
  }
};

exports.ssoLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).send({ code: 400, message: "SSO token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (err) {
      return res.status(401).send({ code: 401, message: "Invalid or expired SSO token" });
    }

    if (decoded.type !== "SSO_ERP" || !decoded.employee_id) {
      return res.status(400).send({ code: 400, message: "Invalid token payload for SSO" });
    }

    const user = await db.user.findOne({
      where: {
        employee_id: decoded.employee_id,
        status: "ACTIVE",
        isDeleted: 0,
      },
      include: [
        {
          model: db.THIRD_PARTY_ORGANIZATION,
          as: "organization",
          attributes: ["id", "name", "address", "isDeleted"],
        },
      ],
    });

    if (!user) {
      return res.status(404).send({ code: 404, message: "User not found or inactive" });
    }

    if (
      user.organization_id &&
      user.organization &&
      user.organization.isDeleted === true
    ) {
      return res.status(400).send({
        code: 400,
        message: "Your Organization is Inactive",
      });
    }

    // END all other active sessions
    await activeSession(user.employee_id);

    const ip = getClientIP(req);

    const session = await db.user_sessions.create({
      user_id: user.employee_id,
      login_time: new Date(),
      ip_address: ip,
      user_agent: req.headers["user-agent"],
      status: "ACTIVE",
    });

    // Create session token
    const generateToken = jwt.sign(
      { session_id: session.id, employee_id: user.employee_id },
      config.secret,
      { expiresIn: "10h" }
    );

    const entitydata = `SELECT ue.entity_id,em.entity_name,em.logo FROM HRMS_REGISTERED_USERS_ENTITY AS ue
    INNER JOIN ENTITY_MASTER AS em ON em.id=ue.entity_id
    WHERE ue.employee_id=${user.employee_id} AND ue.status="ACTIVE" AND em.status="ACTIVE" AND em.isDeleted=0`;
    const entityList = await db.sequelize.query(entitydata, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const financedata = `SELECT DISTINCT fy.id,fy.financial_year, H.entity_id
FROM ENTITY_MASTER AS E
INNER JOIN MASTER_FINANCIAL_YEAR AS fy
INNER JOIN HRMS_REGISTERED_USERS_ENTITY AS H ON H.entity_id=E.id
WHERE JSON_CONTAINS(E.financial_id, CAST(fy.id AS JSON), '$') 
AND fy.isDeleted=0 AND H.status="ACTIVE" AND H.employee_id=${user.employee_id}`;
    const financeList = await db.sequelize.query(financedata, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    let [employeeDetail] = await db.sequelize.query(`
    SELECT U.*, D.department_name, R.role_master_name, R.role_code
    FROM HRMS_REGISTERED_USER AS U 
    INNER JOIN HRMS_RBAC_ROLE_MASTER AS R ON R.role_master_id = U.role_master_id
    LEFT JOIN MASTER_DEPARTMENT AS D 
    ON U.department_id = D.dept_id where U.employee_id=${user?.employee_id};`);

    const [result] = await db.sequelize.query(
      `SELECT 
          EXISTS (
            SELECT 1 
            FROM HRMS_RBAC_MODULE_MASTER m
            LEFT JOIN HRMS_RBAC_ROLE_PERMISSION rp
              ON rp.moduleId = m.id 
              AND rp.roleId = :roleId
              AND rp.entityId = :entityId
            LEFT JOIN HRMS_RBAC_USER_PERMISSION up
              ON up.moduleId = m.id 
              AND up.userId = :employeeId
            WHERE 
              m.status = 1
              AND (
                rp.read = 1 OR rp.write = 1 OR rp.remove = 1 OR
                up.read = 1 OR up.write = 1 OR up.remove = 1
              )
          ) AS hasAccess;
        `,
      {
        replacements: {
          roleId: user?.role_master_id,
          employeeId: user?.employee_id,
          entityId: user?.primary_entity_id,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const hasAccess = !!result?.hasAccess;
    const responseData = {
      employee_official_email: employeeDetail?.[0]?.employee_official_email,
      title: employeeDetail?.[0]?.title,
      employee_photo: employeeDetail?.[0]?.employee_photo,
      first_name: employeeDetail?.[0]?.first_name,
      last_name: employeeDetail?.[0]?.last_name,
      contact_number: employeeDetail?.[0]?.contact_number,
      type: user?.type,
      trail_days: user?.trail_days,
      createdAt: user?.createdAt,
      employee_id: employeeDetail?.[0]?.employee_id,
      roles: user.role_master_name,
      role_master_id: employeeDetail?.[0]?.role_master_id,
      role_name: employeeDetail?.[0]?.role_master_name,
      role_code: employeeDetail?.[0]?.role_code,
      accessToken: generateToken,
      primary_entity_id: user.primary_entity_id,
      department_id: employeeDetail?.[0]?.department_id,
      department_name: employeeDetail?.[0]?.department_name,
      employee_code: employeeDetail?.[0]?.employee_code,
      entityList: entityList,
      financeList: financeList,
      hasAccess,
      forceReset: user.forceReset,
      organization_id: user.organization_id,
      middle_name: user.middle_name,
      organization: user.organization,
    };
    return res.status(200).send(responseData);
  } catch (err) {
    console.error("SSO Login Error:", err);
    return res.status(500).send({ code: 500, message: err.message });
  }
};

exports.generateSsoToken = async (req, res) => {
  try {
    const { employee_id, email } = req.body;
    if (!employee_id) {
      return res.status(400).send({
        success: false,
        message: "Employee ID is required to generate SSO token",
      });
    }

    const token = jwt.sign(
      {
        employee_id,
        email,
        type: "SSO_HRMS",
      },
      config.secret,
      { expiresIn: "60s" }
    );

    return res.status(200).send({
      success: true,
      ssoToken: token,
      message: "SSO Token generated successfully",
    });
  } catch (err) {
    console.error("Error generating SSO token:", err);
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  // END all other active sessions
  await activeSession(req.user.employee_id);
  const session = await db.user_sessions.findByPk(req.user.session_id);

  session.logout_time = new Date();
  session.session_duration = (new Date() - new Date(session.login_time)) / 1000;
  session.status = "ENDED";
  await session.save();

  res.json({ success: true });
};

// TIMEOUT LOGOUT API
exports.timeoutlogout = async (req, res) => {
  const sessionId = req.user.session_id;
  const session = await db.user_sessions.findByPk(sessionId);
  await db.user_sessions.update(
    {
      logout_time: new Date(),
      session_duration: (new Date() - new Date(session.login_time)) / 1000,
      timeout: 1,
      status: "ENDED",
    },
    { where: { id: sessionId } },
  );

  res.json({ success: true });
};

exports.checkSession = async (req, res) => {
  const session = await db.user_sessions.findByPk(req.user.session_id);

  if (!session || session.status !== "ACTIVE") {
    return res.json({ status: "ENDED" });
  }

  return res.json({ status: "ACTIVE" });
};

exports.Vendorsignin = async (req, res) => {
  const bytesEmail = req.body.encryptedEmail;
  const bytesPassword = CryptoJS.AES.decrypt(
    req.body.encryptedPassword,
    "password",
  );
  req.body.vendor_official_email = bytesEmail;
  req.body.password = bytesPassword.toString(CryptoJS.enc.Utf8);
  let vendor;
  if (req.body.vendor_official_email) {
    vendor = await db.vendor_basic_details
      .findOne({
        where: {
          vendor_email: req.body.encryptedEmail,
          status: "ACTIVE",
          isDeleted: 0,
        },
      })
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({
            message: "Your User Name is Incorrect ",
          });
        }
        // const bytesChangePassword = CryptoJS.AES.decrypt(user.password, 'password');
        // const loginPassword = bytesChangePassword.toString(CryptoJS.enc.Utf8);
        //const passwordIsValid = req.body.password == loginPassword;
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password,
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            message: "Your Password is Incorrect",
          });
        }

        var token = jwt.sign({ id: user.id }, config.secret);
        if (token) {
          user?.update({ token: token });
        }

        if (!user) {
          return res.status(404).send({
            code: 404,
            message: "Your User Name or Password Incorrect ",
          });
        }

        return res.status(200).send({
          accessToken: token,
          user,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ code: 500, message: err.message });
      });
  } else {
    return res
      .status(404)
      .send({ code: 404, message: "Your User Name or Password Incorrect " });
  }
};

exports.changepassword = async (req, res) => {
  try {
    let oldPassword = CryptoJS.AES.decrypt(req.body.oldPassword, "password");
    let newPassword = CryptoJS.AES.decrypt(req.body.newPassword, "password");
    const userData = req.user.dataValues || req.user.employee_id;
    let loginId = userData || userData.employee_id;
    let loginTypeUser = req.body.loginTypeUser; // Admin/Vendor
    let serverUrl = req.body.serverUrl; //'http://localhost:4200';
    let loginUrl =
      loginTypeUser === "Admin"
        ? serverUrl + "/auth/login"
        : serverUrl + "/auth/vendor-login";

    oldPassword = oldPassword.toString(CryptoJS.enc.Utf8);
    newPassword = newPassword.toString(CryptoJS.enc.Utf8);

    if (oldPassword && newPassword && loginId) {
      let nPassword = bcrypt.hashSync(newPassword, 8);
      db.user
        .findOne({ where: { employee_id: loginId } })
        .then(async (response) => {
          const passwordIsValidd = bcrypt.compareSync(
            oldPassword,
            response.password,
          );
          if (!passwordIsValidd) {
            return res
              .status(400)
              .send({ message: "Old password does not match!" });
          }

          // Prepare update object
          let updateData = {
            password: nPassword,
            updatedAt: new Date(),
          };

          // First-time reset → update forceReset = true
          if (!response.forceReset) {
            updateData.forceReset = true;
          }

          // Update user
          await db.user
            .update(updateData, {
              where: { employee_id: loginId },
            })
            .then(async (resp) => {
              sendChangePasswordMail(
                loginUrl,
                serverUrl,
                response.primary_entity_id,
                response.employee_official_email,
                response.title + " " + response.first_name,
                newPassword,
              );
              res.clearCookie("jwt");
              return res.status(200).send({
                message: "Your password has been changed successfully",
              });
            })
            .catch((err) => {
              return res.status(400).send({
                message:
                  "Unable to complete the request. Please try again later!",
              });
            });
        })
        .catch((err) => {
          return res
            .status(400)
            .send({ message: "Invalid Login ID. Please try again" });
        });
    } else {
      return res.status(400).send({ message: "All fields are required!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || "Server Error" });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const userId = req.body.userId;
    let loginTypeUser = req.body.loginTypeUser; // Admin/Vendor

    if (userId) {
      const generateOTP = Math.floor(100000 + Math.random() * 900000);
      if (loginTypeUser === "Admin") {
        // contact number normalize (leading zero remove)
        const normalizedNumber = userId?.replace(/^0+/, ""); // 079704 -> 79704

        await db.user
          .findOne({
            where: {
              status: "ACTIVE",
              isDeleted: 0,
              [Op.or]: [
                { employee_official_email: userId },
                { employee_code: userId },
                { contact_number: userId },
                { contact_number: normalizedNumber },
              ],
            },
          })
          .then(async (response) => {
            await db.user
              .update(
                { OTP: generateOTP, updatedAt: new Date() },
                { where: { employee_id: response.employee_id } },
              )
              .then(async (resp) => {
                sendOTPMail(
                  response.primary_entity_id,
                  response.employee_official_email,
                  response.title + " " + response.first_name,
                  generateOTP,
                );
                return res.status(200).send({
                  message:
                    "We’ve sent an OTP to your registered email. Please check your inbox and enter the OTP to continue.",
                });
              })
              .catch((err) => {
                return res.status(400).send({
                  message:
                    "Unable to complete the request. Please try again later!",
                });
              });
          })
          .catch((err) => {
            return res
              .status(400)
              .send({ message: "User ID not found. Please try again!" });
          });
      } else {
        // db.vendor_basic_details
        //   .findOne({
        //     where: { vendor_email: userEmail, status: "ACTIVE", isDeleted: 0 },
        //   })
      }
    } else {
      return res.status(404).send({ message: "Please enter User ID!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || "Server Error" });
  }
};

exports.forgotpassword = async (req, res) => {
  try {
    const userId = req.body.userId;
    let OTP = req.body.OTP;
    let newPassword = CryptoJS.AES.decrypt(req.body.newPassword, "password");
    let loginTypeUser = req.body.loginTypeUser; // Admin/Vendor
    let serverUrl = req.body.serverUrl; //'http://localhost:4200';
    let loginUrl =
      loginTypeUser === "Admin"
        ? serverUrl + "/auth/login"
        : serverUrl + "/auth/vendor-login";

    if (userId) {
      newPassword = newPassword.toString(CryptoJS.enc.Utf8);
      let nPassword = bcrypt.hashSync(newPassword, 8);
      if (loginTypeUser === "Admin") {
        // contact number normalize (leading zero remove)
        const normalizedNumber = userId?.replace(/^0+/, ""); // 079704 -> 79704

        await db.user
          .findOne({
            where: {
              status: "ACTIVE",
              isDeleted: 0,
              [Op.or]: [
                { employee_official_email: userId },
                { employee_code: userId },
                { contact_number: userId },
                { contact_number: normalizedNumber },
              ],
            },
          })
          .then(async (response) => {
            let DBOTP = response.OTP;
            let updatedAt = response.updatedAt;
            await OTPValidate(DBOTP, updatedAt);

            if (DBOTP.toString() === OTP.trim()) {
              await db.user
                .update(
                  { password: nPassword, OTP: null, updatedAt: new Date() },
                  { where: { employee_id: response.employee_id } },
                )
                .then(async (resp) => {
                  sendChangePasswordMail(
                    loginUrl,
                    serverUrl,
                    response.primary_entity_id,
                    response.employee_official_email,
                    response.title + " " + response.first_name,
                    newPassword,
                  );
                  return res.status(200).send({
                    message:
                      "Your password has been reset successfully. Please check your registered email for the new password.",
                  });
                })
                .catch((err) => {
                  return res.status(400).send({
                    message:
                      "Unable to complete the request. Please try again later!",
                  });
                });
            } else {
              return res.status(400).send({
                message:
                  "The OTP you entered is incorrect. Please check your email and try again.",
              });
            }
          })
          .catch((err) => {
            return res
              .status(404)
              .send({ message: "User ID not found. Please try again!" });
          });
      } else {
        db.vendor_basic_details
          .findOne({
            where: { vendor_email: userEmail, status: "ACTIVE", isDeleted: 0 },
          })
          .then(async (response) => {
            await db.vendor_basic_details
              .update(
                { password: newPassword, updatedAt: new Date() },
                { where: { id: response.id } },
              )
              .then(async (resp) => {
                sendChangePasswordMail(
                  loginUrl,
                  serverUrl,
                  response.entity_id,
                  userEmail,
                  response.vendor_name,
                  newPassword,
                );
                return res.status(200).send({
                  message:
                    "Your password has been reset successfully. Please check your registered email for the new password.",
                });
              })
              .catch((err) => {
                return res.status(400).send({
                  message:
                    "Unable to complete the request. Please try again later!",
                });
              });
          })
          .catch((err) => {
            return res
              .status(400)
              .send({ message: "Email not found. Please try again!" });
          });
      }
    } else {
      return res.status(400).send({ message: "Please enter User ID!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || "Server Error" });
  }
};

function generateSecurePassword() {
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%&";
  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;

  const minLength = 6;
  const maxLength = 12;
  const passwordLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let password = "";
  // Ensure each category is represented at least once
  password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
  password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill remaining with random chars
  for (let i = password.length; i < passwordLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle password
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

exports.getAll_Country_codes = async (req, res) => {
  try {
    const country_code_list = await db.country_codes.findAll({
      where: { status: "ACTIVE" },
      attributes: ["country_code", "dialing_code"],
    });
    if (country_code_list) {
      return res.status(200).send({
        code: 200,
        message: "Country Code List Selected Successfully",
        data: country_code_list,
      });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "Country Code Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

/////////////////Entity List By Employee_id///////////////
// exports.get_entity_list = async (req, res) => {
//   try {
//     const { employee_id } = req.query;
//     const entity_name_list = `SELECT ue.entity_id,em.entity_name FROM HRMS_REGISTERED_USERS_ENTITY AS ue
//     INNER JOIN ENTITY_MASTER AS em ON em.id=ue.entity_id
//     WHERE ue.employee_id=${employee_id} AND ue.status="ACTIVE" AND em.status="ACTIVE" AND em.isDeleted=0`;
//     const getAllentity = await db.sequelize.query(entity_name_list, {
//       type: db.sequelize.QueryTypes.SELECT,
//     });
//     if (getAllentity) {
//       return res.status(200).send({
//         code: 200,
//         message: "Entity List Selected Successfully",
//         Entity_List: getAllentity,
//       });
//     } else {
//       return res
//         .status(200)
//         .send({ code: 200, message: "Employee Not Exist in any Company" });
//     }
//   } catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     console.log(error);
//     return res
//       .status(500)
//       .send({ code: 500, message: "Internal Server Error" });
//   }
// };

exports.get_entity_list = async (req, res) => {
  try {
    const { employee_id } = req.query;
    if (!employee_id) {
      return res.status(400).send({
        code: 400,
        message: "Employee ID is required",
      });
    }

    const entity_name_list = `
      SELECT ue.entity_id, em.entity_name 
      FROM HRMS_REGISTERED_USERS_ENTITY AS ue
      INNER JOIN ENTITY_MASTER AS em ON em.id = ue.entity_id
      WHERE ue.employee_id = :employee_id
        AND ue.status = "ACTIVE"
        AND em.status = "ACTIVE"
        AND em.isDeleted = 0
    `;

    const getAllentity = await db.sequelize.query(entity_name_list, {
      replacements: { employee_id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllentity?.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Entity List Selected Successfully",
        Entity_List: getAllentity,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Employee Not Exist in any Company",
        Entity_List: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

///////////Generate Employee Code/////////////////
exports.generate_Employee_Code = async (req, res) => {
  try {
    const { title } = req.body;
    const emp_Variable = "ELAN";
    if (!title) {
      return res.status(400).send({
        code: 400,
        message: "Please select a title first",
        data: null,
      });
    }
    const lastEntry = await db.user.findOne({
      where: { status: "ACTIVE" },
      order: [["createdAt", "DESC"]],
      attributes: ["employee_code"],
    });
    let number = 1;
    if (lastEntry && lastEntry.employee_code) {
      const lastNumber = parseInt(lastEntry.employee_code.slice(-5), 10);
      if (!isNaN(lastNumber)) {
        number = lastNumber + 1;
      }
    }
    const code = String(number).padStart(5, "0");
    const employeeCode = `${emp_Variable}${code}`;
    return res.status(200).send({
      code: 200,
      message: "Employee code has been generated",
      data: employeeCode,
    });
  } catch (error) {
    logger.error(`Error generating employee code: ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

/////////////// All User List ///////////////

exports.alluserlist = async (req, res) => {
  try {
    const userDetails = `
      SELECT u.employee_official_email, u.employee_code,
       u.first_name, u.middle_name, u.last_name, u.contact_number, 
       u.employee_id, e.emptype_name, d.designation_name, r.role_master_name,u.country_code,u.emp_personal_email,u.status,
       u.department_id, CONCAT(RM.first_name, ' ', RM.last_name, ' - ', RM.employee_code) AS reporting_manager
      FROM HRMS_REGISTERED_USER AS u 
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
      LEFT JOIN HRMS_REGISTERED_USER AS RM ON RM.employee_id = u.reporting_manager_id
      WHERE u.isDeleted = 0 AND u.organization_id IS NULL
      ORDER BY u.first_name ASC;`;

    const [response] = await db.sequelize.query(userDetails);

    // 🔹 If data found
    if (response.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Success",
        data: response,
      });
    }
    // 🔹 If no data found
    else {
      return res.status(404).send({
        code: 404,
        message: "No data found",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/////////////// User ById ///////////////
exports.userById = async (req, res) => {
  try {
    const userId = parseInt(req.params.employee_id);
    if (isNaN(userId)) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid employee ID" });
    }
    const query = `
    SELECT u.*,d.department_name,b.branch_name,des.designation_name,et.emptype_name,
      GR.name AS grade_name,MHC.name AS holiday_category_name,
      CONCAT(u1.title, ' ', u1.first_name) AS reporting_manager,r.role_master_name
    FROM 
    HRMS_REGISTERED_USER AS u
    LEFT JOIN MASTER_TRAVEL_TYPE AS GR ON u.grade_id = GR.id
    LEFT JOIN MASTER_SHIFT AS MSH ON u.shift_id = MSH.id
    LEFT JOIN MASTER_HOLIDAY_CATEGORY AS MHC ON u.holiday_category_id = MHC.id
    LEFT JOIN MASTER_DEPARTMENT AS d ON u.department_id = d.dept_id
    LEFT JOIN MASTER_BRANCH AS b ON u.location_id = b.id
    LEFT JOIN DESIGNATION AS des ON u.designation_id = des.designation_id
    LEFT JOIN HRMS_EMPLOYMENT_TYPE AS et ON u.emplyoment_type_id = et.emptype_id
    LEFT JOIN HRMS_REGISTERED_USER AS u1 on u.reporting_manager_id=u1.employee_id
    LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r on u.role_master_id = r.role_master_id
    WHERE 
      u.employee_id = :userId AND 
      (u.status = 'Active' OR u.status = 'ONBOARDED')
  `;
    const userJsonData = await db.sequelize.query(query, {
      replacements: { userId },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (userJsonData.length === 0) {
      return res.status(404).send({ code: 404, message: "User Not Found" });
    }

    const userData = userJsonData[0];
    userData.location_ids = userData.location_ids
      ? userData.location_ids.split(",").map((id) => parseInt(id, 10))
      : [];

    userData.branch_names = userData.branch_names
      ? userData.branch_names.split(",")
      : [];

    function replaceNullValues(obj) {
      for (let key in obj) {
        if (obj[key] === null || obj[key] === "null" || obj[key] === "") {
          obj[key] = null;
        } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          replaceNullValues(obj[key]);
        }
      }
    }
    replaceNullValues(userData);

    const entityList = await db.user_entity.findAll({
      where: { employee_id: userId },
    });
    userData.entityList = entityList;

    const familyDetails = await db.user_family.findAll({
      where: { employee_id: userId },
    });
    userData.family_details = familyDetails;

    const prevEmployerDetails = await db.user_prev_employer.findAll({
      where: { employee_id: userId },
    });
    userData.prev_employer_details = prevEmployerDetails;

    const allowance_details = await db.user_allowance.findAll({
      where: { employee_id: userId },
    });
    userData.allowance_details = allowance_details;

    const historySalary = await db.user_salary.findAll({
      where: { employee_id: userId },
    });
    userData.history_salary = historySalary;

    const documentsDetail = await db.user_documents.findAll({
      where: { employee_id: userId },
    });
    userData.documents_detail = documentsDetail;
    userData.gradeSalaryData = await db.payroll_pay_salary.findAll({
      where: {
        employee_id: userId,
        g_pay: false,
        is_deleted: false,
        status: "Active",
      },
    });

    return res.status(200).send({
      code: 200,
      message: "Fetch All User Data Successfully!",
      data: userData,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.userById_businesUnit = async (req, res) => {
  try {
    const userId = parseInt(req.params.employee_id);
    let jsonData = await db.user.findOne({
      where: { employee_id: userId },
      attributes: {
        exclude: ["password"],
      },
    });

    function replaceNullValues(obj) {
      for (let key in obj) {
        if (obj[key] === null || obj[key] === "null") {
          obj[key] = "";
        } else if (typeof obj[key] === "object") {
          replaceNullValues(obj[key]);
        }
      }
    }

    replaceNullValues(jsonData);
    if (!jsonData) {
      return res.status(404).send({ code: 404, message: "User Not Found " });
    } else if (jsonData) {
      const family_Data = await empFamilyDetails.findAll({
        where: { employee_id: userId },
      });
      jsonData.dataValues.family_data = family_Data;
      return res.status(200).send({
        code: 200,
        message: "Fetch All User Data Successfully!",
        data: jsonData,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.emp_by_id = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const UserData = await db.user.findOne({
      where: { employee_id: userId },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!UserData) {
      return res.status(404).send({ code: 404, message: "User Not Found " });
    } else if (UserData) {
      ((UserData.dataValues.current_city =
        UserData.dataValues.current_address[0].city),
        (UserData.dataValues.current_states =
          UserData.dataValues.current_address[0].state),
        (UserData.dataValues.current_addres =
          UserData.dataValues.current_address[0].address),
        (UserData.dataValues.currentcountry =
          UserData.dataValues.current_address[0].country),
        (UserData.dataValues.current_pin_code =
          UserData.dataValues.current_address[0].pin_code),
        (UserData.dataValues.parmanent_city =
          UserData.dataValues.parmanent_address[0].p_city),
        (UserData.dataValues.parmanent_states =
          UserData.dataValues.parmanent_address[0].p_state),
        (UserData.dataValues.parmanent_addres =
          UserData.dataValues.parmanent_address[0].permanent_address),
        (UserData.dataValues.parmanentcountry =
          UserData.dataValues.parmanent_address[0].p_country),
        (UserData.dataValues.parmanent_pin_code =
          UserData.dataValues.parmanent_address[0].p_pin_code));
      return res.status(200).send({
        code: 200,
        message: "Fetch All User Data Successfully!",
        data: UserData,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.login_history = async (req, res) => {
  try {
    const { employeeId, selectedDate, type } = req.body;

    // Validation
    if (!employeeId || !selectedDate || !type) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields!",
      });
    }

    // 1 Get User Name
    let sqlQuery1 = `
      SELECT CONCAT(c.title, ' ', c.first_name, ' ', c.last_name, ' [', c.employee_code, ']') AS employee_name
      FROM HRMS_REGISTERED_USER AS c
      WHERE c.employee_id = :employeeId
    `;

    const [userName] = await db.sequelize.query(sqlQuery1, {
      replacements: { employeeId },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    let sessionData = [];
    let pageData = [];
    let sessionDataMonth = [];
    // 2 DAILY SESSION/PAGE DATA
    if (type === "Daily") {
      let sqlQueryDaily = `
        SELECT us.login_time, us.logout_time, us.session_duration 
        FROM USER_SESSIONS AS us 
        WHERE us.user_id = :employeeId 
        AND DATE(us.login_time) = :selectedDate order by us.login_time DESC
      `;

      sessionData = await db.sequelize.query(sqlQueryDaily, {
        replacements: { employeeId, selectedDate },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      let sqlQueryPage = `
        SELECT ual.page_url,ual.page_name,MAX(ual.total_time_seconds) AS total_time_seconds,ual.createdAt as time FROM USER_ACTIVITY_LOGS AS ual
        WHERE ual.user_id = :employeeId AND DATE(ual.createdAt) = :selectedDate GROUP BY 
    ual.user_id,ual.session_id,ual.page_url,ual.page_name,ual.createdAt
    order by ual.createdAt DESC`;

      pageData = await db.sequelize.query(sqlQueryPage, {
        replacements: { employeeId, selectedDate },
        type: db.Sequelize.QueryTypes.SELECT,
      });
    }

    // 3 MONTHLY SESSION/PAGE DATA
    if (type === "Month") {
      const [year, month] = selectedDate.split("-");
      const startDate = `${year}-${month}-01`;

      const monthlySummaryQuery = `
        SELECT 
            DATE(us.login_time) AS date,
            COUNT(us.id) AS totalSessions,
            SUM(us.session_duration) AS totalDuration,
            (
                SELECT COUNT(*)
                FROM USER_ACTIVITY_LOGS AS ual
                WHERE ual.user_id = ANY_VALUE(us.user_id)
                AND DATE(ual.createdAt) = DATE(ANY_VALUE(us.login_time))
            ) AS totalPages
        FROM USER_SESSIONS AS us
        WHERE us.user_id = :employeeId
        AND DATE(us.login_time) BETWEEN :startDate AND LAST_DAY(:startDate)
        GROUP BY DATE(us.login_time)
        ORDER BY DATE(us.login_time) DESC;
      `;

      sessionDataMonth = await db.sequelize.query(monthlySummaryQuery, {
        replacements: { employeeId, startDate },
        type: db.Sequelize.QueryTypes.SELECT,
      });

      for (let d of sessionDataMonth) {
        const daySessionsQuery = `
          SELECT us.login_time AS login, us.logout_time AS logout,
          us.session_duration AS duration
          FROM USER_SESSIONS AS us
          WHERE us.user_id = :employeeId
          AND DATE(us.login_time) = :passDate
          ORDER BY us.login_time DESC;
        `;

        const sessions = await db.sequelize.query(daySessionsQuery, {
          replacements: { employeeId, passDate: d.date },
          type: db.Sequelize.QueryTypes.SELECT,
        });

        const pagesQuery = `
          SELECT 
            ual.page_name AS page, ual.createdAt AS time
          FROM USER_ACTIVITY_LOGS AS ual
          WHERE ual.user_id = :employeeId
          AND DATE(ual.createdAt) = :passDate
          GROUP BY ual.user_id,ual.session_id,ual.page_url,ual.page_name,ual.createdAt
          ORDER BY ual.createdAt DESC;
        `;

        const pages = await db.sequelize.query(pagesQuery, {
          replacements: { employeeId, passDate: d.date },
          type: db.Sequelize.QueryTypes.SELECT,
        });

        d.sessions = sessions;
        d.pages = pages;
      }
    }

    // 4 FINAL RESPONSE
    return res.status(200).send({
      code: 200,
      message: "Fetch All User Data Successfully!",
      data: {
        userName,
        sessionData,
        pageData,
        sessionDataMonth,
      },
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/////////////// All User List By EmpId ///////////////

exports.alluserlistbyEmpid = async (req, res) => {
  try {
    const empId = parseInt(req.params.employee_id);
    const userData = await db.user.findAll({
      where: { status: "ACTIVE", employee_id: empId },
      attributes: {
        exclude: ["password"],
      },
    });
    if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All User List By EmployeeId Data Successfully!",
        data: userData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_all_role = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const user_data = await db.user.findOne({
      where: { employee_id: employee_id },
    });
    if (user_data) {
      let role_id = user_data.employee_id;
      const role_access_data = await Role_menu.findAll({
        where: { role_master_id: role_id },
      });
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched", data: role_access_data });
    } else {
      return res.status(404).send({ code: 404, message: "No Data Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.user_status_for_logout = async (req, res) => {
  try {
    let userId = req.params.id;
    const isExistUser = await db.user.findAll({
      where: { employee_id: userId, status: "ACTIVE" },
    });
    if (isExistUser) {
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched successfully" });
    }
    return res.status(404).send({ code: 404, message: "User Not Found." });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_all_employeeBy_User_role = async (req, res) => {
  const { role_masterId: role_Id } = req.params;
  const { entity_id } = req.query;

  if (!role_Id || !entity_id) {
    return res
      .status(400)
      .send({ code: 400, message: "Invalid input parameters" });
  }

  try {
    let sqlQuery = `
      SELECT DISTINCT u.*
      FROM HRMS_REGISTERED_USER u
      INNER JOIN HRMS_REGISTERED_USERS_ENTITY ru ON u.employee_id = ru.employee_id
      WHERE 
      
         u.status = 'ACTIVE' AND u.isDeleted=0
        AND u.employee_id IN (
          SELECT c.employee_id
          FROM HRMS_REGISTERED_USERS_ENTITY c
          WHERE c.entity_id = :entity_id
        )
    `;
    const replacements = {
      // role_Id: role_Id.split(',').map(Number),
      entity_id: Number(entity_id),
    };

    if (role_Id !== "ALL") {
      sqlQuery += ` AND u.role_master_id IN (:role_Id)`;
      replacements.role_Id = role_Id.split(",").map(Number);
    }

    sqlQuery += ` ORDER BY u.employee_id DESC`;

    const results = await db.sequelize.query(sqlQuery, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    const message =
      results.length > 0
        ? "Fetch data by Role Name Successfully"
        : "Record Not Found";

    const statusCode = results.length > 0 ? 200 : 403;
    return res
      .status(statusCode)
      .send({ code: statusCode, message, data: results });
  } catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllEmployeeByEntityId = async (req, res) => {
  const { entityId } = req.params;

  if (!entityId) {
    return res
      .status(400)
      .send({ code: 400, message: "Entity Id is required!" });
  }

  try {
    let sqlQuery = `
      SELECT DISTINCT u.employee_id, u.title, u.employee_code, u.first_name, u.middle_name, u.last_name, RM.role_master_name, RM.role_master_id
      FROM HRMS_REGISTERED_USER u
      INNER JOIN HRMS_REGISTERED_USERS_ENTITY ru ON u.employee_id = ru.employee_id
      INNER JOIN HRMS_RBAC_ROLE_MASTER RM ON u.role_master_id = RM.role_master_id
      WHERE 
         u.status = 'ACTIVE' AND u.isDeleted=0 AND u.organization_id IS NULL
        AND u.employee_id IN (
          SELECT c.employee_id
          FROM HRMS_REGISTERED_USERS_ENTITY c
          WHERE c.entity_id = :entity_id
        )
    `;
    const replacements = {
      entity_id: Number(entityId),
    };

    sqlQuery += ` ORDER BY u.employee_id DESC`;

    const results = await db.sequelize.query(sqlQuery, {
      replacements,
      type: db.sequelize.QueryTypes.SELECT,
    });

    const message =
      results.length > 0
        ? "Fetch data by Role Name Successfully"
        : "Record Not Found";

    const statusCode = results.length > 0 ? 200 : 403;
    return res
      .status(statusCode)
      .send({ code: statusCode, message, data: results });
  } catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_user_details_id = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await db.user.findAll({
      where: {
        employee_id: id,
      },
      attributes: [
        "employee_id",
        "first_name",
        "middle_name",
        "last_name",
        "employee_photo",
      ],
    });
    if (getData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Retrieved Successfully",
        data: getData,
      });
    } else {
      return res.status(200).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.downloadEmployeeData = async (req, res) => {
  try {
    const keyList = req.body;
    let queryKey = "";
    keyList?.map((item, i) => {
      if (
        item?.value == "location_id" ||
        item?.value == "department_id" ||
        item?.value == "area_id" ||
        item?.value == "designation_id" ||
        item?.value == "emplyoment_type_id" ||
        item?.value == "muncipalities" ||
        item?.value == "role_master_id"
      ) {
        if (item?.value == "location_id")
          queryKey = queryKey + `${i != 0 ? "," : null}B.branch_name`;
        else if (item?.value == "department_id")
          queryKey = queryKey + `${i != 0 ? "," : null}D.department_name`;
        else if (item?.value == "area_id")
          queryKey = queryKey + `${i != 0 ? "," : null}AR.area_name`;
        else if (item?.value == "designation_id")
          queryKey = queryKey + `${i != 0 ? "," : null}d.designation_name`;
        else if (item?.value == "emplyoment_type_id")
          queryKey = queryKey + `${i != 0 ? "," : null}e.emptype_name`;
        else if (item?.value == "municipality_id")
          queryKey = queryKey + `${i != 0 ? "," : null}M.name_of_municipality`;
        else if (item?.value == "role_master_id")
          queryKey = queryKey + `${i != 0 ? "," : null}r.role_master_name`;
        delete item.value;
      } else {
        if (i == 0) queryKey = "u." + queryKey + item?.value;
        else queryKey = queryKey + ",u." + item?.value;
      }
    });
    if (keyList) {
      const getData = await db.sequelize.query(
        `SELECT ${queryKey}
        FROM HRMS_REGISTERED_USER AS u 
        LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
       LEFT JOIN MASTER_BRANCH AS B ON B.id=u.location_id
       LEFT JOIN MASTER_DEPARTMENT AS D ON D.dept_id=u.department_id
       LEFT JOIN MASTER_AREA AS AR ON AR.id=u.area_id
       LEFT JOIN MASTER_MUNICIPALITY AS M ON M.id=u.municipality_id
      WHERE u.status = "Active"
      ORDER BY u.employee_id DESC;
      `,
      );
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: getData[0] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

///create emplpoyee by website

exports.createEmployee_by_website = async (req, res) => {
  try {
    const { name, email, contact_number, country_code, company_name } =
      req.body;
    if (!name || !email || !contact_number || !country_code || !company_name) {
      return res
        .status(403)
        .send({ code: 403, message: "All field required !" });
    } else {
      var chars =
        "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var passwordLength = 14;
      let password = "";
      for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }

      let nameData = await splitName(name);
      const entitySave = await db.entityMaster.create({
        entity_name: company_name,
        status: "ACTIVE",
      });

      const employee_save = await db.user.create({
        first_name: nameData?.firstName,
        middle_name: nameData?.middleName,
        last_name: nameData?.lastName,
        emp_personal_email: email,
        employee_official_email: email,
        contact_number: contact_number,
        country_code: country_code,
        role_master_id: 1,
        role_master_name: "Super Admin",
        password: bcrypt.hashSync(password, 8),
        primary_entity_id: entitySave?.id,
      });
      if (entitySave) {
        const entitys = await db.user_entity.create({
          entity_id: entitySave?.id,
          entity_name: entitySave?.entity_name,
          employee_id: employee_save.employee_id,
        });
      }
      const login_save = await db.user_login.create({
        first_name: nameData?.firstName,
        last_name: nameData?.lastName,
        employee_official_email: email,
        primary_entity_id: entitySave?.id,
        role_master_id: 1,
        role_master_name: "Super Admin",
        employee_id: employee_save.employee_id,
        password: bcrypt.hashSync(password, 8),
        type: "TRIAL",
        trail_days: 7,
      });
      if (entitySave && employee_save && login_save) {
        let data = await assignRole(employee_save);
        if (data.length > 0) {
          return res
            .status(200)
            .send({ code: 200, message: "successfully", data: data });
        }
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

function splitName(fullName) {
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  const middleName = nameParts.length > 2 ? nameParts[1] : "";
  const lastName = nameParts[nameParts.length - 1];

  return {
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
  };
}

async function assignRole(employee) {
  if (employee) {
    let MenuAccess = [];
    let roleModule = await db.role_module_master.findAll({
      where: {
        status: "ACTIVE",
      },
    });
    if (roleModule.length > 0) {
      for (let i = 0; i < roleModule.length; i++) {
        let rolesubModule = await db.menu_master.findAll({
          where: {
            role_module_master_id: roleModule[i]?.role_module_master_id,
          },
        });
        if (rolesubModule.length > 0) {
          for (let j = 0; j < rolesubModule.length; j++) {
            let submenuData = await db.submenu_master.findAll({
              where: {
                menu_master_id: rolesubModule[j]?.menu_master_id,
              },
            });
            if (submenuData.length > 0) {
              for (let s = 0; s < submenuData.length; s++) {
                let data = await db.role_menu_access.create({
                  role_master_id: employee?.role_master_id,
                  entity_id: employee?.primary_entity_id,
                  submenu_completed: 1,
                  status: "ACTIVE",
                  submenu_master_id: submenuData[s]?.submenu_master_id,
                  menu_completed: 1,
                  menu_master_id: rolesubModule[j]?.menu_master_id,
                  role_module_master_completed: 1,
                  role_module_master_id: roleModule[i]?.role_module_master_id,
                  employee_id: employee.employee_id,
                });
                MenuAccess.push(data);
              }
            }
            let data = await db.role_menu_access.create({
              role_master_id: employee?.role_master_id,
              entity_id: employee?.primary_entity_id,
              submenu_completed: 0,
              status: "ACTIVE",
              menu_completed: 1,
              menu_master_id: rolesubModule[j]?.menu_master_id,
              role_module_master_completed: 1,
              role_module_master_id: roleModule[i]?.role_module_master_id,
              employee_id: employee.employee_id,
            });
            MenuAccess.push(data);
          }
        }
      }
    }
    if (MenuAccess.length > 0) {
      return MenuAccess;
    }
  }
}

exports.updateUserStatusOrDelete = async (req, res) => {
  try {
    const { employee_id, type, status } = req.body;

    if (!employee_id || !type) {
      return res
        .status(400)
        .send({ code: 400, message: "employee_id and type are required" });
    }

    let query = "";

    if (type === "delete") {
      query = `
        UPDATE HRMS_REGISTERED_USER
        SET isDeleted = 1
        WHERE employee_id = ${employee_id};
      `;
    } else if (type === "status") {
      if (!status) {
        return res
          .status(400)
          .send({ code: 400, message: "status is required for type=status" });
      }
      query = `
        UPDATE HRMS_REGISTERED_USER
        SET status = '${status}'
        WHERE employee_id = ${employee_id};
      `;
    } else {
      return res.status(400).send({ code: 400, message: "Invalid type value" });
    }

    // 🔹 Run update query
    await db.sequelize.query(query);

    // 🔹 Get updated record
    const [response] = await db.sequelize.query(`
      SELECT employee_id, status, isDeleted
      FROM HRMS_REGISTERED_USER
      WHERE employee_id = ${employee_id};
    `);

    if (response.length > 0) {
      return res.status(200).send({
        code: 200,
        message:
          type === "delete"
            ? "Employee deleted successfully"
            : "Status updated successfully",
        data: response[0],
      });
    } else {
      return res.status(404).send({ code: 404, message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
};

exports.exportLoginHistoryForAllEmployees = async (req, res) => {
  try {
    const { startKey, endKey } = req.body;

    if (!startKey) {
      return res.status(400).send({
        code: 400,
        message: "Start date (startKey) is required",
      });
    }

    // STEP 1: Fetch all employees login sessions

    let whereClause = "";
    let replacements = { startKey };

    if (endKey) {
      whereClause = `US.login_time BETWEEN :startKey AND :endKey`;
      replacements.endKey = endKey;
    } else {
      // If only startKey is provided, fetch from that date onwards
      whereClause = `US.login_time >= :startKey`;
    }

    const loginData = await db.sequelize.query(
      `
  SELECT 
    CONCAT(U.title, ' ', U.first_name, ' ', U.last_name, ' ', U.employee_code) AS employee_name,
    US.session_duration,
    US.login_time,
    US.logout_time
  FROM USER_SESSIONS AS US
  INNER JOIN HRMS_REGISTERED_USER AS U 
    ON U.employee_id = US.user_id
  WHERE ${whereClause}
  ORDER BY US.login_time ASC
  `,
      {
        replacements,
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );

    if (!loginData.length) {
      return res.status(404).send({ message: "No loginData found" });
    }

    const getFormattedDateOrTime = (value, isDate = true) => {
      if (!value) return "-";

      const d = new Date(value);
      if (isNaN(d.getTime())) return "-";

      if (isDate) {
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };

    const workbook = new ExcelJS.Workbook();

    // LOOP ALL EMPLOYEES
    const sheet1 = workbook.addWorksheet("Login".substring(0, 30));
    sheet1.addRow([
      "Username",
      "Login Date",
      "Login Time",
      "Logout Date",
      "Logout Time",
      "Session Duration (In Minutes)",
    ]);
    for (let session of loginData) {
      sheet1.addRow([
        session.employee_name,
        getFormattedDateOrTime(session.login_time, true),
        getFormattedDateOrTime(session.login_time, false),
        getFormattedDateOrTime(session.logout_time, true),
        getFormattedDateOrTime(session.logout_time, false),
        (session.session_duration / 60).toFixed(2),
      ]);

      sheet1.eachRow((row) => {
        row.font = { size: 12 };
      });
    }

    let activityWhereClause = "";

    if (endKey) {
      activityWhereClause = `s.login_time BETWEEN :startKey AND :endKey`;
    } else {
      // If only startKey is provided, fetch from that date onwards
      activityWhereClause = `s.login_time >= :startKey`;
    }

    const activityData = await db.sequelize.query(
      `
  SELECT 
    CONCAT(U.title, ' ', U.first_name, ' ', U.last_name, ' ', U.employee_code) AS employee_name,
    US.total_time_seconds,
    US.page_name,
    US.page_url,
    US.createdAt
  FROM USER_ACTIVITY_LOGS AS US
  INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = US.user_id
  INNER JOIN USER_SESSIONS AS s ON s.id = US.session_id AND s.user_id = US.user_id
  WHERE ${activityWhereClause}
  ORDER BY US.createdAt ASC
  `,
      {
        replacements,
        type: db.Sequelize.QueryTypes.SELECT,
      },
    );
    const sheet2 = workbook.addWorksheet("ACTIVITY".substring(0, 30));
    sheet2.addRow([
      "Username",
      "Activity Date",
      "Activity Time",
      "Page Name",
      "Page URL",
    ]);

    for (let session of activityData) {
      sheet2.addRow([
        session.employee_name,
        getFormattedDateOrTime(session.createdAt, true),
        getFormattedDateOrTime(session.createdAt, false),
        session.page_name,
        session.page_url,
      ]);
      sheet2.eachRow((row) => {
        row.font = { size: 12 };
      });
    }

    // EXPORT FILE
    const fileName = `login_history_${startKey}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.log("Export error:", err);
    return res.status(500).send({ message: err.message });
  }
};

exports.createThirdPartyUser = async (userData) => {
  let {
    employee_id,
    primary_entity_id,
    first_name,
    last_name,
    middle_name,
    employee_official_email,
    contact_number,
    country_code,
    reporting_manager_id,
    role_master_id,
    organization_id,
    serverUrl,
  } = userData;
  if (employee_official_email && !employee_id) {
    const newPassword = generateSecurePassword(); // visiable password
    let password = newPassword.toString(CryptoJS.enc.Utf8); // encrypt password

    const employee_save = await db.user.create({
      primary_entity_id,
      first_name,
      last_name,
      middle_name,
      employee_official_email,
      contact_number,
      country_code,
      reporting_manager_id,
      role_master_id,
      password: bcrypt.hashSync(password, 8),
      organization_id,
    });

    const entity = await db.user_entity.create({
      entity_id: primary_entity_id,
      employee_id: employee_save.employee_id,
    });

    if (employee_save && entity) {
      sendEmployeeSignupMail(
        serverUrl,
        primary_entity_id,
        employee_official_email,
        first_name + " " + last_name,
        newPassword,
      );
      return employee_save;
    } else {
      return { error: "Error in creating user" };
    }
  } else if (employee_official_email && employee_id) {
    // Update existing user
    const existingUser = await db.user.findOne({
      where: { employee_id },
    });
    if (existingUser) {
      await existingUser.update({
        first_name,
        last_name,
        middle_name,
        employee_official_email,
        contact_number,
        reporting_manager_id,
        role_master_id,
      });
      return existingUser;
    } else {
      return { error: "User not found for update" };
    }
  }
};

exports.signupFromExcelData = async (data) => {
  try {
    let {
      title,
      employee_id,
      primary_entity_id,
      employee_code,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      emp_personal_email,
      employee_official_email,
      contact_number,
      country_code,
      reporting_manager_id,
      location_id,
      department_id,
      designation_id,
      emplyoment_type_id,
      role_master_id,
      employee_photo,
      entityList,
      tab_type,
      serverUrl, // use for mail
      holiday_category_id,
      shift_id,
      grade_id,
    } = data;

    location_id = location_id ? parseInt(location_id) : null;
    reporting_manager_id = reporting_manager_id
      ? parseInt(reporting_manager_id)
      : null;

    if (employee_official_email && !employee_id) {
      // const newPassword = generateSecurePassword(); // visiable password
      // let password = newPassword.toString(CryptoJS.enc.Utf8); // encrypt password

      const employee_save = await db.user.create({
        title,
        employee_code,
        primary_entity_id,
        first_name,
        middle_name,
        last_name,
        gender,
        date_of_birth,
        emp_personal_email,
        employee_official_email,
        contact_number,
        country_code,
        reporting_manager_id,
        location_id,
        department_id,
        designation_id,
        emplyoment_type_id,
        role_master_id,
        employee_photo,
        password: bcrypt.hashSync("Mindz@007", 8),
        grade_id,
        shift_id,
        holiday_category_id,
      });

      const entity = await db.user_entity.create({
        entity_id: primary_entity_id,
        employee_id: employee_save.employee_id,
      });

      if (employee_save && entity) {
        // sendEmployeeSignupMail(
        //   serverUrl,
        //   primary_entity_id,
        //   employee_official_email,
        //   title + " " + first_name,
        //   newPassword
        // );
        return {
          code: 200,
          message: "Employee Registered Successfully!",
          data: employee_save,
        };
      } else {
        return {
          code: 404,
          message: "Unable To Registered",
        };
      }
    }
  } catch (error) {
    console.log(error);
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.customerVendorSendOTP = async (req, res) => {
  try {
    const userId = req.body.userId;
    let loginTypeUser = req.body.loginTypeUser; // CUSTOMER/VENDOR

    if (userId && loginTypeUser) {
      const generateOTP = Math.floor(100000 + Math.random() * 900000);

      if (loginTypeUser === "VENDOR") {
        await db.vendor_basic_details
          .findOne({
            where: {
              status: "ACTIVE",
              isDeleted: 0,
              [Op.or]: [{ vendor_email: userId }],
            },
          })
          .then(async (response) => {
            await db.vendor_basic_details
              .update(
                { OTP: generateOTP, OTPupdatedAt: new Date() },
                { where: { id: response.id } },
              )
              .then(async (resp) => {
                sendOTPMail(
                  response.entity_id,
                  response.vendor_email,
                  response.vendor_name,
                  generateOTP,
                );
                return res.status(200).send({
                  message:
                    "We’ve sent an OTP to your registered email. Please check your inbox and enter the OTP to continue.",
                });
              })
              .catch((err) => {
                return res.status(400).send({
                  message:
                    "Unable to complete the request. Please try again later!",
                });
              });
          })
          .catch((err) => {
            return res
              .status(400)
              .send({ message: "Email ID not found. Please try again!" });
          });
      } else if (loginTypeUser === "CUSTOMER") {
        await db.customerAddressContact
          .findOne({
            where: {
              status: "ACTIVE",
              is_Deleted: 0,
              email_id: userId,
            },

            include: [
              {
                model: db.customerProfile,
                attributes: ["entity_id", "company_name"],
                required: true,
              },
            ],
          })
          .then(async (response) => {
            if (!response) {
              return res.status(400).send({
                message: "Email ID not found. Please try again!",
              });
            }

            await db.customerAddressContact.update(
              {
                OTP: generateOTP,
                OTPupdatedAt: new Date(),
              },
              {
                where: { id: response.id },
              },
            );

            sendOTPMail(
              response.CUSTOMER_PROFILE_MST.entity_id,
              response.email_id,
              response.CUSTOMER_PROFILE_MST.company_name,
              generateOTP,
            );

            return res.status(200).send({
              message:
                "We’ve sent an OTP to your registered email. Please check your inbox and enter the OTP to continue.",
            });
          })
          .catch((err) => {
            return res.status(400).send({
              message: "Unable to process the request. Please try again!",
            });
          });
      } else {
        return res
          .status(400)
          .send({ message: "Please enter correct Login Type!" });
      }
    } else {
      return res.status(404).send({ message: "Please enter Email ID!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || "Server Error" });
  }
};

exports.customerVendorLogin = async (req, res) => {
  try {
    const userId = req.body.userId;
    let OTP = req.body.OTP;
    let loginTypeUser = req.body.loginTypeUser; // CUSTOMER/VENDOR

    if (userId && loginTypeUser && OTP) {
      if (loginTypeUser === "VENDOR") {
        await db.vendor_basic_details
          .findOne({
            where: {
              status: "ACTIVE",
              isDeleted: 0,
              [Op.or]: [{ vendor_email: userId }],
            },
          })
          .then(async (response) => {
            let DBOTP = response.OTP;
            let updatedAt = response.OTPupdatedAt;
            await OTPValidate(DBOTP, updatedAt);

            if (DBOTP.toString() === OTP.trim()) {
              // token generate
              const generateToken = jwt.sign(
                { id: response.id },
                config.secret,
                { expiresIn: "1d" },
              );

              // clear OTP after successful login
              await db.vendor_basic_details.update(
                {
                  OTP: null,
                  OTPupdatedAt: null,
                },
                {
                  where: { id: response.id },
                },
              );

              return res.status(200).send({
                message: "Vendor login successfully",
                data: {
                  id: response.id,
                  token: generateToken,
                },
              });
            } else {
              return res.status(400).send({
                message:
                  "The OTP you entered is incorrect. Please check your email and try again.",
              });
            }
          })
          .catch((err) => {
            return res
              .status(404)
              .send({ message: "Email ID not found. Please try again!" });
          });
      } else if (loginTypeUser === "CUSTOMER") {
        await db.customerAddressContact
          .findOne({
            where: {
              status: "ACTIVE",
              is_Deleted: 0,
              [Op.or]: [{ email_id: userId }],
            },
          })
          .then(async (response) => {
            let DBOTP = response.OTP;
            let updatedAt = response.OTPupdatedAt;
            await OTPValidate(DBOTP, updatedAt);

            if (DBOTP.toString() === OTP.trim()) {
              // token generate
              const generateToken = jwt.sign(
                { id: response.customer_id },
                config.secret,
                { expiresIn: "1d" },
              );

              // clear OTP after successful login
              await db.customerAddressContact.update(
                {
                  OTP: null,
                  OTPupdatedAt: null,
                },
                {
                  where: { id: response.id },
                },
              );

              return res.status(200).send({
                message: "Customer login successfully",
                data: {
                  id: response.customer_id,
                  token: generateToken,
                },
              });
            } else {
              return res.status(400).send({
                message:
                  "The OTP you entered is incorrect. Please check your email and try again.",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(404)
              .send({ message: "Email ID not found. Please try again!" });
          });
      } else {
        return res
          .status(400)
          .send({ message: "Please enter correct Login Type!" });
      }
    } else {
      return res.status(400).send({ message: "Please enter Email ID!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || "Server Error" });
  }
};

async function OTPValidate(DBOTP, updatedAt) {
  //let updatedAt = "2025-12-11 07:25:16";
  const isOTPExpired = (updatedAt) => {
    const otpTime = new Date(updatedAt);
    const now = new Date();
    // difference in milliseconds
    const diffMs = now - otpTime;
    // convert to minutes
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes > 10; // TRUE = expired in minutes
  };

  if (isOTPExpired(updatedAt) || !DBOTP) {
    return res.status(400).send({
      message: "OTP has expired. Please request a new one.",
    });
  }
}
