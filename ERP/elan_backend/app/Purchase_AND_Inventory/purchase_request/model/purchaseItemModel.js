module.exports = (sequelize, Sequelize) => {
  const purchase_item = sequelize.define(
    "PROCUREMENT_PURCHASE_REQUEST_ITEM",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      priority: {
        type: Sequelize.ENUM("HIGH", "MEDIUM", "LOW"),
      },
      total_mvp: {
        type: Sequelize.INTEGER,
      },
      tax: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      grand_total: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      // Vendor Ids for RFP
      vendor_ids: {
        type: Sequelize.JSON,
        comment: "Vendor Ids for RFP",
      },
      po_status: {
        type: Sequelize.ENUM("DRAFT PO", "ISSUED PO", "ISSUED INVOICE", "PAID"),
        defaultValue: "PAID",
      },
    },
    {
      freezeTableName: true,
    },
  );
  return purchase_item;
};
