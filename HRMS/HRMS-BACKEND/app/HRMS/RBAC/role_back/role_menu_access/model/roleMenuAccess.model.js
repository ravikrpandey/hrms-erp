module.exports = (sequelize, Sequelize) => {
    const roleMenuAccessDetails = sequelize.define("HRMS_RBAC_ROLE_MENU_ACCESS", {
        role_menu_access_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_master_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'HRMS_RBAC_ROLE_MASTER',
                key: 'role_master_id',
            },
        },
        employee_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'HRMS_REGISTERED_USER',
                key: 'employee_id',
            },
        },
        role_module_master_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'HRMS_RBAC_ROLE_MODULE_MASTER',
                key: 'role_module_master_id',
            },
        },
        role_module_master_completed: {
            type: Sequelize.BOOLEAN(true, false),
        },
        menu_master_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'HRMS_RBAC_MENU_MASTER',
                key: 'menu_master_id',
            },
        },
        menu_completed: {
            type: Sequelize.BOOLEAN(true, false),
        },
        submenu_master_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'HRMS_RBAC_SUBMENU_MASTER',
                key: 'submenu_master_id',
            },
        },
        submenu_completed: {
            type: Sequelize.BOOLEAN(true, false),
        },
        read_module_access: {
            type: Sequelize.BOOLEAN(true, false),
        },
        write_module_access: {
            type: Sequelize.BOOLEAN(true, false),
        },
        delete_module_access: {
            type: Sequelize.BOOLEAN(true, false),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },

    },
    {
      freezeTableName: true,
    });
    return roleMenuAccessDetails;
};