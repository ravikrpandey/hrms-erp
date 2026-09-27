const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const materialRequest = sequelize.define(
    "CRMS_MATERIAL_REQUEST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      request_ID:{
        type:Sequelize.STRING,
      },
      remark:{
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
  return materialRequest;
};