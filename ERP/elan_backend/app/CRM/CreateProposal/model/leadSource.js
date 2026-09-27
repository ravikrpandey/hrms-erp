const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const leadSource = sequelize.define(
    "CRM_LEAD_SOURCE_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lead_source: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        default: false
      },

    },

    {
      freezeTableName: true,
    }
  );
  return leadSource;
};