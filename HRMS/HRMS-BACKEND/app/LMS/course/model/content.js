module.exports = (sequelize, Sequelize) => {
    const lmsCourseContentDetails = sequelize.define(
      "LMS_COURSE_CONTENT",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content_file_path: {
          type: Sequelize.STRING,
        },
        content_file_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content_file_link: {
          type: Sequelize.STRING,
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
  
    return lmsCourseContentDetails;
  };
  