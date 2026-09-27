const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const materialRequestDetail = sequelize.define(
    "CRMS_MATERIAL_REQUEST_DETAILS",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity:{
        type:Sequelize.INTEGER,
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
  return materialRequestDetail;
};