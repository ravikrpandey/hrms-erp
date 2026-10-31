module.exports = (sequelize, Sequelize) => {
  const TimesheetLog = sequelize.define(
    "TIMESHEET_LOGS",
    {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      work_item: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      log_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      work_mode: {
        type: Sequelize.STRING(50),
        defaultValue: "Office",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hours_mode: {
        type: Sequelize.ENUM("Total Hours", "Start-End Time", "Timer"),
        defaultValue: "Total Hours",
      },
      start_time: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      end_time: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      total_hours: {
        type: Sequelize.DECIMAL(6, 2),
        defaultValue: 0.0,
      },
      is_billable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      attachment_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      submission_status: {
        type: Sequelize.ENUM("Not Submitted", "Submitted"),
        defaultValue: "Not Submitted",
      },
      approval_status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      timesheet_submission_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

  return TimesheetLog;
};
