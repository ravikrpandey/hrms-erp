module.exports = (sequelize, Sequelize) => {
  const essLeavedaysDetail = sequelize.define("ESS_APPLIED_LEAVE_DAYS_DETAIL", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    leave_day: {
      type: Sequelize.STRING,
      allowNull: true
    },
    leave_date: {
      type: Sequelize.DATEONLY("YYYY-MM-DD"),
      allowNull: true
    },
    leave_period: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE"
    },
    leave_type: {
      type: Sequelize.ENUM('PAID', 'NON PAID', 'HALF PAID'),
      defaultValue: 'PAID',
      allowNull: false
    },
    deduction_done: {
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
    },
    isDeleted: {
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: true // Adds createdAt and updatedAt fields
  });
  return essLeavedaysDetail;
};

