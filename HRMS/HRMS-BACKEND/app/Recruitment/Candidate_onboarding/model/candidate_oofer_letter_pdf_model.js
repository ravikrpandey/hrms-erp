module.exports = (sequelize, Sequelize) => {
    const candidate_offer_letter_doc = sequelize.define("RECRUITMENT_CAND_OFFER_LETTER_DOC", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        offer_letter_doc: {
            type: Sequelize.STRING
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
        { freezeTableName: true });
    return candidate_offer_letter_doc;
};
