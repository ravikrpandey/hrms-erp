module.exports = (sequelize, Sequelize) => {
    const candidate_offer_letter = sequelize.define("RECRUITMENT_CANDIDATE_OFFER_LETTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        base_salary: {
            type: Sequelize.INTEGER,
        },
        reference_number: {
            type: Sequelize.STRING
        },
        probation_period: {
            type: Sequelize.STRING
        },
        exp_joining_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD")
        },
        offer_remarks: {
            type: Sequelize.TEXT
        },
        candidate_remarks: {
            type: Sequelize.TEXT
        },
        approval_remarks: {
            type: Sequelize.TEXT
        },
        location: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        approval_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED","REJECTED","GENERATED","ONBOARDED"),
            defaultValue: "PENDING",
        },
        candidate_offer_status: {
            type: Sequelize.ENUM("PENDING", "ACCEPTED","REJECTED","ONBOARDED"),
            defaultValue: "PENDING",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        });
    return candidate_offer_letter;
};
