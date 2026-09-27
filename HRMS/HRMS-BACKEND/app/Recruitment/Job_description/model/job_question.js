const { compare } = require("mathjs");

module.exports = (sequelize, Sequelize) => {
    const job_descripition_question = sequelize.define("RECRUITMENT_JOB_QUESTION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        question: {
            type: Sequelize.STRING,
        },
        answer: {
            type: Sequelize.ENUM("YES", "NO"),
        },
        selection_answer: {
            type: Sequelize.ENUM("YES", "NO"),
        },
        selection_status: {
            type: Sequelize.ENUM("SELECTED", "REJECTED"),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
       },
        {
            freezeTableName: true,
        });
    return job_descripition_question;
};
