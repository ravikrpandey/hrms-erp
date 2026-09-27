module.exports = (sequelize, Sequelize) => {
  const warehouse_bifurcation_zone = sequelize.define("WAREHOUSE_BIFURCATION_ZONE", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    area: {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false
    },
    bulk_status: {
      type: Sequelize.ENUM("OCCUPIED", "AVAILABLE", "UNDER_MAINTENANCE", "BLOCKED"),
      defaultValue: "AVAILABLE"
    },
    item_category: {
      type: Sequelize.JSON,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE"
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  }, {
    freezeTableName: true
  });
  return warehouse_bifurcation_zone
}