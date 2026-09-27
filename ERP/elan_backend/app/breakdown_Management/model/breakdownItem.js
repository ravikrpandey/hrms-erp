const sequelize = require("sequelize")
module.exports = (sequelize, Sequelize) => {
    const addbreakdownItem = sequelize.define("ADD_BREAKDOWN_ITEM", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quantity: {
            type: Sequelize.INTEGER,
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
    return addbreakdownItem
}
