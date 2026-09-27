module.exports = (sequelize, Sequelize) => {
  const ProfessionalTax = sequelize.define(
    "PAYROLL_PT",
    {
      state_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pt_slabs: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      freezeTableName: true,
    }
  );

  return ProfessionalTax;
};
