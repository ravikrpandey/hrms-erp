module.exports = (sequelize, Sequelize) => {
    const customerDelivery = sequelize.define(
      "CUSTOMER_CONTACT_DELIVERY_MST",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        full_delivery_add:{
          type: Sequelize.TEXT
        },
        delivery_loc_code:{
          type: Sequelize.STRING
        },
        full_delivery_land_add:{
          type: Sequelize.TEXT
        },
        delivery_pin_code: {
          type: Sequelize.STRING
        },
        delivery_mobile_no1: {
          type: Sequelize.STRING
        },
        delivery_mobile_no2: {
          type: Sequelize.STRING
        },
        delivery_mobile_no3: {
          type: Sequelize.STRING
        },
        delivery_land_line_no: {
          type: Sequelize.STRING
        },
        delivery_email_id1: {
          type: Sequelize.STRING
        },
        delivery_email_id2: {
          type: Sequelize.STRING
        },
        delivery_email_id3: {
          type: Sequelize.STRING
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
    return customerDelivery;
  };