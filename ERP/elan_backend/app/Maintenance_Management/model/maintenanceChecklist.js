const sequelize = require("sequelize")
module.exports = (sequelize, Sequelize) => {
    const maintenanceCheckList = sequelize.define("MM_MAINTENANCE_CHECK_LIST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
    return maintenanceCheckList
}
