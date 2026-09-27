const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const customerComplain = sequelize.define(
    "CRMS_REGISTER_COMPLAIN_LOG",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      remarks:{
        type:Sequelize.STRING,
      },
      complain_status: {
        type: Sequelize.STRING,
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
  return customerComplain;
};