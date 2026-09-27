module.exports = (sequelize, Sequelize) => {
    const candidate_offer_allowance = sequelize.define("RECRUITMENT_CANDIDATE_ALLOWANCE_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        allowance_name: {
            type: Sequelize.STRING
        },
        allowance_amount: {
            type: Sequelize.INTEGER,
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
    return candidate_offer_allowance;
};
