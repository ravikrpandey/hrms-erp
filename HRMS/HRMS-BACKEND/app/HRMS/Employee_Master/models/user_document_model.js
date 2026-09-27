module.exports = (sequelize, Sequelize) => {
    const user_documents = sequelize.define("HRMS_REGISTERED_USER_DOCUMENTS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_name: {
            type: Sequelize.STRING,
        },
        document_description: {
            type: Sequelize.STRING,
        },
        documents: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    }, {
        freezeTableName: true
    });
    return user_documents;
};