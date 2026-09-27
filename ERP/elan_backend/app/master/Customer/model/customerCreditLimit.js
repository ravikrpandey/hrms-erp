module.exports = (sequelize, Sequelize) => {
  const customerCreditLimit = sequelize.define(
    "CUSTOMER_CREDIT_LIMIT",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      sanctioned_credit_limit: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },

      sanctioned_credit_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      grace_period_days: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      effective_from: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: "Rule applicable from this date"
      },

      change_reason: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Initial Entry, Payment term changed"
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    },
    {
      freezeTableName: true,
    }
  );

  return customerCreditLimit;
};