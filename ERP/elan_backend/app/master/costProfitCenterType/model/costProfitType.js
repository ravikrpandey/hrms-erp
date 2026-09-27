module.exports = (sequelize, Sequelize) => {
    const costProfitCenterType = sequelize.define("COST_PROFIT_CENTER_TYPE", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
      },
      selected_type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    }, {
      freezeTableName: true
    });
  
    return costProfitCenterType;
  };
  