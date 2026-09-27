module.exports = (sequelize, Sequelize) => {
  const sanctionCreditLimit = sequelize.define("MASTER_SANCTION_CREDIT_LIMIT", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    credit_period: {
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

  return sanctionCreditLimit;
};
