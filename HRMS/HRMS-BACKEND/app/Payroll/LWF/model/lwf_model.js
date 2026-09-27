module.exports = (sequelize, Sequelize) => {
  const LWF = sequelize.define(
    "PAYROLL_LWF",
    {
      state_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      employee: {
        type: Sequelize.JSON, // { type, value, frequency, isCapped, capAmount }
        allowNull: true,
      },
      employer: {
        type: Sequelize.JSON, // { type, value, frequency, isCapped, capAmount }
        allowNull: true,
      },
      government: {
        type: Sequelize.JSON, // { type, value, frequency, isCapped, capAmount }
        allowNull: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      freezeTableName: true,
    }
  );

  return LWF;
};
