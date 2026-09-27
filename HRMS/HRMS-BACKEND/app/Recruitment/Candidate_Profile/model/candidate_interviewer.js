module.exports = (sequelize, Sequelize) => {
    const candidate_interviewer = sequelize.define("RECRUITMENT_CANDIDATE_INTERVIEWER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        interview_round: {
            type: Sequelize.INTEGER
        },
        final_remarks: {
            type: Sequelize.TEXT
        },
        progress_status: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN",
        },
        interview_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED","ONGOING"),
            defaultValue: "PENDING",
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
    return candidate_interviewer;
};
