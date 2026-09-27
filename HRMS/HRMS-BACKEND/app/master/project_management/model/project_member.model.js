module.exports = (sequelize, Sequelize) => {
  const ProjectMember = sequelize.define(
    "PROJECT_MEMBERS",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      employee_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      department_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      role_in_project: {
        type: Sequelize.STRING(100),
        defaultValue: "Member",
      },
      assigned_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return ProjectMember;
};

