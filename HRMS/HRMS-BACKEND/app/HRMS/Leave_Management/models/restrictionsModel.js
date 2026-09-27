const HrmsLeaveMaster = require("./leaveMaster");


module.exports = (sequelize, Sequelize) => {
    const hrmsLeaveRestrictions = sequelize.define("HRMS_LEAVE_POLICY_RESTRICTIONS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(false, true),
            defaultValue: false
        },
        past_days: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        future_next: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        future_advanceDays: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        maxRequest: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        minRequest: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        freezeTableName: true,
        timestamps: true // Adds createdAt and updatedAt fields
    });
    return hrmsLeaveRestrictions;
};

