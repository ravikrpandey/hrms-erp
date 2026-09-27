module.exports = (sequelize, Sequelize) => {
    const candidate_bgv = sequelize.define("RECRUITMENT_CANDIDATE_BGV_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        candidate_document: {
            type: Sequelize.STRING
        },
        candidate_description: {
            type: Sequelize.TEXT
        },
        bgv_remarks: {
            type: Sequelize.TEXT
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
    return candidate_bgv;
};
