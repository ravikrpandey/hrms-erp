module.exports = (sequelize, Sequelize) => {
  const DepartmentAllocation = sequelize.define(
    "LMS_DEPARTMENT_ALLOCATION",
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
      entity_id: {
        type: Sequelize.JSON
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return DepartmentAllocation;
};
