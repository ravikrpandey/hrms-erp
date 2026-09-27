module.exports = (sequelize, Sequelize) => {
  const levelEmployee = sequelize.define("MASTER_EMPLOYEE_MAPPING_WITH_LEVEL", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    level: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    employee_ids: {
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
    }
  }, {
    freezeTableName: true
  });

  return levelEmployee;
};
