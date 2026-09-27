module.exports = (sequelize, Sequelize) => {
  const customerAddress = sequelize.define(
    "CUSTOMER_ADDRESS_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // billing_city_id: {
      //   type: Sequelize.STRING
      // },
      // billing_state_id: {
      //   type: Sequelize.STRING
      // },
      // billing_country_id: {
      //   type: Sequelize.STRING
      // },
      billing_pin_code: {
        type: Sequelize.STRING
      },
      billing_address: {
        type: Sequelize.STRING
      },
      // shipping_city_id: {
      //   type: Sequelize.STRING
      // },
      // shipping_state_id: {
      //   type: Sequelize.STRING
      // },
      // shipping_country_id: {
      //   type: Sequelize.STRING
      // },
      shipping_pin_code: {
        type: Sequelize.STRING
      },
      shipping_address: {
        type: Sequelize.STRING
      },
      
      // customer_id: {
      //   type: Sequelize.STRING
      // },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", 'BLACKLISTED'),
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
  return customerAddress;
};