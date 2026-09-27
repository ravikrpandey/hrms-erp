const sequelize = require("sequelize")
module.exports = (sequelize, Sequelize) => {
    const remarkMaintenance = sequelize.define("MM_REMARK_MAINTENANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        remark: {
            type: Sequelize.TEXT,
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
    return remarkMaintenance
}
