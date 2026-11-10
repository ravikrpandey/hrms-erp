const db = require("../../../models");
const { Sequelize, Op, where } = require("sequelize");
const config = require("../../../config/auth.config");
const User = db.user;
const path = require("path");
const { getFaceDescriptor, findMatchingPatients } = require('../../../utils/faceMatch');
  const descriptorToJson = (descriptor) => JSON.stringify(Array.from(descriptor));
const user_location = db.user_location_model;
const transport = require("../../../master/services/nodemailer");
var jwt = require("jsonwebtoken");

const moment = require("moment-timezone");
const fs = require("fs");
const s3 = require("../../../config/s3config");
const { log } = require("console");
const baseUrl = (process.env.APP_PUBLIC_URL || "https://emerpapi.elitetraveltech.in").replace(/\/?$/, "/");
const empFamilyDetails = db.empFamilyDetails;
const users = db.user;
const Role_menu = db.role_menu_access;
const signatureDetails = db.digitalSignature;
const candidateProfileDetails = db.candidateProfile;
const CryptoJS = require("crypto-js");
const { query } = require("mssql");
const { SELECT } = require("sequelize/lib/query-types");
const {
  sendPassLink,
  sendpassChanged,
} = require("../../../Recruitment/utils/mail/mail");

/////////////// Signup ///////////////
exports.signup = async (req, res) => {
  
  try {
    let {
      title,
      employee_id,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      emp_personal_email,
      employee_official_email,
      contact_number,
      country_code,
      reporting_manager,
      reporting_manager_id,
      location_ids,
      department_id,
      designation_id,
      area_id,
      emplyoment_type_id,
      role_master_id,
      role_master_name,
      employee_photo,
      emp_join_date,
      emp_probation_date,
      present_country_id,
      present_state_id,
      present_city_id,
      permanent_country_id,
      permanent_state_id,
      permanent_city_id,
      personal_country_id,
      personal_state_id,
      personal_city_id,
      present_address,
      address_check_value,
      parmanent_address,
      DIRE_number,
      driving_license_number,
      blood_group,
      id_number,
      issued_date,
      labour_card_number_exp_date,
      visa_number_exp_date,
      eid,
      eid_exp_date,
      exp_date,
      tax_number,
      passport_number,
      marital_status,
      spouse_name,
      family_details,
      prev_employer_details,
      basic_salary,
      salary_per_day,
      salary_per_hr,
      total_monthly_hr,
      weekly_hour,
      history_salary,
      bank_id,
      employee_name_in_bank,
      bank_address,
      account_number,
      re_enter_account_no,
      nuit_number,
      bank_district_name,
      inss_number,
      documents_detail,
      contract_data,
      contract_types_id,
      start_working_date,
      end_date_probation,
      tab_type,
      pf_account_number,
      UAN_number,
      ESIC_number,
      official_contact_number,
      status,
      grade_id,
      division_id,
      employee_country_id,
      employee_state_id,
      employee_city_id,
      official_country_code,
      entityList,
      approval_manager_id,
      approval_manager,
      emp_pan_card,
      emp_adhar_card_number,
      emp_medical_condition,
      visa_number,
      emirates_id_number,
      labour_card_number,
      ifsc_code,
      swift_code,
      iban_number,
      epf_type,
      primary_entity_id,
      template_name,
      company,
      branch,
      currency_id,
      employer_contri_epf_amt,
      employer_contri_esi_amt,
      primary_branch_id,
      description,
      annualCTC,
      earningComponentList,
      deductionComponentList,
      reiembursementComponentList,
      variableearningComponentList,
      entity_id,
      financial_year_id,
      totalAnnualCTC,
      totalMonthlyCTC,
      created_by,
      grade_pay,
      grade_template_id,
      work_from_country,
      deduction_amt,
      monthly_ctc,
      payroll_template_id,
      tax_calculation,
      tax_slab_id,
      bank_document,
      alt_bank_id,
      attached_with_payroll,
      alt_account_holdname,
      alt_bank_address,
      alt_account_number,
      alt_re_enter_number,
      alt_IFSC_code,
      alt_bank_document,
      // isOverTimeApplicable,
      isHandiCap,
      // complaince_setting,
      epf,
      epf_capping,
      edli,
      esi,
      professional_tax,
      labour_welfare_fund,
      overtime,
      gratuity_employer,
      nps,
      saf,
      business_unit
    } = req.body;

    console.log(req.body, "dkfmglsdn")
    // const {
    //   epf,
    //   epf_capping,
    //   esi,
    //   professional_tax,
    //   labour_welfare_fund,
    //   gratuity_employer,
    // } = complaince_setting || {};

    if (emp_join_date) {
      function convertToIST(utcDateString) {
        return new Date(
          new Date(utcDateString).getTime() +
          5 * 60 * 60 * 1000 +
          30 * 60 * 1000
        )
          .toISOString()
          .slice(0, 10);
      }
      emp_join_date = convertToIST(emp_join_date);
    }


let faceDescriptor = null;
let processedPhotoPath = employee_photo || null;

// Case 1: Base64 image
if (employee_photo && employee_photo.startsWith('data:image')) {
  try {
    const photoBuffer = Buffer.from(employee_photo.split(',')[1], 'base64');
    const fileName = `employee_${Date.now()}.jpg`;
    const filePath = path.join(process.cwd(), 'uploaded_files/employees/', fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, photoBuffer);
    processedPhotoPath = `uploaded_files/employees/${fileName}`;

    const descriptor = await getFaceDescriptor(filePath);
    if (descriptor) {
      faceDescriptor = JSON.stringify(Array.from(descriptor));
      console.log('✅ Face descriptor from base64');
    }
  } catch (error) {
    console.error('❌ Base64 processing error:', error.message);
  }
}
// Case 2: File upload (multer)
else if (req.file) {
  try {
    const fullPath = req.file.path;
    processedPhotoPath = `uploaded_files/${req.file.filename}`;

    const descriptor = await getFaceDescriptor(fullPath);
    if (descriptor) {
      faceDescriptor = JSON.stringify(Array.from(descriptor));
      console.log('✅ Face descriptor from file upload');
    }
  } catch (faceErr) {
    console.warn('⚠️ Face extraction failed:', faceErr.message);
  }
}
// ✅ Case 3: Already uploaded path (Angular uploadDoc or pre-uploaded case)
else if (employee_photo && typeof employee_photo === 'string' && 
         !employee_photo.startsWith('data:image') && 
         employee_photo.includes('uploaded_files')) {
  try {
    const cleanPath = employee_photo.replace(/^.*uploaded_files\//, 'uploaded_files/');
    const fullPath = path.join(process.cwd(), cleanPath);
    processedPhotoPath = cleanPath;
    
    console.log('📸 Extracting face descriptor from existing path:', fullPath);
    
    if (fs.existsSync(fullPath)) {
      const descriptor = await getFaceDescriptor(fullPath);
      if (descriptor) {
        faceDescriptor = JSON.stringify(Array.from(descriptor));
        console.log('✅ Face descriptor from existing uploaded file');
      } else {
        console.log('⚠️ No face detected in existing file');
      }
    } else {
      console.warn('⚠️ File not found at path:', fullPath);
    }
  } catch (faceErr) {
    console.warn('⚠️ Face extraction failed:', faceErr.message);
  }
}

// Debug log
console.log('🔍 faceDescriptor:', faceDescriptor ? 'PRESENT ✅' : 'NULL ❌');
console.log('🔍 employee_photo received:', employee_photo);
console.log('🔍 processedPhotoPath:', processedPhotoPath);

    if (!employee_id) {
      let password = "123456789";
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        "password"
      ).toString();

      const emp_code = await db.user.findOne({
        where: { isDeleted: false, status: "ACTIVE" },
        order: [["employee_id", "DESC"]],
      });

      let fullDate = new Date(emp_join_date);
      let currentYear = fullDate.getFullYear().toString().slice(2, 4);
      let currentMonth = (fullDate.getMonth() + 1).toString().padStart(2, "0");
      let employeeCode = `${currentMonth}${currentYear}`;

      let serial_number = 1;
      if (emp_code && emp_code.employee_code) {
        const match = emp_code.employee_code.match(/(\d{4})(\d{4})$/);
        if (match) {
          serial_number = parseInt(match[2], 10) + 1;
        }
      }

      const generated_employee_code = `${employeeCode}${String(
        serial_number
      ).padStart(4, "0")}`;

      const existingEmployee = await User.findOne({
        where: {
          emp_personal_email: emp_personal_email?.trim(),
        },
      });

      if (existingEmployee) {
        return res.status(400).json({
          message: "Duplicate employee: email already exists.",
        });
      }
      const employee_save = await User.create({
        title,
        employee_code: generated_employee_code,
        first_name,
        middle_name,
        last_name,
        gender,
        date_of_birth,
        emp_personal_email,
        employee_official_email,
        contact_number,
        country_code,
        reporting_manager,
        reporting_manager_id,
        department_id,
        designation_id,
        area_id,
        emplyoment_type_id,
        role_master_id,
        role_master_name,
        employee_photo: processedPhotoPath, // 🔥 Updated photo path
        face_descriptor: faceDescriptor,
        pf_account_number,
        UAN_number,
        ESIC_number,
        official_contact_number,
        status,
        division_id,
        employee_city_id,
        employee_state_id,
        employee_country_id,
        emp_join_date,
        emp_probation_date,
        work_from_country,
        official_country_code,
        approval_manager_id,
        approval_manager,
        primary_entity_id,
        primary_branch_id,
        // isOverTimeApplicable,
        isHandiCap,
        grade_id,
        business_unit
      });

      // const employee_save = await User.create({
      //   title,
      //   employee_code: generated_employee_code,
      //   first_name,
      //   middle_name,
      //   last_name,
      //   gender,
      //   date_of_birth,
      //   emp_personal_email,
      //   employee_official_email,
      //   contact_number,
      //   country_code,
      //   reporting_manager,
      //   reporting_manager_id,
      //   department_id,
      //   designation_id,
      //   area_id,
      //   emplyoment_type_id,
      //   role_master_id,
      //   role_master_name,
      //   employee_photo,
      //   pf_account_number,
      //   UAN_number,
      //   ESIC_number,
      //   official_contact_number,
      //   status,
      //   division_id,
      //   employee_city_id,
      //   employee_state_id,
      //   employee_country_id,
      //   emp_join_date,
      //   emp_probation_date,
      //   work_from_country,
      //   official_country_code,
      //   approval_manager_id,
      //   approval_manager,
      //   primary_entity_id,
      //   primary_branch_id,
      // });
      const login_save = await db.user_login.create({
        first_name,
        last_name,
        employee_official_email,
        employee_code: generated_employee_code,
        primary_entity_id,
        role_master_id,
        role_master_name,
        employee_photo,
        employee_id: employee_save.employee_id,
        password: encryptedPassword,
      });
      await user_location.bulkCreate(
        location_ids.map((location_id) => ({
          employee_id: employee_save.employee_id,
          location_id,
        }))
      );

      await db.user_entity.destroy({
        where: { employee_id: employee_save.employee_id },
      });
      const entity_list = await Promise.all(
        entityList.map(async (details) => {
          const { entity_id, entity_name } = details;
          const entitys = await db.user_entity.create({
            entity_id,
            entity_name,
            employee_id: employee_save.employee_id,
          });
          return entitys;
        })
      );

      const [leaveAllot] = await db.sequelize.query(`
        SELECT DISTINCT 
        LM.total_available AS total_leaves, 
        LM.id AS leave_id,
        LM.entity_id, 
        LPE.from AS applicable_from,LPD.includeWeekendHoliday, LPD.isApplAftrProb, LPD.onceInServiceLeave,LPD.isQuotaAllotedMonthly
        FROM HRMS_LEAVE_MASTER AS LM
       INNER JOIN HRMS_LEAVE_POLICY_DETAIL AS LPD ON LM.id = LPD.leaveId AND LPD.isDeleted = false
       INNER JOIN HRMS_LEAVE_POLICY_ENTITLEMENT AS LPE ON LM.id = LPE.leaveId AND LPE.isDeleted = false
       INNER JOIN HRMS_LEAVE_POLICY_RESTRICTIONS AS LPR ON LM.id = LPR.leaveId AND LPR.isDeleted = false
       WHERE LM.entity_id = ${primary_entity_id} AND LM.isDeleted = false;
        `);
      if (leaveAllot.length) {
        const updatedLeaveAllot = leaveAllot.map((leave) => {
          if (
            leave.applicable_from === "DOJ" ||
            leave.applicable_from === "DOC"
          ) {
            return {
              ...leave,
              adjusted_leaves: Math.round(leave.total_leaves),
            };
          } else if (leave.applicable_from === "JAN-DEC") {
            if (leave.onceInServiceLeave) {
              return {
                ...leave,
                adjusted_leaves: Math.round(leave.total_leaves),
              };
            } else {
              const referenceDate = leave.isApplAftrProb
                ? new Date(emp_probation_date)
                : new Date(emp_join_date);
              const joinMonth = referenceDate.getMonth() + 1;
              let startMonth = joinMonth + 1;
              if (joinMonth === 12) {
                startMonth = 1;
              }

              const monthsPassed = 12 - startMonth + 1;
              const monthlyLeave = leave.total_leaves / 12;
              const proratedLeave = monthsPassed * monthlyLeave;

              return {
                ...leave,
                adjusted_leaves: Math.round(proratedLeave),
              };
            }
          } else {
            return {
              ...leave,
              adjusted_leaves: Math.round(leave.total_leaves),
            };
          }
        });

        console.log(updatedLeaveAllot, "adjusted leaves");
        if (updatedLeaveAllot && updatedLeaveAllot.length > 0) {
          const allotmentData = updatedLeaveAllot.map((leave) => {
            const policy = leaveAllot.find(
              (p) => p.leave_id === leave.leave_id
            );
            if (policy && policy.isQuotaAllotedMonthly == false) {
              return {
                no_of_days: leave.adjusted_leaves,
                available_days: leave.adjusted_leaves,
                leave_id: leave.leave_id,
                employee_id: employee_save.employee_id,
              };
            } else {
              return {
                no_of_days: leave.adjusted_leaves,
                leave_id: leave.leave_id,
                employee_id: employee_save.employee_id,
              };
            }
          });

          await db.hrmsLeaveAllotment.bulkCreate(allotmentData);
        }
      }

      if (employee_save && entity_list && login_save) {
        return res.status(200).send({
          code: 200,
          message: "Employee Registered Successfully!",
          user_id: employee_save.employee_id,
        });
      } else {
        return res
          .status(404)
          .send({ code: 404, message: "Unable To Register" });
      }
    } else {
      if (employee_id && tab_type == "Basic") {
        var basic_details = await User.update(
          {
            title,
            first_name,
            middle_name,
            last_name,
            gender,
            date_of_birth,
            emp_personal_email,
            employee_official_email,
            contact_number,
            country_code,
            reporting_manager,
            reporting_manager_id,
            department_id,
            designation_id,
            area_id,
            emplyoment_type_id,
            role_master_id,
            role_master_name,
            employee_photo: processedPhotoPath || undefined,
            face_descriptor: faceDescriptor || undefined,
            pf_account_number,
            UAN_number,
            ESIC_number,
            official_contact_number,
            status,
            division_id,
            employee_city_id,
            work_from_country,
            employee_state_id,
            employee_country_id,
            emp_join_date,
            emp_probation_date,
            official_country_code,
            approval_manager_id,
            approval_manager,
            primary_entity_id,
            primary_branch_id,
            // isOverTimeApplicable,
            isHandiCap,
            grade_id,
            business_unit
          },
          { where: { employee_id: employee_id } }
        );

        const login_save = await db.user_login.update(
          {
            first_name,
            last_name,
            employee_official_email,
            primary_entity_id,
            role_master_id,
            role_master_name,
            employee_photo,
          },
          { where: { employee_id: employee_id } }
        );

        await user_location.destroy({ where: { employee_id } });
        await user_location.bulkCreate(
          location_ids.map((location_id) => ({
            employee_id,
            location_id,
          }))
        );
        await db.user_login.update(
          {
            first_name,
            last_name,
            employee_official_email,
            primary_entity_id,
            role_master_id,
            role_master_name,
            employee_photo,
          },
          { where: { employee_id: employee_id } }
        );

        await db.user_entity.destroy({ where: { employee_id } });
        const entity_list = await Promise.all(
          entityList.map(async (details) => {
            const { entity_id, entity_name } = details;
            const entitys = await db.user_entity.create({
              entity_id,
              entity_name,
              employee_id,
            });
            return entitys;
          })
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
      } else if (employee_id && tab_type == "Personal") {
        var personal_details = await User.update(
          {
            present_country_id,
            present_state_id,
            present_city_id,
            permanent_country_id,
            permanent_state_id,
            labour_card_number_exp_date,
            visa_number_exp_date,
            eid,
            eid_exp_date,
            permanent_city_id,
            personal_country_id,
            personal_state_id,
            personal_city_id,
            present_address,
            address_check_value,
            parmanent_address,
            DIRE_number,
            driving_license_number,
            blood_group,
            id_number,
            issued_date,
            exp_date,
            tax_number,
            passport_number,
            marital_status,
            spouse_name,
            emp_pan_card,
            emp_adhar_card_number,
            emp_medical_condition,
            visa_number,
            emirates_id_number,
            labour_card_number,
            work_from_country,
          },
          { where: { employee_id: employee_id } }
        );
        if (family_details) {
          await db.user_family.destroy({ where: { employee_id } });
          await Promise.all(
            family_details.map(async (details) => {
              const {
                member_name,
                date_of_birth,
                relation,
                country_code,
                contact_number,
                remarks,
                emergency_contact,
              } = details;
              const family_detailss = await db.user_family.create({
                member_name,
                date_of_birth,
                relation,
                country_code,
                contact_number,
                remarks,
                emergency_contact,
                employee_id,
              });
              return family_detailss;
            })
          );
        }

        if (prev_employer_details) {
          await db.user_prev_employer.destroy({ where: { employee_id } });
          await Promise.all(
            prev_employer_details.map(async (details) => {
              const {
                company_name,
                from_date,
                to_date,
                last_salary,
                reason_of_leaving,
                location,
                position,
              } = details;
              const prev_emp = await db.user_prev_employer.create({
                company_name,
                from_date,
                to_date,
                last_salary,
                reason_of_leaving,
                location,
                employee_id,
                position,
              });
              return prev_emp;
            })
          );
        }

        if (personal_details) {
          return res.status(200).send({
            code: 200,
            message: "Personal Details Updated Successfully!",
            user_id: employee_id,
          });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      } else if (employee_id && tab_type == "Salary") {
        let isExistpaytemp = await db.payroll_pay_salary.findOne({
          where: { employee_id: employee_id, g_pay: false },
        });
        if (isExistpaytemp) {
          if (isExistpaytemp.payroll_template_id != payroll_template_id) {
            await db.payroll_pay_salary.update(
              { g_pay: true },
              { where: { employee_id: employee_id } }
            );
          }
        }

        let isExist = await db.complaince_setting.findOne({
          where: { employee_id, entity_id },
        });

        let complaince;
        if (isExist) {
          complaince = await db.complaince_setting.update(
            {
              epf,
              epf_capping,
              edli,
              esi,
              professional_tax,
              labour_welfare_fund,
              overtime,
              gratuity_employer,
              nps,
              saf
            },
            { where: { employee_id, entity_id } }
          );
        } else {
          complaince = await db.complaince_setting.create({
            epf,
            epf_capping,
            edli,
            esi,
            professional_tax,
            labour_welfare_fund,
            overtime,
            gratuity_employer,
            nps,
            saf,
            employee_id,
            entity_id,
          });
        }

        console.log(complaince, "kkk");

        var salary = await User.update(
          {
            basic_salary,
            salary_per_day,
            salary_per_hr,
            total_monthly_hr,
            weekly_hour,
            epf_type,
            pf_account_number,
            UAN_number,
          },
          { where: { employee_id } }
        );

        await db.user_salary.destroy({ where: { employee_id } });
        const salary_history = await Promise.all(
          history_salary.map(async (details) => {
            const {
              salary_Year,
              salary_month,
              new_salary,
              old_salary,
              percent_increment,
              remarks,
              from_designation_id,
              to_designation_id,
            } = details;
            const salaryy = await db.user_salary.create({
              salary_Year,
              salary_month,
              new_salary,
              old_salary,
              percent_increment,
              remarks,
              employee_id,
              from_designation_id,
              to_designation_id,
            });
            return salaryy;
          })
        );

        if (grade_pay === true) {
          let templatePayload = {
            payroll_template_id: payroll_template_id,
            template_name: template_name,
            description: description,
            tax_slab_id: tax_slab_id,
            tax_calculation: tax_calculation,
            ctc: annualCTC,
            employer_contri_epf_amt,
            employer_contri_esi_amt,
            entity_id: entity_id,
            financial_year_id: financial_year_id,
            total_annual_gross: totalAnnualCTC,
            total_monthly_gross: totalMonthlyCTC,
            deduction_amt: deduction_amt,
            monthly_ctc: monthly_ctc,
            employee_id: employee_id,
            created_by: created_by,
            currency_id: currency_id,
            earningComponentList,
            deductionComponentList,
            reiembursementComponentList,
            variableearningComponentList
          };
          const insertedData = await db.payroll_pay_salary.create(
            templatePayload
          );
        } else {
          let templatePayload = {
            payroll_template_id: payroll_template_id,
            template_name: template_name,
            description: description,
            tax_calculation,
            tax_slab_id,
            employer_contri_epf_amt,
            employer_contri_esi_amt,
            ctc: annualCTC,
            total_annual_gross: totalAnnualCTC,
            total_monthly_gross: totalMonthlyCTC,
            deduction_amt: deduction_amt,
            monthly_ctc: monthly_ctc,
            earningComponentList,
            deductionComponentList,
            reiembursementComponentList,
            variableearningComponentList,
            financial_year_id: financial_year_id,
            currency_id: currency_id,
          };
          const updateData = await db.payroll_pay_salary.update(
            templatePayload,
            { where: { id: grade_template_id, employee_id: employee_id } }
          );
        }

        if (salary && salary_history) {
          return res.status(200).send({
            code: 200,
            message: "Salary Details Updated Successfully!",
            user_id: employee_id,
          });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      } else if (employee_id && tab_type == "Payment") {
        var bank_details = await User.update(
          {
            bank_id: bank_id || null,
            employee_name_in_bank,
            bank_address,
            account_number,
            re_enter_account_no,
            nuit_number,
            bank_district_name,
            inss_number,
            ifsc_code,
            swift_code,
            iban_number,
            alt_bank_id,
            bank_document,
            attached_with_payroll,
            alt_account_holdname,
            alt_bank_address,
            alt_account_number,
            alt_re_enter_number,
            alt_IFSC_code,
            alt_bank_document,
          },
          { where: { employee_id } }
        );

        if (bank_details) {
          return res.status(200).send({
            code: 200,
            message: "Payment Details Updated Successfully!",
            user_id: employee_id,
          });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      } else if (employee_id && tab_type == "Document") {
        await db.user_documents.destroy({ where: { employee_id } });
        const documents_details = await Promise.all(
          documents_detail.map(async (details) => {
            const { document_name, document_description, documents } = details;
            const doc_details = await db.user_documents.create({
              document_name,
              document_description,
              documents,
              employee_id,
            });
            return doc_details;
          })
        );

        if (documents_details) {
          return res.status(200).send({
            code: 200,
            message: "Document Details Updated Successfully!",
            user_id: employee_id,
          });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: "Unable To Update" });
        }
      } else if (employee_id && tab_type == "Contract") {
        if (contract_data.length > 0) {
          await db.user_contract.destroy({ where: { employee_id } });
          const contract_data_all = await Promise.all(
            contract_data.map(async (data) => {
              const {
                contract_types,
                start_working_date,
                end_date_probation,
                contract_types_id,
              } = data;
              const contract_detail = await db.user_contract.create({
                contract_types,
                start_working_date,
                end_date_probation,
                contract_types_id,
                employee_id,
              });
              return contract_detail;
            })
          );
          if (contract_data_all.length > 0) {
            return res.status(200).send({
              code: 200,
              message: "Contract Details Updated Successfully!",
              user_id: employee_id,
            });
          } else {
            return res
              .status(404)
              .send({ code: 404, message: "Unable To Update" });
          }
        }
      }
      return res
        .status(200)
        .send({ code: 200, message: "Employee Details Updated Successfully!" });
    }
  } catch (error) {
    res.status(500).send({ code: 500, message: "Error: " + error.message });
  }
};

/////////////// Signin ///////////////
exports.signin = async (req, res) => {
  try {
    console.log(req.body, "req.body");
    const bytesEmail = CryptoJS.AES.decrypt(req.body.encryptedEmail, "email");
    const bytesPassword = CryptoJS.AES.decrypt(
      req.body.encryptedPassword,
      "password"
    );

    req.body.employee_official_email = bytesEmail.toString(CryptoJS.enc.Utf8);
    req.body.password = bytesPassword.toString(CryptoJS.enc.Utf8);

    if (req.body.employee_official_email && req.body.password) {
      db.user_login
        .findOne({
          where: {
            status: "ACTIVE",
            [Op.or]: [
              { employee_code: req.body.employee_official_email },
              { employee_official_email: req.body.employee_official_email },
            ],
          },
        })
        .then(async (user) => {
          if (!user) {
            return res
              .status(404)
              .send({ message: "Your User Name or Password Incorrect " });
          }

          const bytesUserPassword = CryptoJS.AES.decrypt(
            user.password,
            "password"
          );
          const userDecryptPassword = bytesUserPassword.toString(
            CryptoJS.enc.Utf8
          );

          if (req?.body?.password != userDecryptPassword) {
            return res.status(401).send({
              message: "Your User Name or Password Incorrect",
            });
          }

          const token = jwt.sign({ id: user.employee_id }, config.secret, {
            expiresIn: config.expiresIn,
          });

          const entitydata = `SELECT ue.entity_id,em.entity_name,em.logo,em.company_branch FROM HRMS_REGISTERED_USERS_ENTITY AS ue
        INNER JOIN ENTITY_MASTER AS em ON em.id=ue.entity_id
        INNER JOIN MASTER_BRANCH AS mb ON mb.id = em.branch_id
        INNER JOIN COMPANY_DETAILS_MASTER AS cdm ON cdm.id = em.company_id
        WHERE ue.employee_id=${user.employee_id} AND ue.status="ACTIVE" AND em.status="ACTIVE" AND em.isDeleted=0`;
          const entityList = await db.sequelize.query(entitydata, {
            type: db.sequelize.QueryTypes.SELECT,
          });

          var employeeDetail = await User.findOne({
            where: { employee_id: user.employee_id },
          });

          const roleMenuAccessId = parseInt(user.employee_id);
          const role_master_id = parseInt(user.role_master_id);
          const entity_id = parseInt(user.primary_entity_id);

          const getData = await db.sequelize.query(
            `SELECT rma.role_module_master_id,
        rma.role_module_master_completed,
        rma.menu_master_id, 
        rma.submenu_master_id, 
        rma.menu_completed, 
        rma.submenu_completed,
        rma.role_master_id,  
        rma.employee_id, 
        rmm.role_module_master_id,
        rmm.role_module_master_name,
        rmm.module_master_link,
        rmm.module_master_icon,
        rmm.module_master_endIcon,
        sm.submenu_master_id,
        mm.menu_master_id,
        mm.menu_master_name,
        mm.menu_title,
        mm.menu_masters_icon,
        mm.menu_master_link,
        mm.menu_master_lastIcon,
        sm.submenu_masters_link,
        sm.submenu_masters_icon,
        sm.submenu_master_name
        FROM HRMS_RBAC_ROLE_MODULE_MASTER rmm
        LEFT JOIN HRMS_RBAC_MENU_MASTER mm ON rmm.role_module_master_id = mm.role_module_master_id
        LEFT JOIN HRMS_RBAC_SUBMENU_MASTER sm ON mm.menu_master_id=sm.menu_master_id
        LEFT JOIN HRMS_RBAC_ROLE_MENU_ACCESS rma ON (rma.role_module_master_id = rmm.role_module_master_id OR rma.role_module_master_id IS NULL) AND 
        (rma.menu_master_id = mm.menu_master_id OR rma.menu_master_id IS NULL) AND 
        (rma.submenu_master_id = sm.submenu_master_id OR rma.submenu_master_id IS NULL) 
        AND rma.employee_id = ${roleMenuAccessId} AND rma.role_master_id = ${role_master_id} AND rma.entity_id = ${entity_id};`,
            {
              type: db.sequelize.QueryTypes.SELECT,
            }
          );

          if (!getData) {
            return res.status(403).send({
              code: 403,
              message: "Your User Name or Password Incorrect ",
            });
          }

          let uniqueData = getData.map((item) => item.menu_master_id);
          uniqueData = [...new Set(uniqueData)];

          let uniqueDataInf = getData.map(
            (index) => index.role_module_master_id
          );
          uniqueDataInf = [...new Set(uniqueDataInf)];

          const maindata = [];
          const Data = [];

          uniqueData.forEach((element) => {
            let data = getData.filter((obj) => obj.menu_master_id == element);
            for (let i of data) {
              i.role_module_master_completed =
                i.role_module_master_completed == 1;
              i.menu_completed = i.menu_completed == 1;
              i.submenu_completed = i.submenu_completed == 1;
            }

            let object = {
              role_menu_access_id: data[0].role_menu_access_id,
              employee_id: data[0].employee_id,
              role_module_master_id: data[0].role_module_master_id,
              role_module_master_name: data[0].role_module_master_name,
              role_module_master_completed:
                data[0].role_module_master_completed,
              menu_master_id: data[0].menu_master_id,
              menu_master_name: data[0].menu_master_name,
              menu_title: data[0].menu_title,
              menu_masters_icon: data[0].menu_masters_icon,
              menu_master_link: data[0].menu_master_link,
              menu_master_lastIcon: data[0].menu_master_lastIcon,
              menu_completed: data[0].menu_completed,
              status: data[0].status,
              HRMS_RBAC_SUBMENU_MASTER: data,
            };
            Data.push(object);
          });

          uniqueDataInf.forEach((index) => {
            let data2 = Data.filter(
              (obj) => obj.role_module_master_id == index
            );

            let parentObj = {
              role_module_master_id: data2[0].role_module_master_id,
              role_module_master_name: data2[0].role_module_master_name,
              role_module_master_completed:
                data2[0].role_module_master_completed,
              menu_masters_icon: data2[0].menu_masters_icon,
              menu_master_link: data2[0].menu_master_link,
              menu_master_lastIcon: data2[0].menu_master_lastIcon,
              HRMS_RBAC_MENU_MASTER: data2,
            };
            maindata.push(parentObj);
          });

          let filterSuperModules = maindata.filter(
            (e) => e.role_module_master_completed === true
          );
          for (let i = 0; i < filterSuperModules.length; i++) {
            let subSuperModule = filterSuperModules[i].HRMS_RBAC_MENU_MASTER;
            let filterSubSuperModule = subSuperModule.filter(
              (e) => e.menu_completed === true
            );
            var subSuperModulelength = filterSuperModules.length;
            subSuperModule.length = 0;
            subSuperModule.push(...filterSubSuperModule);

            for (let j = 0; j < subSuperModule.length; j++) {
              let subModule = subSuperModule[j].HRMS_RBAC_SUBMENU_MASTER;
              let filterSubModule = subModule.filter(
                (e) => e.submenu_completed === true
              );
              subModule.length = 0;
              subModule.push(...filterSubModule);
            }
          }

          return res.status(200).send({
            employee_official_email: user.employee_official_email,
            employee_photo: user.employee_photo,
            first_name: user.first_name,
            last_name: user.last_name,
            employee_id: user.employee_id,
            roles: user.role_master_name,
            role_master_id: user.role_master_id,
            designation_id: employeeDetail.designation_id,
            department_id: employeeDetail.department_id,
            accessToken: token,
            role_menu_access_data: filterSuperModules,
            subSuperModulelength: subSuperModulelength,
            primary_entity_id: user.primary_entity_id,
            entityList: entityList,
            primary_branch_id: employeeDetail.primary_branch_id,
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
  } catch (err) {
    console.log(err);
    return res.status(500).send({ code: 500, message: err.message });
  }
};
exports.create_digitalEMPSignature = async (req, res) => {
  try {
    const { employee_id, employee_name, department_id, baseUrl } = req.body;
    if (!req.file) {
      return res.status(400).send({
        code: 400,
        message: "Digital signature file is not uploaded!",
      });
    }
    const digital_signature = req.file.path;
    const file_name = path.basename(digital_signature);
    const existing = await signatureDetails.findOne({
      where: { employee_id: employee_id, isDeleted: false },
    });
    if (existing) {
      return res.status(400).send({
        code: 400,
        message: "Digital signature already exists for this employee!",
      });
    }
    const response = await signatureDetails.create({
      employee_id,
      employee_name,
      department_id,
      digital_signature: baseUrl + digital_signature,
    });

    return res.status(200).send({
      code: 200,
      message: "Digital signature created successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.edit_digitalEMPSignature = async (req, res) => {
  try {
    const signatureId = req.params.id;
    const { baseUrl, status, remark } = req.body;

    if (!req.file) {
      return res.status(400).send({
        code: 400,
        message: "Digital signature file is not uploaded!",
      });
    }

    const rawPath = req.file.path;
    const normalizedPath = rawPath.replace(/\\/g, "/");

    const editData = await signatureDetails.findOne({
      where: { digital_signature_id: signatureId },
    });

    if (!editData) {
      return res.status(400).send({ code: 400, message: "Record not found!" });
    }

    const updatePayload = {
      digital_signature: baseUrl + normalizedPath,
    };

    if (status) {
      updatePayload.status = status;
      updatePayload.remark = remark;
    }

    const updateData = await signatureDetails.update(updatePayload, {
      where: { digital_signature_id: signatureId },
    });

    return res.status(200).send({
      code: 200,
      message: status
        ? "Digital signature resubmitted successfully!"
        : "Digital signature updated successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getAll_digitalEMPSignature = async (req, res) => {
  try {
    const getAllData = await signatureDetails.findAll({
      where: { isDeleted: false },
    });

    const mergedData = [];

    for (const signature of getAllData) {
      const employee = await db.user.findOne({
        where: { employee_id: signature.employee_id },
      });
      const department = await db.department.findOne({
        where: { dept_id: employee.department_id },
      });

      mergedData.push({
        ...signature.toJSON(),
        employee,
        department,
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Fetched all Digital Signature Data Successfully",
      data: mergedData,
    });
  } catch (error) {
    console.log("Error in getAll_digitalEMPSignature:", error);
    return res.status(500).send({
      code: 500,
      message: "Server Error",
    });
  }
};

exports.get_digitalSignature_details_by_id = async (req, res) => {
  try {
    const signatureId = req.params.id;
    const getData = await signatureDetails.findAll({
      where: { digital_signature_id: signatureId },
    });

    if (getData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Digital Signature Details Retrieved Successfully",
        data: getData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 404, message: "No Signature Record Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.delete_digital_signature = async (req, res) => {
  try {
    const signatureId = req.params.id;
    const getData = await signatureDetails.findOne({
      where: { digital_signature_id: signatureId },
    });
    if (getData) {
      const deleteData = await signatureDetails.update(
        { isDeleted: true },
        { where: { digital_signature_id: signatureId } }
      );
      return res.status(200).send({
        code: 200,
        message: "Digital signature deleted successfully!",
      });
    } else {
      return res.status(400).send({ code: 404, message: "Record not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error!" });
  }
};

exports.digital_signature_approval = async (req, res) => {
  try {
    const signatureId = req.params.id;
    const { status, remark } = req.body;

    const getData = await signatureDetails.findOne({
      where: { digital_signature_id: signatureId },
    });

    if (getData) {
      const updateData = await signatureDetails.update(
        { status, remark },
        { where: { digital_signature_id: signatureId } }
      );

      let message = "Digital signature status updated successfully!";
      if (status === "Approved") {
        message = "Digital signature approved successfully!";
      } else if (status === "Rejected") {
        message = "Digital signature rejected successfully!";
      }

      return res.status(200).send({
        code: 200,
        message,
      });
    } else {
      return res.status(400).send({ code: 400, message: "Record not found!" });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error!",
    });
  }
};

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
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

/////////////////Entity List By Employee_id///////////////
exports.get_entity_list = async (req, res) => {
  try {
    const { employee_id } = req.query;

    if (!employee_id) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid input parameters" });
    }

    const entity_name_list = `
      SELECT DISTINCT 
        ue.entity_id,
        em.entity_name,em.company_branch 
      FROM 
        HRMS_REGISTERED_USERS_ENTITY AS ue
      INNER JOIN 
        ENTITY_MASTER AS em ON em.id = ue.entity_id
      WHERE 
        ue.employee_id = :employee_id 
        AND ue.status = 'ACTIVE' 
        AND em.status = 'ACTIVE' 
        AND em.isDeleted = 0
    `;

    const getAllentity = await db.sequelize.query(entity_name_list, {
      replacements: { employee_id: Number(employee_id) },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllentity && getAllentity.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Entity List Selected Successfully",
        Entity_List: getAllentity,
      });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "Employee Not Exist in any Company" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

/////////////// Logout ///////////////
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("shop/signin");
};

/////////////// Forget Password ///////////////
exports.forgetPassword = async (req, res) => {
  try {
    if (!req.body.employee_official_email) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
    var chck = await User.findOne({
      where: { employee_official_email: req.body.employee_official_email },
    });
    if (chck) {
      var verify_link =
        "https://emerp.elitetraveltech.in/Forgot?employee_id=" +
        chck.employee_id;
      var obj_data = {
        from: process.env.EMAIL_FROM,
        to: req.body.employee_official_email,
        employee_official_email: chck.employee_official_email,
        html: "",
        html:
          "<html><body>" +
          "Hi " +
          chck.first_name +
          "," +
          "<br>" +
          "Thanks for getting started with ERP! Simply click the button below to set your  password" +
          "\n\n" +
          ".</p> <a href = " +
          verify_link +
          ' ><button class="btn" style="padding: 6px 8px; border-radius: 7px; cursor: pointer; border-color: blue; color: white; background-color:blue;">Create Password </a><p>' +
          "</body></html>",
        subject: "Link for set password for ERP",
      };
      await transport.mailsend(obj_data);
      return res.status(200).send({
        code: 200,
        message: "Password sent on your email can you please check",
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Server Error" });
  }
};

///////////Generate Employee Code/////////////////
exports.generate_Employee_Code = async (req, res) => {
  try {
    const emplyoment_type = req.body.emplyoment_type;
    const emp_Variable = "EMPP";
    const lastEntry = await User.findAll({
      where: { status: "ACTIVE" },
      order: [["createdAt", "DESC"]],
      attributes: ["employee_code", "employee_id"],
    });
    const last_digit = lastEntry[0].employee_code;
    if (last_digit) {
      const lastNumber = parseInt(last_digit.slice(-5), 10);
      var number = lastNumber + 1;
    } else if (last_digit.length == 0 || last_digit.length == null) {
      var number = 1;
    }
    const code = `${number}`.padStart(5, "0");
    const employeeCode = emp_Variable + code;
    if (emplyoment_type === "") {
      return res.status(200).send({
        code: 200,
        message: "Please Select Employment Type",
        data: null,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Employee Code has been Generated",
        data: employeeCode,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

/////////////// Get List Files ///////////////
const getListFiles = (req, res) => {
  const directoryPath = "./download/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res
        .status(500)
        .send({ code: 500, message: "Unable to scan files!" });
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    return res.status(200).send(fileInfos);
  });
};

/////////////// All User List ///////////////

exports.alluserlist = async (req, res) => {
  try {
    const { entity_id, role_master_name } = req.query;
    let get_employee_Data;
    if (role_master_name == "Super Admin") {
      const employee_list = await db.user_entity.findAll({
        where: { entity_id, status: "ACTIVE" },
      });
      const employee_ids = employee_list.map(
        (employee) => employee.employee_id
      );
      const userDetails = `
       SELECT u.employee_official_email,  CONCAT(EM.entity_name,'-',u.employee_code ) AS employee_code,u.employee_code as login_id, u.first_name, u.middle_name, u.last_name, u.contact_number, u.employee_id, e.emptype_name, d.designation_name, r.role_master_name, u.status
      FROM HRMS_REGISTERED_USER AS u 
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
      INNER JOIN ENTITY_MASTER AS EM ON EM.id  = u.primary_entity_id
      WHERE u.status = "Active"
      ORDER BY u.employee_id DESC;
    `;
      get_employee_Data = await db.sequelize.query(userDetails, {
        type: db.sequelize.QueryTypes.SELECT,
      });
      get_employee_Data = get_employee_Data.filter((data) =>
        employee_ids.includes(data.employee_id)
      );
    } else {
      const employee_list = await db.user_entity.findAll({
        where: { entity_id, status: "ACTIVE" },
      });
      const employee_ids = employee_list.map(
        (employee) => employee.employee_id
      );
      const userData = `
      SELECT u.employee_official_email,  CONCAT(EM.entity_name,'-',u.employee_code ) AS employee_code,u.employee_code as login_id, u.first_name, u.middle_name, u.last_name, u.contact_number, u.employee_id, e.emptype_name, d.designation_name, r.role_master_name, u.status
      FROM HRMS_REGISTERED_USER AS u 
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
      INNER JOIN ENTITY_MASTER AS EM ON EM.id  = u.primary_entity_id
      WHERE u.status = "Active"
      ORDER BY u.employee_id DESC;
    `;
      const getAllData = await db.sequelize.query(userData, {
        type: db.sequelize.QueryTypes.SELECT,
      });
      get_employee_Data = getAllData.filter((data) =>
        employee_ids.includes(data.employee_id)
      );
    }
    if (get_employee_Data) {
      get_employee_Data.sort((a, b) => {
        return b.employee_id - a.employee_id;
      });
      return res.status(200).send({
        code: 200,
        message: "Fetch All User List Data Successfully!",
        data: get_employee_Data,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.alluserlist_byentity = async (req, res) => {
  try {
    const { entity_id, role_master_name } = req.query;
    let get_employee_Data;
    if (role_master_name == "Super Admin") {
      const userDetails = `
       SELECT u.employee_official_email,  CONCAT(EM.entity_name,'-',u.employee_code ) AS employee_code,u.employee_code as login_id, u.first_name, u.middle_name, u.last_name,k.department_name, u.contact_number, u.employee_id, e.emptype_name, d.designation_name, r.role_master_name, u.status
      FROM HRMS_REGISTERED_USER AS u 
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN MASTER_DEPARTMENT AS k ON k.dept_id = u.department_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
      INNER JOIN ENTITY_MASTER AS EM ON EM.id  = u.primary_entity_id
      WHERE u.primary_entity_id =${entity_id} AND (u.status = "ACTIVE" OR u.status = "INACTIVE")
      ORDER BY u.employee_id DESC;
    `;
      get_employee_Data = await db.sequelize.query(userDetails, {
        type: db.sequelize.QueryTypes.SELECT,
      });
    } else {
      const userData = `
      SELECT u.employee_official_email,  CONCAT(EM.entity_name,'-',u.employee_code ) AS employee_code,u.employee_code as login_id, u.first_name, u.middle_name, u.last_name, u.contact_number,k.department_name, u.employee_id, e.emptype_name, d.designation_name, r.role_master_name, u.status
      FROM HRMS_REGISTERED_USER AS u 
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN MASTER_DEPARTMENT AS k ON k.dept_id = u.department_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
      INNER JOIN ENTITY_MASTER AS EM ON EM.id  = u.primary_entity_id
      WHERE u.primary_entity_id =${entity_id} AND (u.status = "ACTIVE" OR u.status = "INACTIVE")
      ORDER BY u.employee_id DESC;
    `;
      get_employee_Data = await db.sequelize.query(userData, {
        type: db.sequelize.QueryTypes.SELECT,
      });
    }
    if (get_employee_Data) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All User List Data Successfully!",
        data: get_employee_Data,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.allsalesPreson = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: {
        [Op.and]: [{ role_master_id: 22 }, { status: "ACTIVE" }],
      },
      attributes: [
        "employee_id",
        "first_name",
        "employee_code",
        "employee_official_email",
        "role_master_id",
      ],
    });
    if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All User List Data Successfully!",
        data: userData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.alll1approver = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: {
        [Op.and]: [{ role_master_id: 8 }, { status: "ACTIVE" }],
      },
      attributes: ["employee_id", "first_name", "role_master_id"],
    });
    if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All User List Data Successfully!",
        data: userData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.alll2approver = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: {
        [Op.and]: [{ role_master_id: 35 }, { status: "ACTIVE" }],
      },
      attributes: ["employee_id", "first_name", "role_master_id"],
    });
    if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All User List Data Successfully!",
        data: userData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// All User List Name ///////////////

exports.alluserlistName = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: { status: "ACTIVE" },
      attributes: [
        "employee_id",
        "first_name",
        "last_name",
        "employee_code",
        "role_master_id",
        "reporting_manager",
      ],
    });
    if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All User List Name Data Successfully!",
        data: userData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_All_Aduitorlistwithname = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: {
        [Op.and]: [{ role_master_id: 27 }, { status: "ACTIVE" }],
      },
      attributes: [
        "employee_id",
        "employee_code",
        "first_name",
        "employee_official_email",
        "mobile_number",
        "emplyoment_type",
        "designation",
        "role_master_id",
      ],
    });
    if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Auditor List Data Successfully!",
        data: userData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// All List Global Sales Manager ///////////////

exports.allListGlobalSalesManager = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: { designation: "Global Manager Sales" },
      attributes: ["employee_id", "first_name", "last_name"],
    });
    if (userData.length == 0) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    } else if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All List Global Sales Manager Data Successfully!",
        data: userData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// All List Regional Business Head ///////////////
exports.allListAgent = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: { role_master_id: 50 },
      attributes: ["employee_id", "first_name", "last_name"],
    });
    if (userData.length == 0) {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    } else if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Ajent Data Successfully!",
        data: userData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.allListRegionalBusinessHead = async (req, res) => {
  try {
    const userData = await User.findAll({
      where: { designation: "Regional Business Head" },
      attributes: ["employee_id", "first_name", "last_name"],
    });
    if (userData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All List Regional Business Head Data Successfully!",
        data: userData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
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
  SELECT 
  u.employee_id,u.title,u.role_master_id,u.employee_official_email,u.first_name,u.middle_name,u.last_name,
    u.gender,u.employee_photo,u.date_of_birth,u.spouse_name,u.address_check_value,u.parmanent_address,u.bank_address,u.employee_name_in_bank,
    u.account_number,u.emp_personal_email,u.contact_number,u.present_address,u.driving_license_number,u.issued_date,u.passport_number,
    u.basic_salary,u.salary_per_day,u.salary_per_hr,u.total_monthly_hr,u.weekly_hour,u.re_enter_account_no,u.bank_id,u.start_working_date,u.end_date_probation,
    u.user_type,u.tab_type,u.present_country_id,u.present_state_id,u.present_city_id,u.permanent_country_id,u.permanent_city_id,u.permanent_state_id,
    u.personal_country_id,u.personal_state_id,u.personal_city_id,u.department_id,u.designation_id,u.area_id,u.emplyoment_type_id,u.municipality_id,
    u.role_master_name,u.reporting_manager_id,u.contract_types_id,u.marital_status,u.isDeleted,u.country_code,u.reporting_manager,u.DIRE_number,
    u.blood_group,u.id_number,u.exp_date,u.tax_number,u.candidate_id,u.approval_manager,u.emp_join_date,u.emp_probation_date,u.official_contact_number,
    u.official_country_code,u.pf_account_number,u.UAN_number,u.ESIC_number,u.employee_country_id,u.employee_state_id,u.employee_city_id,u.isHandiCap,u.grade_id,
    u.approval_manager_id,u.nuit_number,u.bank_district_name,u.inss_number,emp_pan_card,u.emp_adhar_card_number,u.emp_medical_condition,
    u.visa_number,u.emirates_id_number,u.labour_card_number,u.ifsc_code,u.swift_code,u.iban_number,u.epf_type,u.location_id,u.division_id,
    u.primary_entity_id,u.primary_branch_id,u.work_from_country,u.visa_number_exp_date,u.eid,u.eid_exp_date,u.business_unit,
    CONCAT(EM.entity_name,'-',u.employee_code ) AS employee_code, u.employee_code as login_id,u.labour_card_number_exp_date,a.area_name, bank_document,attached_with_payroll,u.alt_bank_id,
    u.alt_account_holdname,u.alt_bank_address, u.alt_account_number,u.alt_IFSC_code, u.alt_bank_document,u.alt_re_enter_number,
    d.department_name, des.designation_name, et.emptype_name,u.employee_name_in_bank as account_holder_name, perm_city.city_name AS permanent_city_name,
    br.branch_name AS primary_branch_name,
    pres_city.city_name AS present_city_name,
    perm_state.states_name AS permanent_states_name,
    pres_state.states_name AS present_states_name,
    perm_country.countryss_name AS permanent_country_name,
    pres_country.countryss_name AS present_country_name,
    m.name_of_municipality,
    md.division_name,
    GROUP_CONCAT(EC.epf) AS epf,
    GROUP_CONCAT(EC.epf_capping) AS epf_capping,
    GROUP_CONCAT(EC.edli) AS edli,
    GROUP_CONCAT(EC.esi) AS esi,
    GROUP_CONCAT(EC.professional_tax) AS professional_tax,
    GROUP_CONCAT(EC.labour_welfare_fund) AS labour_welfare_fund,
    GROUP_CONCAT(EC.overtime) AS overtime,
    GROUP_CONCAT(EC.gratuity_employer) AS gratuity_employer,
    GROUP_CONCAT(EC.nps) AS nps,
    GROUP_CONCAT(EC.saf) AS saf,
    GROUP_CONCAT(DISTINCT br.branch_name) AS branch_names, 
    GROUP_CONCAT(DISTINCT ul.location_id) AS location_ids 
    FROM HRMS_REGISTERED_USER AS u
    LEFT JOIN MASTER_AREA AS a ON u.area_id = a.id
    LEFT JOIN MASTER_DEPARTMENT AS d ON u.department_id = d.dept_id
    LEFT JOIN MASTER_MUNICIPALITY AS m ON u.municipality_id = m.id
    LEFT JOIN DESIGNATION AS des ON u.designation_id = des.designation_id
    LEFT JOIN HRMS_EMPLOYMENT_TYPE AS et ON u.emplyoment_type_id = et.emptype_id
    LEFT JOIN MASTER_CITY AS perm_city ON u.permanent_city_id = perm_city.city_id
    LEFT JOIN MASTER_CITY AS pres_city ON u.present_city_id = pres_city.city_id
    LEFT JOIN MASTER_STATE AS perm_state ON u.permanent_state_id = perm_state.states_id
    LEFT JOIN MASTER_STATE AS pres_state ON u.present_state_id = pres_state.states_id
    LEFT JOIN MASTER_COUNTRY AS perm_country ON u.permanent_country_id = perm_country.countryss_id
    LEFT JOIN MASTER_COUNTRY AS pres_country ON u.personal_country_id = pres_country.countryss_id
    LEFT JOIN HRMS_REGISTERED_USERS_LOCATION AS ul ON u.employee_id = ul.employee_id
    LEFT JOIN MASTER_BRANCH AS br ON br.id = ul.location_id
    LEFT JOIN MASTER_DIVISION AS md ON md.division_id = u.division_id
    INNER JOIN ENTITY_MASTER AS EM ON EM.id  = u.primary_entity_id
    LEFT JOIN EMPLOYEE_COMPLIANCE_SETTING AS EC ON EC.employee_id = u.employee_id
  WHERE 
    u.employee_id = :userId AND 
    (u.status = 'Active' OR u.status = 'ONBOARDED')
  GROUP BY 
    u.employee_id, 
    a.area_name, 
    d.department_name, 
    des.designation_name, 
    et.emptype_name,
    perm_city.city_name, 
    pres_city.city_name, 
    perm_state.states_name, 
    pres_state.states_name, 
    perm_country.countryss_name, 
    pres_country.countryss_name, 
    m.name_of_municipality,
    br.branch_name
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
        if (obj[key] === null || obj[key] === "null") {
          obj[key] = "";
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

    const history_salary = await db.user_salary.findAll({
      where: { employee_id: userId },
      include: [
        { model: db.designation, as: "FromDesignation" },
        { model: db.designation, as: "ToDesignation" },
        { model: db.grade_master, as: "FromGrade" },
        { model: db.grade_master, as: "ToGrade" },
      ],
    });

    userData.history_salary = history_salary.map((salary) => {
      const { FromDesignation, ToDesignation, FromGrade, ToGrade, ...rest } =
        salary.toJSON();

      return {
        ...rest,
        from_designation_name: FromDesignation?.designation_name || "",
        to_designation_name: ToDesignation?.designation_name || "",
      };
    });

    const documentsDetail = await db.user_documents.findAll({
      where: { employee_id: userId },
    });
    userData.documents_detail = documentsDetail;

    const contractDetail = await db.user_contract.findAll({
      where: { employee_id: userId },
    });
    userData.contractDetails = contractDetail;
    // userData.gradeSalaryData = await db.payroll_pay_salary.findAll({
    //   where: {
    //     employee_id: userId,
    //     g_pay: false,
    //     is_deleted: false,
    //     status: "Active",
    //   },
    // });
    const gradeSalaryQuery = `
  SELECT 
    PPS.*, 
    PST.pfCap, 
    PST.esiThreshold
  FROM 
    HRMS_EMPLOYEE_PAY_SALARY PPS
  JOIN 
    PAYROLL_SALARY_TEMPLATE PST 
      ON PPS.payroll_template_id = PST.id
  WHERE 
    PPS.employee_id = :userId
    AND PPS.g_pay = false
    AND PPS.is_deleted = false
    AND PPS.status = 'Active';
`;

    const gradeSalaryData = await db.sequelize.query(gradeSalaryQuery, {
      replacements: { userId },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    userData.gradeSalaryData = gradeSalaryData;

    return res.status(200).send({
      code: 200,
      message: "Fetch All User Data Successfully!",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.userById_businesUnit = async (req, res) => {
  try {
    const userId = req.params.employee_id;
    let jsonData = await User.findOne({
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
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.emp_by_id = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const UserData = await User.findOne({
      where: { employee_id: userId },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!UserData) {
      return res.status(404).send({ code: 404, message: "User Not Found " });
    } else if (UserData) {
      (UserData.dataValues.current_city =
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
          UserData.dataValues.parmanent_address[0].p_pin_code);
      return res.status(200).send({
        code: 200,
        message: "Fetch All User Data Successfully!",
        data: UserData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// All User List By EmpId ///////////////
exports.alluserlistbyEmpid = async (req, res) => {
  try {
    const empId = parseInt(req.params.employee_id);
    const userData = await User.findAll({
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
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_all_role = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const user_data = await users.findOne({
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
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_all_unapproved_emp = async (req, res) => {
  try {
    const Unaproved_data = await User.findAll({
      where: { status: "INACTIVE" },
    });
    if (Unaproved_data) {
      Unaproved_data.sort().reverse();
      return res.status(200).send({
        code: 200,
        message: "data fetched successfully",
        data: Unaproved_data,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Unapproved " });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.user_status_for_logout = async (req, res) => {
  try {
    let userId = req.params.id;
    const isExistUser = await User.findAll({
      where: { employee_id: userId, status: "ACTIVE" },
    });
    if (isExistUser) {
      return res
        .status(200)
        .send({ code: 200, message: "Data fetched successfully" });
    }
    return res.status(404).send({ code: 404, message: "User Not Found." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.approved_unapproved_emp = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const emp_id = req.body.emp_id;
    const status = req.body.status;
    const verify_role = await User.findOne({
      where: { employee_id: employee_id },
    });

    // if(verify_role.role_master_id==45 || verify_role.role_master_id==18){

    const employee_data = await User.findOne({
      where: { employee_id: emp_id },
    });
    if (employee_data) {
      const employee_approved = await User.update(
        { status },
        { where: { employee_id: emp_id } }
      );
      return res.status(200).send({ code: 200, message: "Employee Approved" });
    } else {
      return res.status(403).send({ code: 403, message: "No employee found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.send_form_status = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const { final_form_submit, condidateId, employeId } = req.body;
    let employee_data = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (employee_data) {
      const candidate_data = await User.update(
        { final_form_submit },
        { where: { employee_id: employee_id } }
      );
      let employee_data = await User.findOne({
        where: { employee_id: employee_id },
      });
      let employee_data_detail = await candidateProfileDetails.findOne({
        where: { candidate_id: condidateId },
      });

      if (employee_data.final_form_submit == "True") {
        const update_candidate_data = await candidateProfileDetails.update(
          { status1: "True" },
          { where: { candidate_id: employee_data_detail.candidate_id } }
        );
        return res
          .status(200)
          .send({ code: 200, message: "form submitted", data: employee_data });
      } else {
        return res
          .status(403)
          .send({ code: 403, message: "You have Already Submitted The form" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.create_candidate = async (req, res) => {
  try {
    let title = req.body.title;
    let user_role = req.body.user_role;
    let employee_official_email = req.body.employee_official_email;
    let employee_code = req.body.employee_code;
    let first_name = req.body.first_name;
    let middle_name = req.body.middle_name;
    let last_name = req.body.last_name;
    let gender = req.body.gender;
    let emplyoment_type = req.body.emplyoment_type;
    let segment_suv = req.body.segment_suv;
    let designation = req.body.designation;
    let date_of_joining = req.body.date_of_joining;
    let date_of_birth = req.body.date_of_birth;
    let region = req.body.region;
    let department = req.body.department;
    let country = req.body.country;
    let state = req.body.state;
    let role_master_id = req.body.role_master_id;
    let city = req.body.city;
    let pincode = req.body.pincode;
    var reporting_manager = req.body.reporting_manager;
    var reporting_manager_id = req.body.reporting_manager_id;
    let reporting_plant_location = req.body.reporting_plant_location;
    let working_physical_location = req.body.working_physical_location;
    let band = req.body.band;
    let grade = req.body.grade;
    let mobile_number = req.body.mobile_number;
    let personal_email = req.body.personal_email;
    let probation = req.body.probation;
    let status = req.body.status;
    let total_ctc = req.body.total_ctc;
    let fixed_ctc = req.body.fixed_ctc;
    let variable_ctc = req.body.variable_ctc;
    let { current_address, parmanent_address } = req.body;

    let abc = req.body.employee_id;
    let link = (process.env.APP_FRONTEND_URL || "https://emerp.elitetraveltech.in").replace(/\/?$/, "") + "/auth/login";
    const baseUrl = (process.env.APP_PUBLIC_URL || "https://emerpapi.elitetraveltech.in").replace(/\/?$/, "/");
    const auditorQualificationDetails = db.auditorQualification;
    let employee_photo;
    req.file == undefined ? "" : (employee_photo = req.file.path);
    if (!req.file == undefined) {
      fs.renameSync(req.file.path, employee_photo);
    }
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 14;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    const date1 = new Date();
    const date = new Date(date1);
    let users = date.setMonth(date.getMonth() + 6);
    var probation22 = moment(new Date(users)).format("YYYY-MM-DD");
    if (req.body.employee_id != "null") {
      var emp_data = await User.update(
        {
          title: title,
          employee_official_email: employee_official_email,
          employee_code: employee_code,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          gender: gender,
          emplyoment_type: emplyoment_type,
          segment_suv: segment_suv,
          designation: designation,
          date_of_joining: date_of_joining,
          date_of_birth: date_of_birth,
          region: region,
          department: department,
          country: country,
          state: state,
          city: city,
          role_master_id: parseInt(role_master_id) || "",
          pincode: pincode,
          reporting_manager: reporting_manager,
          reporting_manager_id: parseInt(reporting_manager_id),
          reporting_plant_location: reporting_plant_location,
          working_physical_location: working_physical_location,
          band: band,
          grade: grade,
          employee_photo: baseUrl + employee_photo,
          mobile_number: mobile_number,
          personal_email: personal_email,
          probation: null,
          probation1: probation22,
          status: status,
          user_role: user_role,
          total_ctc: total_ctc,
          fixed_ctc: fixed_ctc,
          variable_ctc: variable_ctc,
          password: bcrypt.hashSync(password, 8),
        },
        { where: { employee_id: req.body.employee_id } }
      );
      if (password) {
        info = await transport.mailsend({
          from: process.env.EMAIL_FROM,
          to: employee_official_email,
          subject: "ERP - Password ",
          html: `<p><strong>Hi ${first_name}</strong> <br>Please find your link for ERP login <a href = ${link}>Click Here </a>
           Your <strong>Official Email Id is</strong> ${employee_official_email}
           Your Password is: <strong> ${password} </strong> </p>`,
        });
      }
      return res.status(200).send({
        code: 200,
        message: "Employee data Updated Successfully",
        data: emp_data,
      });
    } else if (req.body.employee_id == "null") {
      var employee_id = await User.create({
        title: title,
        employee_official_email: employee_official_email,
        employee_code: employee_code,
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        gender: gender,
        emplyoment_type: emplyoment_type,
        segment_suv: segment_suv,
        designation: designation,
        date_of_joining: date_of_joining,
        date_of_birth: date_of_birth,
        region: region,
        department: department,
        country: country,
        state: state,
        city: city,
        role_master_id: parseInt(role_master_id) || 27,
        pincode: pincode,
        reporting_manager: reporting_manager,
        reporting_manager_id: parseInt(reporting_manager_id),
        reporting_plant_location: reporting_plant_location,
        working_physical_location: working_physical_location,
        band: band,
        grade: grade,
        employee_photo: baseUrl + employee_photo,
        mobile_number: mobile_number,
        personal_email: personal_email,
        probation: probation22,
        probation1: null,
        status: status,
        user_role: "User",
        total_ctc: total_ctc,
        fixed_ctc: fixed_ctc,
        variable_ctc: variable_ctc,
        password: bcrypt.hashSync(password, 8),
        // current_address,parmanent_address
      });

      if (password) {
        info = await transport.mailsend({
          from: process.env.EMAIL_FROM,
          to: employee_official_email,
          subject: "ERP - Password ",
          html: `<p><strong>Hi ${first_name}</strong> <br>Please find your link for ERP login <a href = ${link}>Click Here </a>
         Your <strong>Official Email Id is</strong> ${employee_official_email}
         Your Password is: <strong> ${password} </strong> </p>`,
        });
      }
      return res
        .status(200)
        .send({ code: 200, message: "Employee created", data: employee_id });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_candidates_final_formsubmit = async (req, res) => {
  try {
    const candidate_id = req.params.id;
    const candidate_data = await candidateProfileDetails.findOne({
      where: { candidate_id: candidate_id },
    });
    if (
      candidate_data == null ||
      candidate_data.status1 == "" ||
      candidate_data.status1 == null
    ) {
      const update_candidate_data = await candidateProfileDetails.update(
        { status1: "false" },
        { where: { candidate_id: candidate_id } }
      );
      var final_candidate_data = await candidateProfileDetails.findOne({
        where: { candidate_id: candidate_id },
        attributes: [
          "candidate_id",
          "condidate_name",
          "email",
          "status1",
          "date_of_joining",
        ],
      });
      return res.status(200).send({
        code: 200,
        message: "Form Submitted successfully",
        data: final_candidate_data,
      });
    } else {
      const final_candidate_data = await candidateProfileDetails.findOne({
        where: { candidate_id: candidate_id },
        attributes: [
          "candidate_id",
          "condidate_name",
          "email",
          "status1",
          "date_of_joining",
        ],
      });
      return res.status(200).send({
        code: 200,
        message: "Form Submitted successfully",
        data: final_candidate_data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_all_employeeBy_User_role = async (req, res) => {
  const { role_masterId: role_Id } = req.params;
  // const { entity_id } = req.query; // Single entity_id

  if (!role_Id) {
    return res
      .status(400)
      .send({ code: 400, message: "Invalid input parameters" });
  }
  try {
    const sqlQuery = `
        SELECT DISTINCT u.employee_id, u.title, u.role_master_id,
            u.employee_official_email, u.employee_code,
            u.first_name, u.middle_name, u.last_name, u.gender,
            u.reporting_manager, u.employee_photo, u.date_of_birth,
            u.status, u.blood_group, u.spouse_name, u.address_check_value,
            u.parmanent_address, u.bank_address, u.employee_name_in_bank,
            u.account_number, u.country_code, u.emp_personal_email,
            u.contact_number, u.present_address, u.DIRE_number,
            u.driving_license_number, u.id_number, u.issued_date,
            u.exp_date, u.tax_number, u.passport_number, u.marital_status,
            u.basic_salary, u.salary_per_day, u.salary_per_hr, u.total_monthly_hr,
            u.weekly_hour, u.re_enter_account_no, u.nuit_number, u.inss_number, u.bank_id, u.start_working_date,
            u.end_date_probation, u.user_type, u.present_country_id,
            u.present_state_id, u.present_city_id, u.permanent_country_id,
            u.permanent_state_id, u.permanent_city_id, u.personal_country_id,
            u.personal_state_id, u.personal_city_id, u.location_id, u.department_id,
            u.designation_id, u.area_id, u.emplyoment_type_id, u.municipality_id,
            u.role_master_name, u.reporting_manager_id, u.contract_types_id
        FROM HRMS_REGISTERED_USER u
        INNER JOIN HRMS_REGISTERED_USERS_ENTITY ru ON u.employee_id = ru.employee_id
        WHERE u.role_master_id IN (:role_Id)
          AND u.status = 'ACTIVE'
        ORDER BY u.employee_id DESC;
      `;

    const replacements = {
      role_Id: role_Id.split(",").map(Number),
    };

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
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getProbationaryUserList = async (req, res) => {
  try {
    const currentDate = new Date();

    // Get all ACTIVE mapped users
    const employee_list = await db.user_entity.findAll({
      where: { status: "ACTIVE" },
    });

    const employee_ids = employee_list.map((emp) => emp.employee_id);

    const userDetailsQuery = `
      SELECT 
        u.employee_official_email, u.employee_code, u.title, u.first_name, u.contact_number2,
        u.middle_name, u.last_name, u.contact_number, u.employee_id, 
        e.emptype_name, d.designation_name, r.role_master_name, u.country_code,
        u.designation_id, u.contact_number, u.emp_personal_email, u.department_id,
        u.start_working_date, u.end_date_probation, IFNULL(u.probation_type, 'In Probation') AS probation_type, u.probation_reason, u.no_of_month_extend, 
        DM.department_name
      FROM HRMS_REGISTERED_USER AS u 
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
      LEFT JOIN MASTER_DEPARTMENT AS DM ON DM.dept_id = u.department_id
      WHERE 
        u.status = "Active" 
        AND u.end_date_probation IS NOT NULL
        AND u.end_date_probation > :currentDate
         AND (u.probation_type IS NULL OR u.probation_type != 'Confirm Probation')
      ORDER BY u.employee_id DESC;
    `;

    let get_employee_Data = await db.sequelize.query(userDetailsQuery, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { currentDate },
    });

    // Filter with mapped employee_ids
    get_employee_Data = get_employee_Data.filter((data) =>
      employee_ids.includes(data.employee_id)
    );

    if (get_employee_Data && get_employee_Data.length) {
      return res.status(200).send({
        code: 200,
        message: "Probationary user list fetched successfully!",
        data: get_employee_Data,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No probationary users found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

/* Get All User According to Reporting Manger*/
exports.getAllUserByManager = async (req, res) => {
  try {
    const id = req.params.id;
    let data = [];
    const reportingIds = await db.user.findAll({
      where: { reporting_manager_id: id },
      attributes: ["employee_id"],
    });
    employeeIds = reportingIds.map((user) => user.employee_id);

    if (employeeIds.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Users Found",
        data: [],
      });
    }

    for (emp_id of employeeIds) {
      var manager = await db.user.findOne({
        where: {
          employee_id: emp_id,
        },
        attributes: ["first_name", "last_name", "employee_id"],
      });
      data.push(manager);
    }

    return res.status(200).send({
      code: 200,
      message: "Data Fetched Successfully",
      data,
    });
  } catch (error) {
    console.error(
      `Error fetching users for manager with ID ${req.params.id}:`,
      error
    );

    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getAllUserData = async (req, res) => {
  try {
    const getAllData = await User.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
    });
    return res.status(200).send({
      code: 200,
      message: "Fetched all User Successfully",
      data: getAllData,
    });
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send({
      code: 500,
      message: "Server Error",
    });
  }
};

exports.getAllDataShowInExcel = async (req, res) => {
  try {
    const { entity_id, role_master_name } = req.query;

    if (!entity_id || !role_master_name) {
      return res.status(400).send({ code: 400, message: "Missing parameters" });
    }

    // Fetch employee IDs for the given entity
    const employee_list = await db.user_entity.findAll({
      where: { entity_id, status: "ACTIVE" },
    });
    const employee_ids = employee_list.map((employee) => employee.employee_id);

    const userDetails = `
      SELECT 
        u.employee_official_email,
        CONCAT(EM.entity_name, '-', u.employee_code) AS employee_code,
        u.employee_code AS login_id,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.contact_number,
        u.employee_id,
        e.emptype_name,
        d.designation_name,
        r.role_master_name,
        u.status,
        u.primary_entity_id,
        EM.entity_name,
        EM.id AS entity_id,
        c.countryss_id,
        u.employee_country_id,
        c.countryss_name,
        s.states_id,
        u.employee_state_id,
        s.states_name,
        ct.city_id,
        u.employee_city_id,
        ct.city_name,
        u.primary_branch_id,
        br.id AS branch_id,
        br.branch_name,
        u.department_id,
        dept.dept_id,
        dept.department_name,
        u.area_id,
        area.id AS area_id,
        area.area_name,
        u.emplyoment_type_id,
        et.emptype_id,
        et.emptype_name
      FROM 
        HRMS_REGISTERED_USER AS u
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS e ON e.emptype_id = u.emplyoment_type_id
      LEFT JOIN DESIGNATION AS d ON d.designation_id = u.designation_id
      LEFT JOIN HRMS_RBAC_ROLE_MASTER AS r ON r.role_master_id = u.role_master_id
      LEFT JOIN ENTITY_MASTER AS EM ON EM.id = u.primary_entity_id
      LEFT JOIN MASTER_COUNTRY AS c ON c.countryss_id = u.employee_country_id
      LEFT JOIN MASTER_STATE AS s ON s.states_id = u.employee_state_id
      LEFT JOIN MASTER_CITY AS ct ON ct.city_id = u.employee_city_id
      LEFT JOIN MASTER_BRANCH AS br ON br.id = u.primary_branch_id
      LEFT JOIN MASTER_DEPARTMENT AS dept ON dept.dept_id = u.department_id
      LEFT JOIN MASTER_AREA AS area ON area.id = u.area_id
      LEFT JOIN HRMS_EMPLOYMENT_TYPE AS et ON et.emptype_id = u.emplyoment_type_id
      WHERE 
        u.status = "Active"
      ORDER BY 
        u.employee_id DESC;
    `;

    let get_employee_Data = await db.sequelize.query(userDetails, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    // Filter data based on fetched employee IDs
    get_employee_Data = get_employee_Data.filter((data) =>
      employee_ids.includes(data.employee_id)
    );

    if (get_employee_Data.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched User List Data Successfully!",
        data: get_employee_Data,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Records Found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
// exports.changePassword = async (req, res) => {
//   try {
//     const { employee_id, oldPassword, password, baseUiUrl } = req.body;

exports.changePassword = async (req, res) => {
  try {
    const { employee_id, password, oldPassword, baseUiUrl } = req.body;

    if (!employee_id || !password || !oldPassword) {
      console.log(" Missing required fields.");
      return res
        .status(400)
        .send({ code: 400, message: "All fields are required." });
    }

    const employeeId = isNaN(Number(employee_id))
      ? employee_id
      : Number(employee_id);
    const findUser = await db.user_login.findOne({
      where: { employee_id: employeeId },
      attributes: ["password", "employee_official_email", "first_name"],
    });

    if (!findUser || !findUser.password) {
      return res.status(403).send({ code: 403, message: "User not found." });
    } else {
      const bytesPassword = CryptoJS.AES.decrypt(
        findUser?.password,
        "password"
      );
      const userPassword = bytesPassword.toString(CryptoJS.enc.Utf8);
      if (userPassword != oldPassword) {
        return res
          .status(403)
          .send({ code: 403, message: "Old password is not correct" });
      } else {
        let updatedData = await db.user_login.update(
          {
            password: password,
          },
          { where: { employee_id: employee_id } }
        );
        if (updatedData) {
          const bytesChangeassword = CryptoJS.AES.decrypt(password, "password");
          const changedPassword = bytesChangeassword.toString(
            CryptoJS.enc.Utf8
          );
          return res
            .status(200)
            .send({ code: 200, message: "Password changed successfully" });
        }
      }
    }
  } catch (error) {
    console.error(" Change Password Error:", error);
    return res.status(500).send({ code: 500, message: "Server Error." });
  }
};

// Forgot password start
exports.forgotSendOtp = async (req, res) => {
  try {
    const { employee_official_email, baseUiUrl } = req.body;
    const findUser = await User.findOne({
      where: { employee_official_email: employee_official_email },
    });
    if (!findUser) {
      return res.status(403).send({ code: 403, message: "Invalid Email Id" });
    } else {
      let webLink = `${baseUiUrl}auth/login/forgot-password`;
      const encryptedUserId = CryptoJS.AES.encrypt(
        findUser.employee_id.toString(),
        "userId"
      ).toString();
      info = await transport.mailsend({
        from: "zynoindia.erp@gmail.com",
        to: findUser?.employee_official_email,
        subject: "ERP - Password ",
        html: `<p><strong>Hi ${findUser?.first_name}</strong> <br>Please use this link for forgot password <a href = ${webLink}?id=${encryptedUserId}>Click Here </a>
       Your <strong>Official Email Id is</strong> ${findUser?.employee_official_email} </p>`,
      });

      return res
        .status(200)
        .send({ code: 200, message: "Link send on your mail please check" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { password, userId, baseUiUrl } = req.body;
    const bytesUserId = CryptoJS.AES.decrypt(userId, "userId");
    const decryptUserId = bytesUserId.toString(CryptoJS.enc.Utf8);
    const findUser = await User.findOne({
      where: { employee_id: decryptUserId },
    });
    if (!findUser) {
      return res.status(403).send({ code: 403, message: "User Not Found" });
    } else {
      let updatedData = await User.update(
        {
          password: password,
        },
        { where: { employee_id: decryptUserId } }
      );
      if (updatedData) {
        const bytesChangeassword = CryptoJS.AES.decrypt(password, "password");
        const changedPassword = bytesChangeassword.toString(CryptoJS.enc.Utf8);
        let webLink = `${baseUiUrl}auth/login`;
        info = await transport.mailsend({
          from: "zynoindia.erp@gmail.com",
          to: findUser?.employee_official_email,
          subject: "ERP - Password ",
          html: `<p><strong>Hi ${findUser?.first_name}</strong> <br>Please find your link for ERP login <a href = ${webLink}>Click Here </a>
         Your <strong>Official Email Id is</strong> ${findUser?.employee_official_email}
         Your Changed Password is: <strong> ${changedPassword} </strong> </p>`,
        });

        return res
          .status(200)
          .send({ code: 200, message: "Password successfully changed" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getAutofetchBranchName = async (req, res) => {
  const { id } = req.params;
  try {
    const branches = await db.entityMaster.findAll({
      where: {
        id: id,
      },
    });
    if (branches.length === 0) {
      return res.status(404).json({ message: "No branches found for this ID" });
    }
    const branchData = branches.map((branch) => ({
      branch_name: branch.company_branch,
      branch_id: branch.branch_id,
    }));
    res.status(200).json({ data: branchData });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// routes.js or controller.js
exports.getAllRegisteredUser = async (req, res) => {
  try {
    const [users] = await db.sequelize.query(
      `SELECT d.employee_id,d.first_name,d.middle_name,d.last_name,d.primary_entity_id,d.primary_branch_id,d.role_master_id,d.designation_id,d.department_id,d.area_id FROM HRMS_REGISTERED_USER AS d WHERE status='ACTIVE' AND isDeleted = 0`
    );
    return res.status(200).json({
      code: 200,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

//////////////////////////////////////////////
exports.forgotPassLink = async (req, res) => {
  try {
    const { employee_official_email, baseUiUrl } = req.body;

    const findUser = await User.findOne({
      where: { employee_official_email: employee_official_email },
    });

    if (!findUser) {
      return res
        .status(403)
        .send({ code: 403, message: "Invalid e-mail address!" });
    }

    const webLink = `${baseUiUrl}auth/forget-password`;
    const encryptedUserId = encodeURIComponent(
      CryptoJS.AES.encrypt(findUser.employee_id.toString(), "userId").toString()
    );

    const result = await sendPassLink(findUser, webLink, encryptedUserId);

    if (result && result.success) {
      return res.status(200).send({
        code: 200,
        message: "Link has been sent on your e-mail address!",
      });
    } else {
      return res.status(500).send({
        code: 500,
        message: result?.message || "Failed to send reset link.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, userId, baseUiUrl } = req.body;
    const bytesUserId = CryptoJS.AES.decrypt(userId, "userId");
    const decryptUserId = bytesUserId.toString(CryptoJS.enc.Utf8);
    const findUser = await User.findOne({
      where: { employee_id: decryptUserId },
    });

    if (!findUser) {
      return res.status(403).send({ code: 403, message: "User not found!" });
    } else {
      let updatedData = await db.user_login.update(
        {
          password: password,
        },
        { where: { employee_id: decryptUserId } }
      );
      if (updatedData) {
        const result = await sendpassChanged(findUser);
        if (result && result.success) {
          return res
            .status(200)
            .send({ code: 200, message: "Password changed successfully!" });
        } else {
          return res.status(201).send({
            code: 201,
            message: "Password changed successfully but failed to send e-mail!",
            error: result?.message,
          });
        }
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

//update employee api

exports.updateEmployeeBasicData = async (req, res) => {
  try {
    const employee_id = req.user?.employee_id;
    const body = req.body;
    if (!body.employee_id) {
      return res
        .status(400)
        .json({ code: 400, message: `Employee ID is required.` });
    }
    if (Number(employee_id) != Number(body.employee_id)) {
      return res
        .status(400)
        .json({ code: 401, message: `Not autherized to update this record.` });
    }
    const fields = [
      "title",
      "first_name",
      "middle_name",
      "last_name",
      "gender",
      "date_of_birth",
      "emp_personal_email",
      "employee_official_email",
      "contact_number",
      "country_code",
      "reporting_manager",
      "reporting_manager_id",
      "department_id",
      "designation_id",
      "area_id",
      "emplyoment_type_id",
      "role_master_id",
      "role_master_name",
      "employee_photo",
      "pf_account_number",
      "UAN_number",
      "ESIC_number",
      "official_contact_number",
      "status",
      "division_id",
      "employee_city_id",
      "work_from_country",
      "employee_state_id",
      "employee_country_id",
      "emp_join_date",
      "emp_probation_date",
      "official_country_code",
      "approval_manager_id",
      "approval_manager",
      "primary_entity_id",
      "primary_branch_id",
    ];

    const existingUser = await User.findByPk(employee_id);

    let photoPathForDescriptor = null;
    if (req.file && req.file.path) {
      existingUser.employee_photo = req.file.path;
      photoPathForDescriptor = req.file.path;
    } else if (body.employee_photo) {
      let clean = body.employee_photo.replace(/^.*uploaded_files\//, 'uploaded_files/');
      photoPathForDescriptor = path.join(process.cwd(), clean);
    }

    if (photoPathForDescriptor && fs.existsSync(photoPathForDescriptor)) {
      try {
        const descriptor = await getFaceDescriptor(photoPathForDescriptor);
        if (descriptor) {
          existingUser.face_descriptor = JSON.stringify(Array.from(descriptor));
          console.log(`✅ [UpdateBasicData] Enrolled face descriptor for employee ${employee_id}`);
        }
      } catch (err) {
        console.warn("⚠️ Face extraction notice:", err.message);
      }
    }

    for (let field of fields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        existingUser[field] = body[field];
      }
    }

    await existingUser.save();

    return res.status(200).json({
      code: 200,
      message: "Record updated successfully.",
      data: existingUser,
      filePath: existingUser.employee_photo || null,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};
////
exports.getAllUserData = async (req, res) => {
  try {
    const getAllData = await User.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
    });
    return res.status(200).send({
      code: 200,
      message: "Fetched all User Successfully",
      data: getAllData,
    });
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).send({
      code: 500,
      message: "Server Error",
    });
  }
};




// exports.searchPatientByPhoto = async (req, res) => {
//     try {
//         const entity_id = req.headers["x-entity-id"];

//         if (!entity_id) {
//             return res.status(400).json({ success: false, message: "x-entity-id header is required" });
//         }

//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "Photo is required" });
//         }

//         const uploadedPhotoPath = req.file.path;

//         // Fetch all patients who have a stored face descriptor
//         const patients = await db.user.findAll({
//             where: {
//                 primary_entity_id,
//                 is_deleted: false,
//                 face_descriptor: { [Op.ne]: null }  // ← only patients with descriptors
//             },
//             // include: [
//             //     {
//             //         model: db.patient_emergency,
//             //         as: "contacts",
//             //         attributes: ["phone", "email", "is_primary"]
//             //     }
//             // ]
//         });

//         const plainPatients = user.map(p => {
//             const patient = p.toJSON();
//             const primaryContact = patient.contacts?.find(c => c.is_primary);
//             return {
//                 ...patient,
//                 primary_phone: primaryContact?.phone || null,
//                 primary_email: primaryContact?.email || null,
//                 full_name: `${patient.first_name} ${patient.last_name}`
//             };
//         });

//         // Real face matching
//         const matchedPatients = await findMatchingPatients(uploadedPhotoPath, plainPatients);

//         // Clean up uploaded file
//         fs.unlinkSync(uploadedPhotoPath);

//         if (!matchedPatients.length) {
//             return res.status(200).json({
//                 success: true,
//                 message: "No matching patient found",
//                 count: 0,
//                 data: []
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Matching patients fetched",
//             count: matchedPatients.length,
//             data: matchedPatients
//         });

//     } catch (error) {
//         console.error("Photo Search Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message || "Photo search failed"
//         });
//     }
// };


// exports.searchPatientByPhoto = async (req, res) => {
//   try {
//     // ========== FIX: Get entity_id from headers or params ==========
//     const entity_id = req.headers['x-entity-id'] || req.params.entity_id || req.query.entity_id;

//     // ========== DEBUG LOGGING ==========
//     console.log('========================================');
//     console.log('[DEBUG] Photo Search Started');
//     console.log('[DEBUG] Entity ID:', entity_id);
//     console.log('[DEBUG] Headers:', JSON.stringify(req.headers, null, 2));
//     console.log('[DEBUG] Params:', req.params);
//     console.log('[DEBUG] Query:', req.query);
//     console.log('[DEBUG] File received:', req.file ? 'Yes' : 'No');
//     console.log('[DEBUG] File name:', req.file?.originalname);
//     console.log('[DEBUG] File path:', req.file?.path);
//     console.log('[DEBUG] File size:', req.file?.size);
//     console.log('========================================');

//     // ========== VALIDATION ==========
//     if (!entity_id) {
//       console.log('[ERROR] Entity ID missing');
//       return res.status(400).json({ 
//         success: false, 
//         message: "x-entity-id header or entity_id parameter is required",
//         required: "Please provide entity_id in headers (x-entity-id) or query parameters"
//       });
//     }

//     if (!req.file) {
//       console.log('[ERROR] Photo file missing');
//       return res.status(400).json({ 
//         success: false, 
//         message: "Photo is required" 
//       });
//     }

//     const uploadedPhotoPath = req.file.path;
//     console.log('[DEBUG] Uploaded photo path:', uploadedPhotoPath);

//     // ========== CHECK DATABASE FOR EMPLOYEES WITH FACE DATA ==========
//     console.log('[DEBUG] Querying database for employees...');

//     // First, check total employees without face_descriptor condition
//     const totalEmployees = await db.user.findAll({
//       where: {
//         primary_entity_id: entity_id,
//         isDeleted: 0
//       },
//       attributes: ['employee_id', 'first_name', 'last_name', 'employee_code', 'face_descriptor']
//     });

//     console.log(`[DEBUG] Total employees found in system: ${totalEmployees.length}`);

//     const employeesWithFace = totalEmployees.filter(emp => emp.face_descriptor !== null);
//     console.log(`[DEBUG] Employees with face data: ${employeesWithFace.length}`);

//     if (totalEmployees.length === 0) {
//       console.log('[ERROR] No employees found for this entity_id');
//       return res.status(404).json({
//         success: false,
//         message: "No employees found for this entity",
//         debug: {
//           entity_id: entity_id,
//           total_employees: 0
//         }
//       });
//     }

//     if (employeesWithFace.length === 0) {
//       console.log('[ERROR] No employees with face data found');
//       console.log('[DEBUG] Sample employees without face data:', 
//         totalEmployees.slice(0, 3).map(e => ({
//           id: e.employee_id,
//           name: `${e.first_name} ${e.last_name}`,
//           has_face: e.face_descriptor ? 'Yes' : 'No'
//         }))
//       );

//       return res.status(404).json({
//         success: false,
//         message: "No employees with face data found",
//         debug: {
//           entity_id: entity_id,
//           total_employees: totalEmployees.length,
//           employees_with_face: 0,
//           sample_employees: totalEmployees.slice(0, 5).map(e => ({
//             id: e.employee_id,
//             name: `${e.first_name} ${e.last_name}`,
//             code: e.employee_code,
//             has_face: e.face_descriptor ? 'Yes' : 'No'
//           }))
//         }
//       });
//     }

//     // ========== FETCH EMPLOYEES WITH FACE DATA ==========
//     console.log('[DEBUG] Fetching full employee details with face data...');

//     const employees = await db.user.findAll({
//       where: {
//         primary_entity_id: entity_id,
//         isDeleted: 0,
//         face_descriptor: { [Op.ne]: null }
//       },
//       attributes: [
//         'employee_id', 'first_name', 'middle_name', 'last_name',
//         'employee_code', 'employee_photo', 'face_descriptor',
//         'gender', 'contact_number', 'employee_official_email',
//         'designation_id', 'department_id', 'role_master_name',
//         'status'
//       ]
//     });

//     console.log(`[DEBUG] Fetched ${employees.length} employees with face data`);

//     if (!employees || employees.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No employees with face data found"
//       });
//     }

//     // ========== FORMAT EMPLOYEE DATA ==========
//     console.log('[DEBUG] Formatting employee data...');

//     const plainEmployees = employees.map(emp => {
//       const employee = emp.toJSON();
//       return {
//         ...employee,
//         full_name: `${employee.first_name} ${employee.last_name || ''}`.trim(),
//         display_name: `${employee.first_name} ${employee.middle_name || ''} ${employee.last_name || ''}`.trim()
//       };
//     });

//     console.log(`[DEBUG] Formatted ${plainEmployees.length} employees for face matching`);
//     console.log('[DEBUG] Sample employee:', {
//       id: plainEmployees[0]?.employee_id,
//       name: plainEmployees[0]?.full_name,
//       code: plainEmployees[0]?.employee_code,
//       has_face: plainEmployees[0]?.face_descriptor ? 'Yes' : 'No'
//     });

//     // ========== FACE MATCHING ==========
//     console.log('[DEBUG] Starting face matching process...');
//     console.log('[DEBUG] Photo path:', uploadedPhotoPath);

//     let matchedEmployees = [];
//     try {
//       matchedEmployees = await findMatchingPatients(uploadedPhotoPath, plainEmployees);
//       console.log(`[DEBUG] Face matching completed. Found ${matchedEmployees.length} matches`);
//     } catch (matchError) {
//       console.error('[ERROR] Face matching failed:', matchError);
//       throw new Error(`Face matching failed: ${matchError.message}`);
//     }

//     // ========== CLEAN UP UPLOADED FILE ==========
//     if (fs.existsSync(uploadedPhotoPath)) {
//       try {
//         fs.unlinkSync(uploadedPhotoPath);
//         console.log('[DEBUG] Uploaded photo deleted:', uploadedPhotoPath);
//       } catch (unlinkError) {
//         console.error('[ERROR] Failed to delete uploaded photo:', unlinkError);
//       }
//     }

//     // ========== CHECK IF ANY MATCHES FOUND ==========
//     if (!matchedEmployees || matchedEmployees.length === 0) {
//       console.log('[DEBUG] No matching employees found');
//       return res.status(200).json({
//         success: true,
//         message: "No matching employee found",
//         count: 0,
//         data: []
//       });
//     }

//     console.log(`[DEBUG] Processing attendance for ${matchedEmployees.length} matched employees`);

//     // ========== ATTENDANCE MARKING WITH IN/OUT LOGIC ==========
//     const attendanceRecords = [];
//     const currentDate = new Date();
//     const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
//     const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

//     // Determine if today is ODD or EVEN date
//     const dayOfMonth = currentDate.getDate();
//     const isOddDate = dayOfMonth % 2 !== 0;
//     const entryType = isOddDate ? 'IN' : 'OUT';

//     console.log(`[DEBUG] Attendance Info - Date: ${currentDate.toISOString().split('T')[0]}, Day: ${dayOfMonth} (${isOddDate ? 'ODD' : 'EVEN'}), Entry: ${entryType}`);

//     for (const matchedEmployee of matchedEmployees) {
//       try {
//         console.log(`[DEBUG] Processing attendance for: ${matchedEmployee.full_name} (${matchedEmployee.employee_code})`);

//         // Check if attendance already marked for today
//         const existingAttendance = await db.daily_attendance.findOne({
//           where: {
//             employee_id: matchedEmployee.employee_id,
//             entity_id: entity_id,
//             att_date: currentDate.toISOString().split('T')[0],
//             isDeleted: 0
//           },
//           order: [['id', 'DESC']]
//         });

//         if (!existingAttendance) {
//           console.log(`[DEBUG] No existing attendance found. Creating new record...`);

//           // Create new attendance record
//           const attendanceData = {
//             att_day: dayName,
//             att_month: currentDate.getMonth() + 1,
//             att_year: currentDate.getFullYear(),
//             att_date: currentDate.toISOString().split('T')[0],
//             att_checktime: currentDate.toLocaleTimeString('en-US', {
//               hour12: true,
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit'
//             }),
//             att_time: currentDate.toISOString().slice(0, 19).replace('T', ' '),
//             job_type: 'WFO',
//             entry_type: entryType,
//             status: 'ACTIVE',
//             isDeleted: 0,
//             employee_id: matchedEmployee.employee_id,
//             entity_id: entity_id,
//             checkInloc: null,
//             checkoutloc: null,
//             att_mode: 'FACE'
//           };

//           const newAttendance = await db.daily_attendance.create(attendanceData);

//           attendanceRecords.push({
//             employee: {
//               id: matchedEmployee.employee_id,
//               name: matchedEmployee.full_name,
//               code: matchedEmployee.employee_code
//             },
//             attendance: newAttendance,
//             status: 'marked',
//             entry_type: entryType,
//             date_type: isOddDate ? 'ODD' : 'EVEN',
//             time: attendanceData.att_checktime
//           });

//           console.log(`[SUCCESS] Attendance marked ${entryType} for ${matchedEmployee.full_name}`);

//         } else {
//           console.log(`[DEBUG] Existing attendance found. ID: ${existingAttendance.id}`);

//           // Check if entry_type matches current rule
//           const currentEntryType = existingAttendance.entry_type;

//           if (currentEntryType !== entryType) {
//             console.log(`[DEBUG] Updating entry type from ${currentEntryType} to ${entryType}`);

//             // Update the entry type based on date rule
//             await existingAttendance.update({
//               entry_type: entryType,
//               att_checktime: currentDate.toLocaleTimeString('en-US', {
//                 hour12: true,
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 second: '2-digit'
//               }),
//               att_time: currentDate.toISOString().slice(0, 19).replace('T', ' '),
//               att_mode: 'ONLINE'
//             });

//             attendanceRecords.push({
//               employee: {
//                 id: matchedEmployee.employee_id,
//                 name: matchedEmployee.full_name,
//                 code: matchedEmployee.employee_code
//               },
//               attendance: existingAttendance,
//               status: 'updated',
//               entry_type: entryType,
//               date_type: isOddDate ? 'ODD' : 'EVEN',
//               previous_entry: currentEntryType,
//               time: currentDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })
//             });

//             console.log(`[SUCCESS] Attendance updated to ${entryType} for ${matchedEmployee.full_name}`);

//           } else {
//             console.log(`[DEBUG] Attendance already marked with ${currentEntryType}`);

//             attendanceRecords.push({
//               employee: {
//                 id: matchedEmployee.employee_id,
//                 name: matchedEmployee.full_name,
//                 code: matchedEmployee.employee_code
//               },
//               attendance: existingAttendance,
//               status: 'already_marked',
//               entry_type: currentEntryType,
//               date_type: isOddDate ? 'ODD' : 'EVEN',
//               marked_at: existingAttendance.att_checktime
//             });
//           }
//         }
//       } catch (empError) {
//         console.error(`[ERROR] Failed to process attendance for employee ${matchedEmployee.employee_id}:`, empError);
//         attendanceRecords.push({
//           employee: {
//             id: matchedEmployee.employee_id,
//             name: matchedEmployee.full_name,
//             code: matchedEmployee.employee_code
//           },
//           error: empError.message,
//           status: 'failed'
//         });
//       }
//     }

//     // ========== RESPONSE ==========
//     console.log('[DEBUG] Attendance processing complete. Sending response...');
//     console.log('[DEBUG] Summary:', {
//       total: matchedEmployees.length,
//       marked: attendanceRecords.filter(r => r.status === 'marked').length,
//       updated: attendanceRecords.filter(r => r.status === 'updated').length,
//       already_marked: attendanceRecords.filter(r => r.status === 'already_marked').length,
//       failed: attendanceRecords.filter(r => r.status === 'failed').length
//     });

//     return res.status(200).json({
//       success: true,
//       message: `Attendance processed with ${entryType} (${isOddDate ? 'ODD' : 'EVEN'} date)`,
//       summary: {
//         total_matched: matchedEmployees.length,
//         marked: attendanceRecords.filter(r => r.status === 'marked').length,
//         updated: attendanceRecords.filter(r => r.status === 'updated').length,
//         already_marked: attendanceRecords.filter(r => r.status === 'already_marked').length,
//         failed: attendanceRecords.filter(r => r.status === 'failed').length
//       },
//       date_info: {
//         date: currentDate.toISOString().split('T')[0],
//         day: dayOfMonth,
//         type: isOddDate ? 'ODD' : 'EVEN',
//         entry_type: entryType,
//         day_name: dayName
//       },
//       matched_employees: matchedEmployees.map(emp => ({
//         id: emp.employee_id,
//         name: emp.full_name,
//         code: emp.employee_code,
//         designation: emp.role_master_name || 'N/A'
//       })),
//       attendance: attendanceRecords
//     });

//   } catch (error) {
//     console.error("========================================");
//     console.error("[ERROR] Photo Search Error:", error);
//     console.error("[ERROR] Stack trace:", error.stack);
//     console.error("========================================");

//     // Clean up uploaded file if exists
//     if (req.file && fs.existsSync(req.file.path)) {
//       try {
//         fs.unlinkSync(req.file.path);
//         console.log('[DEBUG] Cleaned up uploaded file:', req.file.path);
//       } catch (unlinkError) {
//         console.error('[ERROR] Error cleaning up file:', unlinkError);
//       }
//     }

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Photo search failed",
//       error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
//       debug: process.env.NODE_ENV === 'development' ? {
//         entity_id: req.headers['x-entity-id'] || req.params.entity_id,
//         file_received: !!req.file,
//         file_name: req.file?.originalname
//       } : undefined
//     });
//   }
// };

exports.searchPatientByPhoto = async (req, res) => {
  let uploadedPhotoPath;

  try {
    const entity_id = req.headers['x-entity-id'] || req.params.entity_id || req.query.entity_id;

    if (!entity_id) {
      return res.status(400).json({
        success: false,
        message: "x-entity-id header or entity_id parameter is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Photo is required" });
    }

    uploadedPhotoPath = req.file.path;

    // ========== FETCH EMPLOYEES WITH FACE DATA ==========
    const employees = await db.user.findAll({
      where: {
        primary_entity_id: entity_id,
        isDeleted: 0,
        face_descriptor: { [Op.ne]: null }
      },
      attributes: [
        'employee_id', 'first_name', 'middle_name', 'last_name',
        'employee_code', 'employee_photo', 'face_descriptor',
        'gender', 'contact_number', 'employee_official_email',
        'designation_id', 'department_id', 'role_master_name',
        'status'
      ],
      raw: true
    });

    if (!employees || employees.length === 0) {
      const anyEmployee = await db.user.findOne({
        where: { primary_entity_id: entity_id, isDeleted: 0 },
        attributes: ['employee_id']
      });

      if (uploadedPhotoPath && fs.existsSync(uploadedPhotoPath)) {
        fs.unlinkSync(uploadedPhotoPath);
      }

      return res.status(404).json({
        success: false,
        message: anyEmployee
          ? "No employees with face data found"
          : "No employees found for this entity"
      });
    }

    const plainEmployees = employees.map(emp => ({
      ...emp,
      full_name: `${emp.first_name} ${emp.last_name || ''}`.trim(),
      display_name: `${emp.first_name} ${emp.middle_name || ''} ${emp.last_name || ''}`.trim()
    }));

    console.log(`[DEBUG] Matching against ${plainEmployees.length} employees with face data`);

    // ========== FACE MATCHING ==========
    let matchedEmployees;
    try {
      matchedEmployees = await findMatchingPatients(uploadedPhotoPath, plainEmployees);
    } catch (matchError) {
      console.error('[ERROR] Face matching failed:', matchError);
      
      if (uploadedPhotoPath && fs.existsSync(uploadedPhotoPath)) {
        fs.unlinkSync(uploadedPhotoPath);
      }
      
      return res.status(500).json({
        success: false,
        message: `Face matching failed: ${matchError.message}`,
        error: process.env.NODE_ENV === 'development' ? matchError.stack : undefined
      });
    }

    // ========== CLEAN UP UPLOADED FILE ==========
    if (uploadedPhotoPath && fs.existsSync(uploadedPhotoPath)) {
      fs.unlink(uploadedPhotoPath, (err) => {
        if (err) console.error('[ERROR] Failed to delete uploaded photo:', err);
      });
    }

    if (!matchedEmployees || matchedEmployees.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No matching employee found",
        count: 0,
        data: []
      });
    }

    // ========== DATE INFO ==========
    const currentDate = new Date();
    const todayDateStr = currentDate.toISOString().split('T')[0];
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayOfMonth = currentDate.getDate();
    const checkTime = currentDate.toLocaleTimeString('en-US', {
      hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const attTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // ========== GET EXISTING RECORDS FOR EACH EMPLOYEE ==========
    const matchedIds = matchedEmployees.map(e => e.employee_id);

    const existingRecords = await db.daily_attendance.findAll({
      where: {
        employee_id: { [Op.in]: matchedIds },
        entity_id,
        att_date: todayDateStr,
        isDeleted: 0
      },
      order: [['att_time', 'ASC']]
    });

    // Group records by employee
    const recordsMap = new Map();
    for (const rec of existingRecords) {
      if (!recordsMap.has(rec.employee_id)) {
        recordsMap.set(rec.employee_id, []);
      }
      recordsMap.get(rec.employee_id).push(rec);
    }

    // ========== 🔥 CREATE NEW ENTRY FOR EVERY VERIFY ==========
    const attendanceRecords = [];
    
    for (const matchedEmployee of matchedEmployees) {
      try {
        const base = {
          id: matchedEmployee.employee_id,
          name: matchedEmployee.full_name,
          code: matchedEmployee.employee_code
        };

        // Get today's records for this employee
        const employeeRecords = recordsMap.get(matchedEmployee.employee_id) || [];
        const totalEntriesToday = employeeRecords.length + 1;

        // 🎯 SEQUENTIAL IN/OUT LOGIC
        // 1st entry = IN, 2nd = OUT, 3rd = IN, 4th = OUT, 5th = IN...
        const isOdd = totalEntriesToday % 2 !== 0;
        const entryType = isOdd ? 'IN' : 'OUT';

        console.log(`[${matchedEmployee.full_name}] Entry #${totalEntriesToday} (${isOdd ? 'ODD' : 'EVEN'}) → ${entryType}`);

        // 🔥 CREATE NEW RECORD (Update nahi, hamesha create)
        const newAttendance = await db.daily_attendance.create({
          att_day: dayName,
          att_month: currentDate.getMonth() + 1,
          att_year: currentDate.getFullYear(),
          att_date: todayDateStr,
          att_checktime: checkTime,
          att_time: attTime,
          job_type: 'WFO',
          entry_type: entryType,
          status: 'ACTIVE',
          isDeleted: 0,
          employee_id: matchedEmployee.employee_id,
          entity_id,
          checkInloc: null,
          checkoutloc: null,
          att_mode: 'FACE'
        });

        // Add to records map
        employeeRecords.push(newAttendance);
        recordsMap.set(matchedEmployee.employee_id, employeeRecords);

        // Count IN and OUT for today
        const todayIN = employeeRecords.filter(r => r.entry_type === 'IN').length;
        const todayOUT = employeeRecords.filter(r => r.entry_type === 'OUT').length;

        attendanceRecords.push({
          employee: base,
          attendance: {
            id: newAttendance.id,
            entry_type: newAttendance.entry_type,
            att_date: newAttendance.att_date,
            att_checktime: newAttendance.att_checktime,
            att_time: newAttendance.att_time,
            status: newAttendance.status
          },
          status: 'marked',
          entry_type: entryType,
          entry_number: totalEntriesToday,
          sequence: isOdd ? 'ODD → IN' : 'EVEN → OUT',
          time: checkTime,
          today_in_count: todayIN,
          today_out_count: todayOUT,
          total_entries_today: totalEntriesToday,
          match_score: matchedEmployee.match_score || null,
          distance: matchedEmployee.distance || null
        });

        console.log(`✅ ${entryType} CREATED for ${matchedEmployee.full_name} (Entry #${totalEntriesToday})`);

      } catch (empError) {
        console.error(`[ERROR] Failed for ${matchedEmployee.employee_code}:`, empError);
        
        attendanceRecords.push({
          employee: {
            id: matchedEmployee.employee_id,
            name: matchedEmployee.full_name,
            code: matchedEmployee.employee_code
          },
          error: empError.message || 'Failed to create attendance',
          status: 'failed'
        });
      }
    }

    // ========== RESPONSE ==========
    const successCount = attendanceRecords.filter(r => r.status === 'marked').length;
    const failedCount = attendanceRecords.filter(r => r.status === 'failed').length;

    return res.status(200).json({
      success: true,
      message: `Attendance processed: ${successCount} created, ${failedCount} failed`,
      summary: {
        total_matched: matchedEmployees.length,
        created: successCount,
        failed: failedCount,
        mode: 'SEQUENTIAL_IN_OUT'
      },
      date_info: {
        date: todayDateStr,
        day: dayOfMonth,
        day_name: dayName,
        time: checkTime
      },
      matched_employees: matchedEmployees.map(emp => ({
        id: emp.employee_id,
        name: emp.full_name,
        code: emp.employee_code,
        designation: emp.role_master_name || 'N/A',
        match_score: emp.match_score || null
      })),
      attendance: attendanceRecords
    });

  } catch (error) {
    console.error("[ERROR] Photo Search Error:", error);

    if (uploadedPhotoPath && fs.existsSync(uploadedPhotoPath)) {
      try {
        fs.unlinkSync(uploadedPhotoPath);
      } catch (unlinkError) {
        console.error('[ERROR] Error cleaning up file:', unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Photo search failed",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// SSO TOKEN GENERATOR FOR ERP
exports.generateSsoToken = async (req, res) => {
  try {
    const { employee_id, email } = req.body;
    if (!employee_id) {
      return res.status(400).json({ success: false, message: "employee_id is required" });
    }

    const ssoToken = jwt.sign(
      {
        employee_id,
        email: email || "",
        type: "SSO_ERP",
      },
      config.secret,
      { expiresIn: "60s" }
    );

    return res.status(200).json({
      success: true,
      ssoToken,
    });
  } catch (error) {
    console.error("[SSO] Error generating SSO token:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate SSO token",
    });
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

    if (decoded.type !== "SSO_HRMS" || !decoded.employee_id) {
      return res.status(400).send({ code: 400, message: "Invalid token payload for SSO" });
    }

    const user = await db.user_login.findOne({
      where: {
        employee_id: decoded.employee_id,
        status: "ACTIVE",
      },
    });

    if (!user) {
      return res.status(404).send({ code: 404, message: "User not found or inactive" });
    }

    const authToken = jwt.sign({ id: user.employee_id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    const entitydata = `SELECT ue.entity_id,em.entity_name,em.logo,em.company_branch FROM HRMS_REGISTERED_USERS_ENTITY AS ue
  INNER JOIN ENTITY_MASTER AS em ON em.id=ue.entity_id
  INNER JOIN MASTER_BRANCH AS mb ON mb.id = em.branch_id
  INNER JOIN COMPANY_DETAILS_MASTER AS cdm ON cdm.id = em.company_id
  WHERE ue.employee_id=${user.employee_id} AND ue.status="ACTIVE" AND em.status="ACTIVE" AND em.isDeleted=0`;
    const entityList = await db.sequelize.query(entitydata, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const employeeDetail = await User.findOne({
      where: { employee_id: user.employee_id },
    });

    const roleMenuAccessId = parseInt(user.employee_id);
    const role_master_id = parseInt(user.role_master_id);
    const entity_id = parseInt(user.primary_entity_id);

    const getData = await db.sequelize.query(
      `SELECT rma.role_module_master_id,
  rma.role_module_master_completed,
  rma.menu_master_id, 
  rma.submenu_master_id, 
  rma.menu_completed, 
  rma.submenu_completed,
  rma.role_master_id,  
  rma.employee_id, 
  rmm.role_module_master_id,
  rmm.role_module_master_name,
  rmm.module_master_link,
  rmm.module_master_icon,
  rmm.module_master_endIcon,
  sm.submenu_master_id,
  mm.menu_master_id,
  mm.menu_master_name,
  mm.menu_title,
  mm.menu_masters_icon,
  mm.menu_master_link,
  mm.menu_master_lastIcon,
  sm.submenu_masters_link,
  sm.submenu_masters_icon,
  sm.submenu_master_name
  FROM HRMS_RBAC_ROLE_MODULE_MASTER rmm
  LEFT JOIN HRMS_RBAC_MENU_MASTER mm ON rmm.role_module_master_id = mm.role_module_master_id
  LEFT JOIN HRMS_RBAC_SUBMENU_MASTER sm ON mm.menu_master_id=sm.menu_master_id
  LEFT JOIN HRMS_RBAC_ROLE_MENU_ACCESS rma ON (rma.role_module_master_id = rmm.role_module_master_id OR rma.role_module_master_id IS NULL) AND 
  (rma.menu_master_id = mm.menu_master_id OR rma.menu_master_id IS NULL) AND 
  (rma.submenu_master_id = sm.submenu_master_id OR rma.submenu_master_id IS NULL) 
  AND rma.employee_id = ${roleMenuAccessId} AND rma.role_master_id = ${role_master_id} AND rma.entity_id = ${entity_id};`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    let uniqueData = (getData || []).map((item) => item.menu_master_id);
    uniqueData = [...new Set(uniqueData)];

    let uniqueDataInf = (getData || []).map(
      (index) => index.role_module_master_id
    );
    uniqueDataInf = [...new Set(uniqueDataInf)];

    const maindata = [];
    const Data = [];

    uniqueData.forEach((element) => {
      let data = getData.filter((obj) => obj.menu_master_id == element);
      for (let i of data) {
        i.role_module_master_completed =
          i.role_module_master_completed == 1;
        i.menu_completed = i.menu_completed == 1;
        i.submenu_completed = i.submenu_completed == 1;
      }

      let object = {
        role_menu_access_id: data[0].role_menu_access_id,
        employee_id: data[0].employee_id,
        role_module_master_id: data[0].role_module_master_id,
        role_module_master_name: data[0].role_module_master_name,
        role_module_master_completed:
          data[0].role_module_master_completed,
        menu_master_id: data[0].menu_master_id,
        menu_master_name: data[0].menu_master_name,
        menu_title: data[0].menu_title,
        menu_masters_icon: data[0].menu_masters_icon,
        menu_master_link: data[0].menu_master_link,
        menu_master_lastIcon: data[0].menu_master_lastIcon,
        menu_completed: data[0].menu_completed,
        status: data[0].status,
        HRMS_RBAC_SUBMENU_MASTER: data,
      };
      Data.push(object);
    });

    uniqueDataInf.forEach((index) => {
      let data2 = Data.filter(
        (obj) => obj.role_module_master_id == index
      );

      let parentObj = {
        role_module_master_id: data2[0].role_module_master_id,
        role_module_master_name: data2[0].role_module_master_name,
        role_module_master_completed:
          data2[0].role_module_master_completed,
        menu_masters_icon: data2[0].menu_masters_icon,
        menu_master_link: data2[0].menu_master_link,
        menu_master_lastIcon: data2[0].menu_master_lastIcon,
        HRMS_RBAC_MENU_MASTER: data2,
      };
      maindata.push(parentObj);
    });

    let filterSuperModules = maindata.filter(
      (e) => e.role_module_master_completed === true
    );
    for (let i = 0; i < filterSuperModules.length; i++) {
      let subSuperModule = filterSuperModules[i].HRMS_RBAC_MENU_MASTER;
      let filterSubSuperModule = subSuperModule.filter(
        (e) => e.menu_completed === true
      );
      var subSuperModulelength = filterSuperModules.length;
      subSuperModule.length = 0;
      subSuperModule.push(...filterSubSuperModule);

      for (let j = 0; j < subSuperModule.length; j++) {
        let subModule = subSuperModule[j].HRMS_RBAC_SUBMENU_MASTER;
        let filterSubModule = subModule.filter(
          (e) => e.submenu_completed === true
        );
        subModule.length = 0;
        subModule.push(...filterSubModule);
      }
    }

    return res.status(200).send({
      employee_official_email: user.employee_official_email,
      employee_photo: user.employee_photo,
      first_name: user.first_name,
      last_name: user.last_name,
      employee_id: user.employee_id,
      roles: user.role_master_name,
      role_master_id: user.role_master_id,
      designation_id: employeeDetail?.designation_id,
      department_id: employeeDetail?.department_id,
      accessToken: authToken,
      role_menu_access_data: filterSuperModules,
      subSuperModulelength: subSuperModulelength,
      primary_entity_id: user.primary_entity_id,
      entityList: entityList,
      primary_branch_id: employeeDetail?.primary_branch_id,
    });
  } catch (err) {
    console.error("SSO Login Error:", err);
    return res.status(500).send({ code: 500, message: err.message });
  }
};