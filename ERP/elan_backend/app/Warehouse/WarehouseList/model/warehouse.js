const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const warehouse = sequelize.define(
    "WAREHOUSE_DETAIL_MST",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      contact_no: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      space: {
        type: Sequelize.ENUM('FULL','EMPTY'),
        defaultValue: "EMPTY"
      },
      alt_email: {
        type: Sequelize.STRING,
      },
      // plant_id:{
      //   type: Sequelize.INTEGER,
      // },
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
  return warehouse;
};