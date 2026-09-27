module.exports = (sequelize, Sequelize) => {
    const proposal_documents = sequelize.define("CRM_PROPOSAL_DOCUMENTS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       documents_name:{
        type: Sequelize.STRING
       },
       documents:{
        type: Sequelize.STRING
       },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ALLOCATED"),
            defaultValue: "ACTIVE"
        },

        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

    }, {
        freezeTableName: true
    });
    return proposal_documents;
}