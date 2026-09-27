module.exports = (sequelize, Sequelize) => {
    const candidate_interview = sequelize.define("RECRUITMENT_CANDIDATE_INTERVIEW", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        interview_round: {
            type: Sequelize.INTEGER,
        },
        interview_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
        interview_time: {
            type: Sequelize.STRING
        },
        final_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED"),
            defaultValue: "PENDING",
        },
        round_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED"),
            defaultValue: "PENDING",
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
    return candidate_interview;
};
