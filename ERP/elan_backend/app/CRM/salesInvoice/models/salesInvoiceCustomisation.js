const Sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {

  const SalesInvoiceCustomisationBranding = sequelize.define(
    "CRM_SALES_INVOICE_CUSTOMISATION_BRANDING",
    {

      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },      

      qty: {
        type: Sequelize.INTEGER,
      },
     item_type: {
        type: Sequelize.ENUM(
          'Standard',
          'Customization & Branding',
          'Customization',
          'Branding',
          'Accessories',
          'Basket',
          'Scheme',
          'Kit'
        ),
        defaultValue: 'Standard',
      },

      item_name: {
        type: Sequelize.TEXT
      },

      item_code: {
        type: Sequelize.TEXT
      },

      hsncode: {
        type: Sequelize.TEXT
      },

      UOM: {
        type: Sequelize.TEXT,
      },
      offerprice: {
        type: Sequelize.DECIMAL(18,2),
      },

      discount_percent: {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 0,
      },

      discount_amount: {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 0,
      },

      taxable_amount: {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 0,
      },

      gst_rate: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      cgst_amount: {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 0,
      },

      sgst_amount: {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 0,
      },

      igst_amount: {
        type: Sequelize.DECIMAL(18,2),
        defaultValue: 0,
      },    
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return SalesInvoiceCustomisationBranding;
};