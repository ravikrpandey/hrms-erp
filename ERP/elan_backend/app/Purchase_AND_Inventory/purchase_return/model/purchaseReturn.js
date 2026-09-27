module.exports = (sequelize, Sequelize) => {
  const PurchaseReturn = sequelize.define(
    "PURCHASE_RETURNS",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      return_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      po_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      grn_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      return_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      return_reason_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "DRAFT",
          "SUBMITTED",
          "APPROVED",
          "REJECTED",
          "COMPLETED",
          "CANCELLED",
        ),
        defaultValue: "DRAFT",
        allowNull: false,
      },
      return_status: {
        type: Sequelize.ENUM("Pending", "Approved"),
        defaultValue: "Pending",
        allowNull: false,
      },
      sub_total: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      final_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      financial_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

  return PurchaseReturn;
};
