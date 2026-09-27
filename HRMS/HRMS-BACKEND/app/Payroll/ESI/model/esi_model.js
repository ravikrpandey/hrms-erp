module.exports = (sequelize, Sequelize) => {
  const PayrollEsi = sequelize.define(
    "PAYROLL_ESI",
    {
      // esi_number: {
      //     type: Sequelize.STRING
      // },
      deduction_cycle: {
        type: Sequelize.STRING,
      },
      employee_contribution: {
        type: Sequelize.STRING,
      },
      employer_contribution: {
        type: Sequelize.STRING,
      },
      employer_contribution_in_ctc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      entity: {
        type: Sequelize.INTEGER,
      },
      // financial_year: {
      //   type: Sequelize.STRING,
      // },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: Sequelize.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      freezeTableName: true,
    }
  );
  return PayrollEsi;
};
