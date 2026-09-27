const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const dynamicFieldValue = sequelize.define(
    "DYNAMIC_FIELD_VALUE",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dynamic_field_value: { 
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return dynamicFieldValue;
};
