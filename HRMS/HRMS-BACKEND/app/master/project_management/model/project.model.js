module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define(
    "PROJECTS",
    {
      project_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      project_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      client_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      billing_method: {
        type: Sequelize.STRING(100),
        defaultValue: "Fixed Cost",
      },
      priority: {
        type: Sequelize.ENUM("Low", "Medium", "High", "Critical"),
        defaultValue: "Medium",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      department_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      project_manager_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_manager_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      initial_progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      budget: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      spent: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      profit_loss: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      status: {
        type: Sequelize.ENUM("Active", "Completed", "On Hold", "Overdue", "Cancelled"),
        defaultValue: "Active",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Project;
};

