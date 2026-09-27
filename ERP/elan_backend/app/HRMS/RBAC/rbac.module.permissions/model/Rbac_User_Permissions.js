module.exports = (sequelize, Sequelize) => {
  const HRMS_RBAC_USER_PERMISSION = sequelize.define(
    "HRMS_RBAC_USER_PERMISSION",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      write: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      remove: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return HRMS_RBAC_USER_PERMISSION;
};
