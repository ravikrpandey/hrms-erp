const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const warehouse = sequelize.define("STOCK_ACKNOWLEDGED_RACKS",
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
      rack_name: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      stock_request: {
        type: Sequelize.ENUM("APPROVED", "REJECTED", "PENDING"),
        defaultValue: "PENDING",
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      stock_status: {
        type: Sequelize.ENUM('STOCK_TRANSFERED','TRANSFER_REQUEST','PENDING'),
        defaultValue: "PENDING",
      },
      transfer_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      internal_transfer_request: {
        type: Sequelize.ENUM('PENDING','INTERNAL_TRANSFERED'),
        defaultValue: "PENDING",
      },        
    },

    {
      freezeTableName: true,
    }
  );
  return warehouse;
};


