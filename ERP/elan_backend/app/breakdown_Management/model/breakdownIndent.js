const sequelize = require("sequelize")
module.exports = (sequelize, Sequelize) => {
    const addbreakdown = sequelize.define("ADD_BREAKDOWN_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        line: {
            type: Sequelize.TEXT,
        },
        remark: {
            type: Sequelize.TEXT,
        },
        status_id: {
            type: Sequelize.INTEGER,
        },
        image_upload: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
        },
        breakdown_code: {
            type: Sequelize.STRING,
            unique: true, 
        },
        priority: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.TEXT,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        breakSatus:{
            type: Sequelize.ENUM("PENDING", "ASSIGNED"),
            defaultValue: "PENDING",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    }, {
        freezeTableName: true, 
        
    })
    return addbreakdown
}
