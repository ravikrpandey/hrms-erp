const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const customerComplain = sequelize.define(
    "CRMS_REGISTER_COMPLAIN",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      complain_ID:{
        type:Sequelize.STRING,
      },
      city_id:{
        type:Sequelize.STRING,
      },
      system_serial_no:{
        type:Sequelize.STRING,
      },
      customer_mobile_no:{
        type:Sequelize.STRING,
      },
      customer_name:{
        type:Sequelize.STRING,
      },
      issue:{
        type:Sequelize.STRING,
      },
      address:{
        type:Sequelize.STRING,
      },
      issue_details:{
        type:Sequelize.STRING,
      },
      system_type:{
        type:Sequelize.STRING,
      },
      system_rating:{
        type:Sequelize.STRING,
      },
      alt_mobile_no:{
        type:Sequelize.STRING,
      },
      bill_uploaded:{
        type: Sequelize.STRING,
      },
      system_display_audio:{
        type: Sequelize.STRING,
      },
      priority:{
        type: Sequelize.ENUM("High", "Medium","Low"),
        defaultValue: "Low"
      },
      complaint_type:{
        type: Sequelize.ENUM("AMC","NON-AMC"),
      },
      brand:{
        type: Sequelize.STRING,
      },
      system_installation_date: {
        type: Sequelize.DATE,
      },      
      service_charge_cpplicable:{
        type:Sequelize.STRING,
      },
      in_warranty:{
        type: Sequelize.ENUM("Yes", "No"),
        defaultValue: "No"
      },
      blacklist_hold:{
        type: Sequelize.ENUM("Blacklist", "Hold"),
        defaultValue: null
      },
      document:{
        type:Sequelize.STRING,
      },
      complain_status: {
        type: Sequelize.STRING,
      },
      collection:{
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      collection_status:{
        type: Sequelize.ENUM("True", "False"),
        defaultValue: "False"
      },
      collection_date:{
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      }
    },
    
    {
      freezeTableName: true,
    }
  );
  return customerComplain;
};