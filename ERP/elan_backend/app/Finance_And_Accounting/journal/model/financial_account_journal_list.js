module.exports = (sequelize, Sequelize) => {
  const financialAccountJournalList = sequelize.define(
    "FINANCIAL_AND_ACCOUNT_JOURNAL_LIST",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      party_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      debit_amount: {
          type: Sequelize.DECIMAL(20,2),
        allowNull: true,
        defaultValue: 0.00
      },
      credit_amount: {
        type: Sequelize.DECIMAL(20,2),
        allowNull: true,
        defaultValue: 0.00
      },
      tds_rate_amount:{
        type: Sequelize.DECIMAL(20,2),
        allowNull:true,
      },
      currency_rate:{
        type: Sequelize.DECIMAL(20,5),
        allowNull:true,
      },
      entry_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      document_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      tds_rate_amount:{
        type: Sequelize.STRING,
      },
      igst:{
        type: Sequelize.DECIMAL(20,2),
      },
      cgst:{
        type: Sequelize.DECIMAL(20,2),
      },
      sgst:{
        type: Sequelize.DECIMAL(20,2),
      },
      billing_id:{
        type: Sequelize.INTEGER
      },
    },
    {
      freezeTableName: true,
    }
  );
  financialAccountJournalList.associate = (db) => {
    financialAccountJournalList.belongsTo(db.customerBilling, {
      foreignKey: "billing_id",
      onDelete: "RESTRICT",
    });
  };

  return financialAccountJournalList;
};
