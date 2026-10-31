module.exports = (sequelize, Sequelize) => {
  const ProjectExpense = sequelize.define(
    "PROJECT_EXPENSES",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      expense_number: {
        type: Sequelize.STRING(50),
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
      employee_email: {
        type: Sequelize.STRING(255),
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
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      project_code: {
        type: Sequelize.STRING(100),
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
      expense_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      expense_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      expense_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attachment_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      attachment_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      attachment_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      attachment_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Draft", "Submitted", "Finance Pending", "Approved", "Rejected"),
        defaultValue: "Draft",
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pm_approver_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pm_approver_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pm_approval_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pm_comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      finance_approver_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      finance_approver_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      finance_approval_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      finance_comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rejected_by_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rejected_by_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      rejected_by_role: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      rejection_stage: {
        type: Sequelize.ENUM("Project Manager", "Finance"),
        allowNull: true,
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rejection_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_resubmitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      resubmitted_at: {
        type: Sequelize.DATE,
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

  return ProjectExpense;
};

