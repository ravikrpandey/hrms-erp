module.exports = (sequelize, Sequelize) => {
    const lmsQuestionAttempt = sequelize.define(
      "LMS_QUESTION_ATTEMPT",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        submission_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: "ID of the assessment submission",
        },
        // question_id: {
        //   type: Sequelize.INTEGER,
        //   allowNull: false,
        //   comment: "ID of the question attempted",
        // },
        is_correct: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          comment: "Whether the question was answered correctly",
        },
        employee_answer: {
          type: Sequelize.STRING,
          allowNull: true,
          comment: "Answer provided by the employee",
        },
      },
      {
        freezeTableName: true,
        timestamps: true,
      }
    );
  
    return lmsQuestionAttempt;
  };
  