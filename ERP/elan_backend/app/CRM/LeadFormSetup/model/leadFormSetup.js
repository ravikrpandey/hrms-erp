const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const leadFormSetup = sequelize.define("CRM_LEAD_FORM_SETUP_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      field_name: {
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
  return leadFormSetup;
};