module.exports = (sequelize, Sequelize) => {
  const TimesheetSubmission = sequelize.define(
    "TIMESHEET_SUBMISSIONS",
    {
      submission_id: {
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
      submission_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      period_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      period_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      total_hours: {
        type: Sequelize.DECIMAL(8, 2),
        defaultValue: 0.0,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected", "Draft"),
        defaultValue: "Draft",
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejected_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rejected_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      approver_comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return TimesheetSubmission;
};
