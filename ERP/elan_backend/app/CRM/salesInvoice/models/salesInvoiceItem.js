const Sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {

  const SalesInvoiceItems = sequelize.define(
    "CRM_SALES_INVOICE_ITEM",
     {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      item_type: {
        type: Sequelize.ENUM(
          'Standard',
          'Customization & Branding',
          'Customization',
          'Branding',
          'Accessories',
          'Baskets',
          'Scheme',
          'Scheme Item',
          'Kit',
          'Primary Item',
          'Substitute Item'
        ),
        defaultValue: 'Standard',
      },
      item_name: {
        type: Sequelize.TEXT
      },
      item_code: {
        type: Sequelize.TEXT
      },
      item_description: {
        type: Sequelize.TEXT
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price_per_unit: {
        type: Sequelize.DECIMAL(18,2)
      },
      discount_per_unit: {
        type: Sequelize.DECIMAL(18,2)
      },
      igst: {
        type: Sequelize.INTEGER
      },
      sgst: {
        type: Sequelize.INTEGER
      },
      cgst: {
        type: Sequelize.INTEGER
      },
      hsncode: {
        type: Sequelize.TEXT
      },
      UOM: {
        type: Sequelize.TEXT,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return SalesInvoiceItems;
};