module.exports = (sequelize, Sequelize) => {
  const AssignCourse = sequelize.define(
    "LMS_ASSIGN_COURSE",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // course_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      // },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING, // For storing 'designation', 'department', etc.
        allowNull: false,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      entity_id: {
        type: Sequelize.JSON
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return AssignCourse;
};
