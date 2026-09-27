module.exports = (sequelize, Sequelize) => {
  const payroll_loan_advance = sequelize.define(
    "PAYROLL_LOAN_ADVANCE",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      month: {
        type: Sequelize.INTEGER, // Changed from TEXT to INTEGER
        allowNull: true,
        validate: {
          min: 1,
          max: 12,
        },
      },
      advance_for: {
        type: Sequelize.ENUM("ME", "TEAMMATE"),
        defaultValue: "ME",
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      payroll_adjustment_type: {
        type: Sequelize.TEXT, // 1 = One Time, 2 = Multiple Time
        allowNull: false,
      },
      allotment_type: {
        type: Sequelize.TEXT, // 1 = Divide Equally, 2 = Divide Manually
        allowNull: true,
      },
      adjustments: {
        type: Sequelize.JSON, // [{ year, month, amount }]
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: Sequelize.BOOLEAN, // ✅ Correct
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true, // ✅ Recommended: createdAt, updatedAt
    }
  );

  return payroll_loan_advance;
};
