const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const leadSummary = sequelize.define(
    "CRM_LEAD_SUMMARY_MST",
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
  return leadSummary;
};
