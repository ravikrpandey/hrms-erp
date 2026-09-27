module.exports = (sequelize, Sequelize) => {
  const gratuity = sequelize.define("PAYROLL_GRATUITY", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    maximum_limit: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: null,
    },
    assumed_work_days: {
      type: Sequelize.INTEGER,
      defaultValue: null,
    },
    assumed_total_days: {
      type: Sequelize.INTEGER,
      defaultValue: null,
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    isDeleted: {
      type: Sequelize.BOOLEAN(true, false),
      defaultValue: false,
    },

  },
  {
     freezeTableName: true,
  }
);
return gratuity;
};
