const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const dynamicFieldName = sequelize.define(
    "DYNAMIC_FIELD_NAME",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dynamic_field_name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      mandatory: {
        type: Sequelize.ENUM('ACTIVE','INACTIVE'),
        defaultValue: 'ACTIVE',
      },
    },
    
    {
      freezeTableName: true,
    }
  );
  return dynamicFieldName;
};