module.exports = (sequelize, Sequelize) => {
    const candidate_answer = sequelize.define("RECRUITMENT_CANDIDATE_ANSWERS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        selection_answer: {
            type: Sequelize.STRING
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
    return candidate_answer;
};
