module.exports = (sequelize, Sequelize) => {
  const roleMasterDetails = sequelize.define(
    "HRMS_RBAC_ROLE_MASTER",
    {
      role_master_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_master_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      role_code: {
        type: Sequelize.STRING,
        unique: true
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
       hooks: {
        // ONLY INSERT TIME
        beforeCreate: (role, options) => {
          if (!role.role_code) {
            role.role_code = role.role_master_name;
          }
        },
      },
    }
  );
  return roleMasterDetails;
};
