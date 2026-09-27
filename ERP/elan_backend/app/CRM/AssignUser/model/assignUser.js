const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const assignUser = sequelize.define(
    "CRM_ASSIGN_USER_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
  return assignUser;
};