module.exports = (sequelize, Sequelize) => {
  const craProvider = sequelize.define("PAYROLL_CRA_PROVIDER_LIST", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    craProvider: {
      type: Sequelize.STRING,
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
return craProvider;
};
