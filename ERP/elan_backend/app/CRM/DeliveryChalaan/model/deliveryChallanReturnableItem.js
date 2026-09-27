const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const sales_delivery_challan_returnable_item = sequelize.define(
        "CRM_CHALLAN_RETURNABLE_ITEM_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
           
            
            quantity: {
                type: Sequelize.STRING
            },
            
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
                defaultValue: 'PENDING',
            },
        },

        {
            freezeTableName: true,
        }
    );

    return sales_delivery_challan_returnable_item;
};