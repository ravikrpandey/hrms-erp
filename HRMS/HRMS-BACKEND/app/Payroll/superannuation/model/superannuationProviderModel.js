module.exports = (sequelize, Sequelize) => {
  const superannuationProvider = sequelize.define("PAYROLL_SUPERANNUATION_PROVIDER_LIST", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    provider_name: {
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
return superannuationProvider;
};
