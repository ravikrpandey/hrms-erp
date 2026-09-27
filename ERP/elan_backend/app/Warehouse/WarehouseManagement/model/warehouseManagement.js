const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const warehouseManagement = sequelize.define(
    "WAREHOUSE_MANAGEMENT",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      batch_number: {
        type: Sequelize.STRING,
      },
      inward_date: {
        type: Sequelize.DATEONLY,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      total_qty: {
        type: Sequelize.INTEGER,
      },
      cost_price: {
        type: Sequelize.INTEGER,
      },
      total_value: {
        type: Sequelize.INTEGER,
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
  return warehouseManagement;
};