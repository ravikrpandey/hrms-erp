module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define(
    "CRM_PROPOSAL_LIST_MST_BOM_KIT",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bom_name: {
        type: Sequelize.STRING,
      },
      bom_qty: {
        type: Sequelize.INTEGER,
        defaultValue: true,
      },
      price_per_unit: {
        type: Sequelize.DECIMAL(20, 2),
        comment: 'actual price without discount'
      },
      discountType: {
        type: Sequelize.STRING,
      },
      discount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountAmount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountAmountPerQTY: {
        type: Sequelize.DECIMAL(20, 2),
      },
      total_price: {
        type: Sequelize.DECIMAL(20, 2),
        comment: 'after discount'
      },
      gst: {
        type: Sequelize.FLOAT
      },
      hsn_code: {
        type: Sequelize.STRING
      },
      totalWithGst: {
        type: Sequelize.DECIMAL(20, 2),
        comment: 'total_price with gst'
      },
      dispatch_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'completed BOM'
      },
      partial_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'partial BOM'
      },
      pending_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'pending BOM'
      },
    },
    {
      freezeTableName: true,
    }
  );
  return table;
};