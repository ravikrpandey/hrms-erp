module.exports = (sequelize, Sequelize) => {
  const fiancialTransactionsIntegrationList = sequelize.define(
    "FINANCIAL_TRANSACTION_INTEGRATION_LIST",
    {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mapping_component:{
        type:Sequelize.STRING
      },
      debitCredit:{
        type:Sequelize.STRING
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
  return fiancialTransactionsIntegrationList;
};