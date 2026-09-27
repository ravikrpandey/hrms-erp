const { boolean } = require("mathjs");
const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const supplyType = sequelize.define(
    "CRM_SUPPLY_TYPE_MST",
    {
      id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true,
      },
      name:{
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      code: {
        type: Sequelize.STRING,
      },
      status:{type:Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue:'ACTIVE'
      },
 isDeleted:{
    type:Sequelize.BOOLEAN
 }
    },
    {
      freezeTableName: true,
    }
  );
  return supplyType;
};