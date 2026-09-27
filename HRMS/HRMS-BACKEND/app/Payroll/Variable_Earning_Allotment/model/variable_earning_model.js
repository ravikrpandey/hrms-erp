module.exports = (sequelize, Sequelize) => {
  const VariableEarningAllotment = sequelize.define(
    "PAYROLL_VARIABLE_EARNING_ALLOTMENT",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      variable_component_details: {
        type: Sequelize.JSON
      },
      approve_salary_percentage: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_annual_amount:{
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      approve_salary_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      credit_type: {
        type: Sequelize.ENUM("oneTime", "multiple"),
        allowNull: false,
      },

      // Allotment Type: divideEqually / enterManually (only if multiple)
      allotment_type: {
        type: Sequelize.ENUM("divideEqually", "enterManually"),
        allowNull: true,
      },
      credit_allotment_details: {
        type: Sequelize.JSON
      },

      // Status
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },

      // Soft delete
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return VariableEarningAllotment;
};
