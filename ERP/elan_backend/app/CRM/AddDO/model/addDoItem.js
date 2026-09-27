const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const addDoItem = sequelize.define(
    "CRM_ADD_DO_ITEMS_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      qty:{
        type: Sequelize.INTEGER
      },
      price_per_unit:{
        type: Sequelize.INTEGER,
      },
      // gst_type:{
      //   type: Sequelize.STRING,
      // },
      cgst:{
        type: Sequelize.STRING
      },
      sgst:{
        type: Sequelize.STRING,
      },
      igst:{
        type: Sequelize.STRING,
      },
      discount_request:{
        type: Sequelize.INTEGER
      },
      maximum_discount:{
        type: Sequelize.INTEGER
      },
      status:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
      },
      sales_status:{
        type:Sequelize.ENUM('approved','pending'),
        defaultValue: 'pending'
      }
    },
    
    {
      freezeTableName: true,
    }
  );
  return addDoItem;
};