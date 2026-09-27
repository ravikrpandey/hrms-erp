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
  