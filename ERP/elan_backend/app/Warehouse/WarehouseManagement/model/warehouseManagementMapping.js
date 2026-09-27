const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const warehouseManagementMapping = sequelize.define(
    "WAREHOUSE_MANAGEMENT_MAPPING",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serial_number: {
        type: Sequelize.STRING,
      },
      uploaded_mode: {
        type: Sequelize.STRING,
      },
      cost_price: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      warehouse_space_id: {
        type: Sequelize.JSON,
      },
      item_category_id: {
        type: Sequelize.JSON,
      },
      sub_category_id: {
        type: Sequelize.JSON,
      },
      warehouse_space_type: {
        type: Sequelize.ENUM("Row", "Shelf","Section"),
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
      is_dispatched: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      }
    },
   
    {
      freezeTableName: true,
    }
  );
  return warehouseManagementMapping;
};