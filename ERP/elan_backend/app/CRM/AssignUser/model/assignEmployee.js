const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const assignEmployee = sequelize.define(
    "CRM_ASSIGN_EMPLOYEE_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }
    },
    
    {
      freezeTableName: true,
    }
  );
  return assignEmployee;
};