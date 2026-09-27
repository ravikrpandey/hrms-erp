module.exports = (sequelize, Sequelize) => {
    const lms_requested_course_assign = sequelize.define(
      "LMS_REQUESTED_COURSE_ASSIGN",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        employee_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        assign_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        request_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        course_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        allocate_by_id: {
          type: Sequelize.INTEGER,
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
          allowNull: true,
        },
      },
      {
        freezeTableName: true,
      }
    );
  
    return lms_requested_course_assign;
  };
  