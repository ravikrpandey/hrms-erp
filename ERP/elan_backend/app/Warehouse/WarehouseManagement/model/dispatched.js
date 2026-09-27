const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const orderDispatched = sequelize.define(
    "SALES_ORDER_DISPATCHED",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dispatched_date: {
        type: Sequelize.DATEONLY,
      },
      notes: {
        type: Sequelize.STRING,
      },
      terms_and_conditons: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
    
    },
   
    {
      freezeTableName: true,
    }
  );
  return orderDispatched;
};