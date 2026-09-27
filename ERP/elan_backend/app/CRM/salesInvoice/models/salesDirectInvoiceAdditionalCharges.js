const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const invoiceChargesList = sequelize.define(
    "CRM_DIRECT_INVOICE_ADDITIONAL_CHARGES_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      charges_name: {
        type: Sequelize.STRING
      },
      charges_amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }
    },

    {
      freezeTableName: true,
    }
  );
  return invoiceChargesList;
};