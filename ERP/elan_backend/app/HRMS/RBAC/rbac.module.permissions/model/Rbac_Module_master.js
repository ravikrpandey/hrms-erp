module.exports = (sequelize, Sequelize) => {
  const HRMS_RBAC_MODULE_MASTER = sequelize.define(
    "HRMS_RBAC_MODULE_MASTER",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "domain",
      },
      lastIcon: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "fa fa-chevron-down",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      // REQUIRED for self-referencing
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    },
    {
      freezeTableName: true,
    }
  );

  return HRMS_RBAC_MODULE_MASTER;
};
