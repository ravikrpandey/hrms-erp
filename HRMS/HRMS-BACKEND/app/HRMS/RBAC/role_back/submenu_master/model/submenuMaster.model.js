module.exports = (sequelize, Sequelize) => {
  const submenuMasterDetails = sequelize.define(
    "HRMS_RBAC_SUBMENU_MASTER",
    {
      submenu_master_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      submenu_master_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      submenu_masters_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      submenu_masters_icon: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "fa fa-chevron-down",
      },
      menu_master_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "HRMS_RBAC_MENU_MASTER",
          key: "menu_master_id",
        },
      },
      role_module_master_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "HRMS_RBAC_ROLE_MODULE_MASTER",
          key: "role_module_master_id",
        },
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      sequence: {
        type: Sequelize.INTEGER
      },
      submenu_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        // allowNull :true
      },
      module_assigned: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return submenuMasterDetails;
};
