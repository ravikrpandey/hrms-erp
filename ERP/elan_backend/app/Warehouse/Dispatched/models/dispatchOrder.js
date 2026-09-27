const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const dispatchOrder = sequelize.define(
    "DISPATCH_ORDER",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      quantity:{
        type:Sequelize.INTEGER
      },
      
      vehicle_type: {        
        type: Sequelize.STRING
      },
      vehicle_number: {
        type: Sequelize.STRING
      },
    },

    {
      freezeTableName: true,
    }
  );
  return dispatchOrder;
};
