module.exports = (sequelize, Sequelize) => {
  const EmployeeAllocation = sequelize.define(
    "LMS_EMPLOYEE_ALLOCATION",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      assign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_name: {
        type: Sequelize.STRING,
      },
      employee_code: {
        type: Sequelize.STRING,
      },
      entity_id: {
        type: Sequelize.JSON
      },
      designation: {
        type: Sequelize.STRING,
      }
    },
    {
      freezeTableName: true,
    }
  );

  return EmployeeAllocation;
};
