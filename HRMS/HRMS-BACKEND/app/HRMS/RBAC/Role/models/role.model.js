module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("HRMS_RBAC_ROLE", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    freezeTableName: true,
  });
  return Role;
};