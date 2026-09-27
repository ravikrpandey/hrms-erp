module.exports = (sequelize, Sequelize) => {
    const lmsCourseQuestionDetails = sequelize.define(
      "LMS_COURSE_QUESTION",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        question_text: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: "Text of the question",
        },
        question_type: {
          type: Sequelize.ENUM("MCQ", "TEXT", "TRUE_FALSE"),
          allowNull: false,
          defaultValue: "MCQ",
          comment: "Type of question (e.g., Multiple Choice, Text, True/False)",
        },
        options: {
          type: Sequelize.JSON,
          allowNull: true,
          comment: "JSON object for storing options for MCQ type questions",
        },
        correct_answer: {
          type: Sequelize.STRING,
          allowNull: true,
          comment: "Correct answer for the question",
        },
        marks: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment: "Marks allocated for the question",
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
          comment: "Status of the question",
        },
      },
      {
        freezeTableName: true,
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
        comment: "Table to store questions for course assessments",
      }
    );
  
    return lmsCourseQuestionDetails;
  };
  