module.exports = (sequelize, Sequelize) => {
  const creditLimit = sequelize.define("MASTER_CREDIT_LIMIT", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    over_due_days: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    credit_limit: {
      type: Sequelize.INTEGER,
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

  return creditLimit;
};
