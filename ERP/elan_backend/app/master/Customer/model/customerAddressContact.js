module.exports = (sequelize, Sequelize) => {
    const customerAddressContact = sequelize.define(
      "CUSTOMER_ADDRESS_CONTACT_MST",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        contact_person_name: {
          type: Sequelize.STRING
        },
        mobile: {
          type: Sequelize.STRING,
          unique: true
        },
        email_id: {
          type: Sequelize.STRING,
          unique: true
        },
        designation: {
          type: Sequelize.STRING
        },
        department: {
          type: Sequelize.STRING
        },  
        title: {
          type: Sequelize.STRING
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE", 'BLACKLISTED'),
          defaultValue: "ACTIVE",
        },
        is_Deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        OTP: {
            type: Sequelize.INTEGER,
        },
        OTPupdatedAt: {
            type: Sequelize.DATE,
        },
      },
  
      {
        freezeTableName: true,
      }
    );
    return customerAddressContact;
  };