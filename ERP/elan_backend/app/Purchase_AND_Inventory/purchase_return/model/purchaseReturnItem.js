module.exports = (sequelize, Sequelize) => {
  const PurchaseReturnItem = sequelize.define(
    "PURCHASE_RETURN_ITEMS",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      purchase_return_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      grn_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      received_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      already_returned_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      return_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      tax_percent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      zone_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rack_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bin_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      batch_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      serial_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    },
  );

  return PurchaseReturnItem;
};
