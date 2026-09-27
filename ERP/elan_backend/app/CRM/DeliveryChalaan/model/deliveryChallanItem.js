const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const sales_delivery_challan_item = sequelize.define(
        "CRM_DELIVERY_CHALLAN_ITEM_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },          
            
            quantity: {
                type: Sequelize.STRING
            },
            maximum_discount:{
                type:Sequelize.INTEGER
            },
            discount_request:{
                type:Sequelize.INTEGER
            },
            igst:{
                type:Sequelize.INTEGER
            },
            sgst:{
                type:Sequelize.INTEGER
            },
            cgst:{
                type:Sequelize.INTEGER
            },
            price_per_unit:{
                type:Sequelize.INTEGER
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

    return sales_delivery_challan_item;
};