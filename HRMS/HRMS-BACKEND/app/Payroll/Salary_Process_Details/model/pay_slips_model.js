module.exports = (sequelize, Sequelize) => {
  const payroll_payslip = sequelize.define(
    "HRMS_PAYROLL_PAY_SLIPS",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      base_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      gross_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      recieve_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      pay_slip_month: {
        type: Sequelize.INTEGER,
      },
      pay_slip_year: {
        type: Sequelize.INTEGER,
      },
      pay_slip_doc: {
        type: Sequelize.STRING,
      },
      pay_slip_status: {
        type: Sequelize.ENUM("HOLD", "PROCESSED", "INACTIVE"),
        defaultValue: "HOLD",
      },
      approval_status: {
        type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED", "CLOSED"),
      },
      salary_data: {
        type: Sequelize.JSON,
      },
      remark: {
        type: Sequelize.TEXT,
      },
      closed_remark: {
        type: Sequelize.TEXT,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      pt_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      lwf_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      employer_lwf_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      government_lwf_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      fine_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      ot_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      loan_disbursed: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      loan_adjusted: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      nps_employee_contribution: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      nps_employer_contribution: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      saf_employee_contribution: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      saf_employer_contribution: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      employer_epf: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      employer_esi: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      employers_edli_share: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      employers_admin_charge_share: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      leave_encash_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      bonus_details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      incentive_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      deduction_details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return payroll_payslip;
};
