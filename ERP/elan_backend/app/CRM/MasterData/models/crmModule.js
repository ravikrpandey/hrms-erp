const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const crmModule = sequelize.define(
    "SYS_CRM_MODULE_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      menuName: {
        type: Sequelize.STRING,
      },
      menuLink:{
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
  return crmModule;
};

