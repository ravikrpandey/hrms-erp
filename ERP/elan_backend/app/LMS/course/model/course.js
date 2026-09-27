module.exports = (sequelize, Sequelize) => {
    const lmsCourseDetails = sequelize.define(
      "LMS_COURSE",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        course_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        thumbnail: {
          type: Sequelize.STRING,
          allowNull: false,
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
  
    return lmsCourseDetails;
  };
  