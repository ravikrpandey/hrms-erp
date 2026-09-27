const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const reserveSerialNo = sequelize.define(
    "SALES_RESERVE_SERIAL_NO",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      }
    },
   
    {
      freezeTableName: true,
    }
  );
  return reserveSerialNo;s
};