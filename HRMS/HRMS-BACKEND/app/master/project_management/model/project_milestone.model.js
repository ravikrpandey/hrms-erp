module.exports = (sequelize, Sequelize) => {
  const ProjectMilestone = sequelize.define(
    "PROJECT_MILESTONES",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      milestone_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      milestone_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
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
      status: {
        type: Sequelize.STRING(50),
        defaultValue: "Not Started",
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

  return ProjectMilestone;
};

