const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const versionData = sequelize.define(
    "CRM_VERSION_PROPOSAL_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      version:{
        type: Sequelize.STRING
      },
      version_status:{
        type: Sequelize.ENUM('approved','pending','reject'),
        defaultValue: 'pending'
      },
      is_version_status:{
        type: Sequelize.ENUM('Sales Booking','PI','Quotation')
      
      },
      is_sales_booking_version:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_so_created:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_booking_created:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_quotation_created:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_version_approvel_status:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      follow_up_date: {
        type: Sequelize.DATEONLY,
    },
    is_same_as_shipping: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
  },
    exchange_rate: {
      type: Sequelize.FLOAT,      
  },
    is_pi_created: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
  },
    is_discount_requested: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
  }
    },
    
    {
      freezeTableName: true,
    }
  );
  return versionData;
};