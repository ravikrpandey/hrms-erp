module.exports = (sequelize, Sequelize) => {
  const userModels = sequelize.define(
    "HRMS_REGISTERED_USER",
    {
      employee_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Basic detail start
      title: {
        type: Sequelize.STRING,
      },
      employee_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      middle_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "--",
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY("YYYY-MM-DD"),
      },
      emp_personal_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country_code: {
        type: Sequelize.STRING,
      },
      role_master_name: {
        type: Sequelize.STRING,
      },
      reporting_manager: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approval_manager: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      work_from_country: {
        type: Sequelize.STRING,
      },
      emp_join_date: {
        type: Sequelize.DATEONLY("YYYY-MM-DD"),
      },
      emp_probation_date: {
        type: Sequelize.DATEONLY("YYYY-MM-DD"),
      },
      official_contact_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      official_country_code: {
        type: Sequelize.STRING,
      },
      pf_account_number: {
        type: Sequelize.STRING,
      },
      UAN_number: {
        type: Sequelize.STRING,
      },
      ESIC_number: {
        type: Sequelize.STRING,
      },
      employee_official_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employee_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ONBOARDED"),
        defaultValue: "ACTIVE",
      },

      // Personal details start
      present_address: {
        type: Sequelize.TEXT,
      },

      address_check_value: {
        type: Sequelize.STRING,
      },
      parmanent_address: {
        type: Sequelize.TEXT,
      },
      DIRE_number: {
        type: Sequelize.STRING,
      },
      driving_license_number: {
        type: Sequelize.STRING,
      },
      blood_group: {
        type: Sequelize.STRING,
      },
      id_number: {
        type: Sequelize.STRING,
      },
      issued_date: {
        type: Sequelize.STRING,
      },
      exp_date: {
        type: Sequelize.STRING,
      },
      tax_number: {
        type: Sequelize.STRING,
      },
      passport_number: {
        type: Sequelize.STRING,
      },
      marital_status: {
        type: Sequelize.STRING,
      },
      spouse_name: {
        type: Sequelize.STRING,
      },
      emp_pan_card: {
        type: Sequelize.STRING,
      },
      emp_adhar_card_number: {
        type: Sequelize.STRING,
      },
      emp_medical_condition: {
        type: Sequelize.STRING,
      },
      visa_number: {
        type: Sequelize.STRING,
      },
      emirates_id_number: {
        type: Sequelize.STRING,
      },
      labour_card_number: {
        type: Sequelize.STRING,
      },
      labour_card_number_exp_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      visa_number_exp_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      eid: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      eid_exp_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      // Salary details start
      basic_salary: {
        type: Sequelize.INTEGER,
      },
      salary_per_day: {
        type: Sequelize.INTEGER,
      },
      salary_per_hr: {
        type: Sequelize.INTEGER,
      },
      total_monthly_hr: {
        type: Sequelize.INTEGER,
      },
      weekly_hour: {
        type: Sequelize.INTEGER,
      },

      // Payment details start
      employee_name_in_bank: {
        type: Sequelize.STRING,
      },
      bank_address: {
        type: Sequelize.TEXT,
      },
      account_number: {
        type: Sequelize.STRING,
      },
      re_enter_account_no: {
        type: Sequelize.STRING,
      },
      ifsc_code: {
        type: Sequelize.STRING,
      },
      swift_code: {
        type: Sequelize.STRING,
      },
      iban_number: {
        type: Sequelize.STRING,
      },
      nuit_number: {
        type: Sequelize.BIGINT,
      },
      bank_district_name: {
        type: Sequelize.STRING,
      },
      inss_number: {
        type: Sequelize.BIGINT,
      },
      bank_document: {
        type: Sequelize.STRING,
      },
      attached_with_payroll: {
        type: Sequelize.ENUM("MAIN", "ALTERNATE"),
        defaultValue: "MAIN",
      },
      alt_account_holdname: {
        type: Sequelize.STRING(100),
      },
      alt_bank_address: {
        type: Sequelize.TEXT,
      },
      alt_account_number: {
        type: Sequelize.STRING,
      },
      alt_re_enter_number: {
        type: Sequelize.STRING,
      },
      alt_IFSC_code: {
        type: Sequelize.STRING,
      },
      alt_bank_document: {
        type: Sequelize.STRING,
      },
      face_descriptor: {
        type: Sequelize.TEXT,
      },
      
      // Contract details start
      start_working_date: {
        type: Sequelize.DATEONLY("YYYY-MM-DD"),
      },
      end_date_probation: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true,
      },
      epf_type: {
        type: Sequelize.ENUM("FORM_11", "PF", "NA"),
      },

      // Extra start
      user_type: {
        type: Sequelize.ENUM("normal", "login"),
        defaultValue: "normal",
      },
      tab_type: {
        type: Sequelize.ENUM(
          "Basic",
          "Personal",
          "Salary",
          "Payment",
          "Document",
          "Contract"
        ),
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      // isOverTimeApplicable: {
      //   type: Sequelize.BOOLEAN(true, false),
      //   defaultValue: false,
      // },
      isHandiCap: {
        type: Sequelize.BOOLEAN(true, false), 
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return userModels;
};
