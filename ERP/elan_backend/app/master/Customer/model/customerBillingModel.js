module.exports = (sequelize, Sequelize) => {
    const customerBilling = sequelize.define(
      "CUSTOMER_CONTACT_BILLING_MST",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        full_billing_add:{
          type: Sequelize.TEXT
        },
        full_billing_land_add:{
          type: Sequelize.TEXT
        },
        billing_loc_code: {
          type: Sequelize.STRING
        },
        billing_pin_code: {
          type: Sequelize.STRING
        },
        billing_mobile_no1: {
          type: Sequelize.STRING
        },
        billing_mobile_no2: {
          type: Sequelize.STRING
        },
        billing_mobile_no3: {
          type: Sequelize.STRING
        },
        land_line_no: {
          type: Sequelize.STRING
        },
        billing_email_id1: {
          type: Sequelize.STRING
        },
        billing_email_id2: {
          type: Sequelize.STRING
        },
        billing_email_id3: {
          type: Sequelize.STRING
        },
       
        tds_app: {
          type: Sequelize.ENUM("Yes", "No"),
        },
        tcs_app: {
            type: Sequelize.ENUM("Yes", "No"),
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
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
    return customerBilling;
  };