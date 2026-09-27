// models/payroll_tax_tracking.model.js
module.exports = (sequelize, Sequelize) => {
  const payroll_tax_tracking = sequelize.define(
    "PAYROLL_TAX_TRACKING",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      monthly_tax: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      cumulative_tax_paid: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      taxable_income_to_date: {
        type: Sequelize.DECIMAL(14, 2),
        defaultValue: 0.0,
      },
      tax_amount_remaining: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      attendance_days: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      working_days: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      projection_json: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return payroll_tax_tracking;
};
