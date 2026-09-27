module.exports = (sequelize, Sequelize) => {
  const purchase_order = sequelize.define(
    "PROCUREMENT_PURCHASE_ORDER",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      po_category: {
        type: Sequelize.ENUM("Item", "Service"),
      },
      po_type: {
        type: Sequelize.ENUM("Capex", "Opex"),
      },
      po_number: {
        type: Sequelize.STRING,
      },
      total_purchase: {
        type: Sequelize.DECIMAL(30, 2),
      },
      po_remark: {
        type: Sequelize.TEXT,
      },
      po_date: {
        type: Sequelize.DATE,
      },
      inv_number: {
        type: Sequelize.STRING,
      },
      pdf_data: {
        type: Sequelize.STRING,
      },
      final_status: {
        type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED", "PUSH BACK"),
        defaultValue: "PENDING",
      },
      invoice_status: {
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: true,
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
      grn_status: {
        type: Sequelize.ENUM("PENDING", "PARTIAL", "APPROVED"),
        defaultValue: "PENDING",
      },
      advance_payment: {
        type: Sequelize.DECIMAL(20, 2),
      },
      po_status: {
        type: Sequelize.ENUM("PENDING", "DISCARDED", "APPROVED"),
        defaultValue: "PENDING",
      },
      delivery_term: {
        type: Sequelize.STRING,
      },
      delivery_term_remark: {
        type: Sequelize.STRING,
      },
      payment_term: {
        type: Sequelize.STRING,
      },
      payment_term_remark: {
        type: Sequelize.STRING,
      },
      advance_utilization_percent: {
        type: Sequelize.DECIMAL(20, 2),
      },
      currency_rate: {
        type: Sequelize.DECIMAL(20, 5),
      },
      quotation_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
    },
  );
  return purchase_order;
};
