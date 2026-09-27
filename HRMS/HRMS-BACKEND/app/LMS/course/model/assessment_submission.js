module.exports = (sequelize, Sequelize) => {
    const lmsAssessmentSubmission = sequelize.define(
      "LMS_ASSESSMENT_SUBMISSION",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        employee_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: "ID of the employee who attempted the assessment",
        },
        total_marks: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: "Total marks available for the assessment",
        },
        obtained_marks: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: "Marks obtained by the employee",
        },
        status: {
          type: Sequelize.ENUM("PENDING", "PASS", "FAIL"),
          allowNull: false,
          defaultValue: "PENDING",
          comment: "Result status of the attempt",
        },
        attempt_date: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          comment: "Date and time of the attempt",
        },
      },
      {
        freezeTableName: true,
        timestamps: true,
      }
    );
  
    return lmsAssessmentSubmission;
  };
  