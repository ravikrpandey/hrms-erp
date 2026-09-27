module.exports = (sequelize, Sequelize) => {
  const fiancialTransactionsIntegration = sequelize.define(
    "FINANCIAL_TRANSACTION_INTEGRATION",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
  return fiancialTransactionsIntegration;
};