const sequelize = require("sequelize")
module.exports = (sequelize, Sequelize) => {
    const planmaintenance = sequelize.define("MM_PLAN_MAINTENANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        priority: {
            type: Sequelize.STRING,
        },
        maintenance_type: {
            type: Sequelize.STRING,
        },
        start_date: {
            type: Sequelize.STRING,
        },
        end_date: {
            type: Sequelize.STRING,
        },
        frequency: {
            type: Sequelize.STRING,
        },
        maintenance_code: {
            type: Sequelize.STRING,
        },
        approval_require: {
            type: Sequelize.BOOLEAN,
            defaultValue:false
        },
        item_require: {
            type: Sequelize.BOOLEAN,
            defaultValue:false
        },
        asset_require: {
            type: Sequelize.BOOLEAN,
            defaultValue:false
        },
        remark: {
            type: Sequelize.TEXT,
        },
       Approver_remark: {
            type: Sequelize.TEXT,
        },
    
        status_id: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        approver_status:{
            type: Sequelize.ENUM("PENDING", "APPROVED","REJECTED"),
            defaultValue: "PENDING",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    }, {
        freezeTableName: true, 
        
    })
    return planmaintenance
}
