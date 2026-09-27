module.exports = (sequelize, Sequelize) => {
  const compoff_assign = sequelize.define(
    "HRMS_ASSIGN_COMPOFF_EMPLOYEE",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
  return compoff_assign;
};
