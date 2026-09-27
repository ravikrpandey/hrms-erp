const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const fieldValue = sequelize.define(
    "CRM_FIELD_VALUE_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      field_value: { 
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
  return fieldValue;
};
