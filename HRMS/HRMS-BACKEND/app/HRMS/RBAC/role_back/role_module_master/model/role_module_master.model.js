module.exports = (sequelize, Sequelize) => {
  const role_module_masterDetails = sequelize.define(
    "HRMS_RBAC_ROLE_MODULE_MASTER",
    {
      role_module_master_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_module_master_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      role_module_master_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        // allowNull :true
      },
      sequence: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      module_master_link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      module_master_icon: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      module_master_endIcon: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      allocation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return role_module_masterDetails;
};
