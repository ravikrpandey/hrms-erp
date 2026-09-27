const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const materialRequestAllocate = sequelize.define(
    "CRMS_MATERIAL_REQUEST_ALLOCATE",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      allocation_ID:{
        type:Sequelize.STRING,
        defaultValue:null
      },
      allocate_quantity:{
        type:Sequelize.INTEGER,
      },
      lifo_fifo: {
        type: Sequelize.ENUM("LIFO", "FIFO"),
        defaultValue: "LIFO"
      },
      awb_mup:{
        type:Sequelize.STRING,
        defaultValue:null
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
  return materialRequestAllocate;
};