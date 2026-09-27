const sequelize = require("sequelize")
module.exports = (sequelize, Sequelize) => {
    const docMaintenance = sequelize.define("MM_DOC_MAINTENANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        image_upload: {
            type: Sequelize.STRING,
        },
        
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
     
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    }, {
        freezeTableName: true, 
        
    })
    return docMaintenance
}
