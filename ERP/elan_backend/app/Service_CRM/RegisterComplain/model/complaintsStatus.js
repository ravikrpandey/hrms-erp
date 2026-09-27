const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const complainStatus = sequelize.define(
    "CRMS_COMPLAIN_STATUS",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      complain_status:{
        type:Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      }
    },
    
    {
      freezeTableName: true,
    }
  );
  return complainStatus;
};