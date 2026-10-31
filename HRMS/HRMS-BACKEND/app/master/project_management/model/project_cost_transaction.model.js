module.exports = (sequelize, Sequelize) => {
  const ProjectCostTransaction = sequelize.define(
    "PROJECT_COST_TRANSACTIONS",
    {
      transaction_id: {
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
        allowNull: false,
      },
      source_type: {
        type: Sequelize.ENUM("TIMESHEET_LABOR", "PROJECT_EXPENSE", "ADJUSTMENT"),
        allowNull: false,
      },
      source_reference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      source_reference_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      idempotency_key: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      task_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      transaction_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      hours: {
        type: Sequelize.DECIMAL(8, 2),
        defaultValue: 0.0,
      },
      applied_rate: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: "INR",
      },
      posting_status: {
        type: Sequelize.ENUM("POSTED", "REVERSED", "ADJUSTED"),
        defaultValue: "POSTED",
      },
      reversal_reference_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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

  return ProjectCostTransaction;
};
