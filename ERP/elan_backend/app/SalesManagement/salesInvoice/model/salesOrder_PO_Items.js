const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const salesOrderPOItem = sequelize.define(
        "SALES_ORDER_PO_ITEM_LIST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            quantity: {
                type: Sequelize.STRING
            },
            maximum_discount: {
                type: Sequelize.INTEGER
            },
            discount_request: {
                type: Sequelize.INTEGER
            },
            igst: {
                type: Sequelize.INTEGER
            },
            sgst: {
                type: Sequelize.INTEGER
            },
            cgst: {
                type: Sequelize.INTEGER
            },
            price_per_unit: {
                type: Sequelize.INTEGER
            },

            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
                defaultValue: 'PENDING',
            },
            address: {
                type: Sequelize.STRING,
            },
            customisation: {
                type: Sequelize.JSON,
            },
            customisation_data: {
                type: Sequelize.JSON,
            },
            branding_data: {
                type: Sequelize.JSON,
            },
            apply_scheme: {
                type: Sequelize.BOOLEAN
                
            },
            promo_item: {
                type: Sequelize.BOOLEAN
               
            },
            select_scheme: {
                type: Sequelize.JSON
            },
        },

        {
            freezeTableName: true,
        }
    );

    return salesOrderPOItem;
};