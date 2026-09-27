module.exports = (sequelize, Sequelize) => {
    const candidate_docs = sequelize.define("RECRUITMENT_CANDIDATE_BGV_DOCS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_name: {
            type: Sequelize.STRING
        },
        document_number: {
            type: Sequelize.STRING
        },
        document_path: {
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
        {
            freezeTableName: true,
        });
    return candidate_docs;
};
