module.exports = (sequelize, Sequelize) => {

  const salesOrderItemNew = sequelize.define(
    "SALES_ORDER_ITEM_LIST_NEW",
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
      goods_return_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      price_per_unit: {
        type: Sequelize.DECIMAL(18, 2)
      },
      discount_per_unit: {
        type: Sequelize.DECIMAL(18, 2)
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
    }
  );

  return salesOrderItemNew;
};