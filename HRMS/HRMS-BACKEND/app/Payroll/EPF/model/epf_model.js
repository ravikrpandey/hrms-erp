module.exports = (sequelize, Sequelize) => {
  const EmployeeProvidentFund = sequelize.define(
    "PAYROLL_EPF",
    {
      epf_number: {
        type: Sequelize.STRING,
      },
      epf_code: {
        type: Sequelize.STRING,
        unique: {
          name: "unique_epf_code",
          msg: "epf_code must be unique",
        },
      },
      deduction_cycle: {
        type: Sequelize.STRING,
      },
      employee_contribution_rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employer_contribution_rate: {
        type: Sequelize.INTEGER,
      },
      edli_rate: {
        type: Sequelize.DECIMAL(5, 2),
      },
      admin_charges_rate: {
        type: Sequelize.DECIMAL(5, 2),
      },
      admin_charges_cap: {
        type: Sequelize.DECIMAL(10, 2),
      },
      is_employer_contribution_in_ctc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_edli_contribution_in_ctc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_admin_charges_in_ctc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      override_at_employee_level: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_pro_rate_restricted_pf_wage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      consider_salary_components_if_low_pf: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
      // entity: {
      //   type: Sequelize.INTEGER
      // },
      // financial_year: {
      //   type: Sequelize.STRING,
      // },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return EmployeeProvidentFund;
};
