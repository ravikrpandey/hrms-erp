module.exports = (sequelize, Sequelize) => {
    const lmsRequestedCourse = sequelize.define(
      "LMS_REQUESTED_COURSE",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        allocate_by_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        employee_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        remark: {
          type: Sequelize.STRING,
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        final_status: {
          type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
          defaultValue: "PENDING"
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
  
    return lmsRequestedCourse;
  };
  