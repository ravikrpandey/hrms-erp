module.exports = (sequelize, Sequelize) => {
  const userModels = sequelize.define("HRMS_REGISTERED_USER", {
    employee_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      defaultValue: "--"
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
    // contact_detail: {
    //   type: Sequelize.STRING,
    // },
    // role_master_name: {
    //   type: Sequelize.STRING,
    // },
    // reporting_manager: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    employee_official_email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    employee_photo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ONBOARDED"),
      defaultValue: "ACTIVE"
    },

    // Personal details start
    // present_address: {
    //   type: Sequelize.TEXT,
    // },

    // address_check_value: {
    //   type: Sequelize.STRING,
    // },
    // parmanent_address: {
    //   type: Sequelize.TEXT,
    // },
    // DIRE_number: {
    //   type: Sequelize.STRING,
    // },
    // driving_license_number: {
    //   type: Sequelize.STRING,
    // },
    // blood_group: {
    //   type: Sequelize.STRING,
    // },
    // id_number: {
    //   type: Sequelize.STRING,
    // },
    // issued_date: {
    //   type: Sequelize.STRING,
    // },
    // exp_date: {
    //   type: Sequelize.STRING,
    // },
    // tax_number: {
    //   type: Sequelize.STRING,
    // },
    // passport_number: {
    //   type: Sequelize.STRING,
    // },
    marital_status: {
      type: Sequelize.STRING,
    },
    // spouse_name: {
    //   type: Sequelize.STRING,
    // },

    // Salary details start
    // basic_salary: {
    //   type: Sequelize.INTEGER,
    // },
    // salary_per_day: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true
    // },
    // salary_per_hr: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true
    // },
    // total_monthly_hr: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true
    // },
    // weekly_hour: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true
    // },

    // epf_type: {
    //   type: Sequelize.ENUM("FORM_11", "PF", "NA"),
    // },

    // Payment details start
    // employee_name_in_bank: {
    //   type: Sequelize.STRING,
    //   allowNull: true
    // },
    // bank_address: {
    //   type: Sequelize.TEXT,
    //   allowNull: true
    // },
    // account_number: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true
    // },
    // pf_account_number: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    // UAN_number: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true,
    //   defaultValue: 0 
    // },
    // ifsc_code: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true,
    //   defaultValue: 0
    // },
    // ESIC_number: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true,
    //   defaultValue: 0
    // },
    // emp_pan_card: {
    //   type: Sequelize.STRING,
    // },
    // emp_adhar_card_number: {
    //   type: Sequelize.STRING,
    // },
    // emirates_id_number: {
    //   type: Sequelize.STRING,
    // },
    // re_enter_account_no: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true
    // },
    // nuit_number: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true
    // },
    // inss_number: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true
    // },
    // bank_nib_number: {
    //   type: Sequelize.BIGINT,
    //   allowNull: true
    // },

    // Contract details start
    start_working_date: {
      type: Sequelize.DATEONLY("YYYY-MM-DD"),
    },
    end_date_probation: {
      type: Sequelize.DATEONLY("YYYY-MM-DD"),
    },

    // Extra start
    // user_type: {
    //   type: Sequelize.ENUM("normal", "login"),
    //   defaultValue: "normal",
    // },
    isDeleted: {
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
    },
    forceReset: {
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
    },
    OTP: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
  },
    {
      freezeTableName: true,
    });
  return userModels;
};