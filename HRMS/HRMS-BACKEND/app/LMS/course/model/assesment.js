module.exports = (sequelize, Sequelize) => {
    const lmsCourseAssessmentDetails = sequelize.define(
      "LMS_COURSE_ASSESSMENT",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        assessment_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        total_marks: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        pass_percentage: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        assessment_time_minutes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: "Time allowed for assessment in minutes",
        },
        max_attempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: "Maximum number of attempts allowed for this assessment",
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          comment: "Soft delete flag",
        },
        status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
          allowNull: true,
          comment: "Status of the assessment",
        },
      },
      {
        freezeTableName: true,
        timestamps: true, 
        comment: "Table to store course assessments",
      }
    );
  
    return lmsCourseAssessmentDetails;
  };
  