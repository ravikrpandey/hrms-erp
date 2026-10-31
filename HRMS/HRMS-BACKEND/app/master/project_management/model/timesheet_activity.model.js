module.exports = (sequelize, Sequelize) => {
  const TimesheetActivity = sequelize.define(
    "TIMESHEET_ACTIVITIES",
    {
      activity_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      submission_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      log_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      actor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      actor_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      actor_role: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      activity_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      old_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      new_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return TimesheetActivity;
};
