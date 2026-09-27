const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const deliveryOrderApprovalLevel = sequelize.define(
        "SALES_DELIVERY_ORDER_APPROVAL_LEVEL",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            level: {
                type: Sequelize.STRING
            },
            approval_status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
                defaultValue: 'PENDING',
            },
            progress_status: {
                type: Sequelize.ENUM('OPEN', 'CLOSE'),
                defaultValue: 'OPEN',
            },
            remarks: {
                type: Sequelize.STRING
            },
          
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE',
            },
        },

        {
            freezeTableName: true,
        }
    );

    return deliveryOrderApprovalLevel;
};