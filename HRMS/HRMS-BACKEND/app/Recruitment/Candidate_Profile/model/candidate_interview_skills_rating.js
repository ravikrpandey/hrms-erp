module.exports = (sequelize, Sequelize) => {
    const candidate_interview_rating = sequelize.define("RECRUITMENT_CANDIDATE_INTERVIEW_SKILLS_RATING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        interview_round: {
            type: Sequelize.INTEGER,
        },
        skill_name: {
            type: Sequelize.STRING,
        },
        skill_rating: {
            type: Sequelize.STRING
        },
        skill_rating_point: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        });
    return candidate_interview_rating;
};
