module.exports = (sequelize, Sequelize) => {
  const hrmsLeaveAllotment= sequelize.define("HRMS_USER_LEAVE_ALLOTMENT", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    no_of_days: {
      type: Sequelize.DECIMAL(20, 2),
      defaultValue: 0.00
    },
    available_days: {
      type: Sequelize.DECIMAL(20, 2),
      defaultValue: 0.00
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    isDeleted: {
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  return hrmsLeaveAllotment;
};

