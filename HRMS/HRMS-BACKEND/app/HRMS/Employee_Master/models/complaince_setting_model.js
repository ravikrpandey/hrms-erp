const { sequelize, Sequelize } = require("../../../models");

module.exports = (sequelize, Sequelize) => {
  const complaince_setting = sequelize.define(
    "EMPLOYEE_COMPLIANCE_SETTING",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      epf: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      epf_capping: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      edli: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      esi: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      professional_tax: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      labour_welfare_fund: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      overtime: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      gratuity_employer: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      nps: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      saf: {
        type: Sequelize.BOOLEAN(true, false),
        // defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return complaince_setting;
};
