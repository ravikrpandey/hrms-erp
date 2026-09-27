module.exports = (sequelize, Sequelize) => {
    const companyDepreciationDocs = sequelize.define("ASSETCOMPANYDEPRECIATION_DOCS", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        po_itemId:{
            type: Sequelize.INTEGER,
        },

        attachment: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        }
    )
    return companyDepreciationDocs;
}