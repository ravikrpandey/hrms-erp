module.exports = (sequelize, Sequelize) => {
    const customerBank = sequelize.define(
      "CUSTOMER_CONTACT_BANK_DETAILS_MST",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        payment_terms: {
            type: Sequelize.ENUM("ADVANCE PAYMENT", "30 DAYS", "60 DAYS", "90 DAYS"),
        },
        credit_limit:{
          type: Sequelize.STRING
        },
        internal_credit_limit:{
          type: Sequelize.STRING
        },
        credit_days: {
          type: Sequelize.STRING
        },
        grace_period: {
          type: Sequelize.STRING
        },
        bank_name: {
          type: Sequelize.STRING
        },
        bank_branch: {
          type: Sequelize.STRING
        },
        bank_ac_num: {
          type: Sequelize.STRING
        },
        swift_code: {
          type: Sequelize.STRING
        },
        ifsc_code: {
          type: Sequelize.STRING
        },
        interest: {
          type: Sequelize.ENUM("Yes", "No"),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        is_Deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      },
  
      {
        freezeTableName: true,
      }
    );
    return customerBank;
  };