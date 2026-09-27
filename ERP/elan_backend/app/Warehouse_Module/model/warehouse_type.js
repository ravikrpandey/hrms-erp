const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const warehouse_type = sequelize.define(
    "WAREHOUSE_TYPE",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      warehouse_type_name: {
        type: Sequelize.STRING,
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
  return warehouse_type;
};