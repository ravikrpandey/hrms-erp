module.exports = (sequelize, Sequelize) => {
    const invoiceData = sequelize.define(
      "CRM_PROPOSAL_INVOICE_MST",
      {
        id: {
          type: Sequelize.INTEGER, 
          primaryKey: true,
          autoIncrement: true,
        },
        invoice_remark: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        freezeTableName: true,
        initialAutoIncrement: 1000,
      }
    );
    return invoiceData;
  };
  