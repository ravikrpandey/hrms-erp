module.exports = (sequelize, Sequelize) => {
  const ProjectTask = sequelize.define(
    "PROJECT_TASKS",
    {
      task_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      task_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      assigned_to_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      assigned_to_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      assigned_to_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reviewer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reviewer_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reviewer_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      priority: {
        type: Sequelize.ENUM("Low", "Medium", "High", "Urgent"),
        defaultValue: "Medium",
      },
      status: {
        type: Sequelize.ENUM("To Do", "In Progress", "In Review", "Completed"),
        defaultValue: "To Do",
      },
      review_status: {
        type: Sequelize.ENUM("Pending", "Submitted", "Approved", "Changes Requested"),
        defaultValue: "Pending",
      },
      review_comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      estimated_hours: {
        type: Sequelize.DECIMAL(6, 2),
        defaultValue: 0.0,
      },
      logged_hours: {
        type: Sequelize.DECIMAL(6, 2),
        defaultValue: 0.0,
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

  return ProjectTask;
};

