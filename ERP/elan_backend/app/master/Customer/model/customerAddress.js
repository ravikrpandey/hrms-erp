module.exports = (sequelize, Sequelize) => {
    const customerBilling = sequelize.define(
      "CUSTOMER_ADDRESS_MST",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        billing_address:{
          type: Sequelize.TEXT
        },
        billing_pin_code:{
            type:Sequelize.STRING
        },
        billing_postal_address:{
            type:Sequelize.STRING
        },
        shipping_address:{
          type: Sequelize.TEXT
        },
        shipping_pin_code:{
            type:Sequelize.STRING
        },
        shipping_postal_address:{
            type:Sequelize.STRING
        },
        gst_category:{
            type:Sequelize.STRING
        },
        gst_in:{
            type:Sequelize.STRING
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


  