const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const sales_delivery_challan = sequelize.define(
        "CRM_DELIVERY_CHALLAN_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            do_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            do_no: {
                type: Sequelize.STRING
            },
            customer_name: {
                type: Sequelize.STRING
            },
            customer_code: {
                type: Sequelize.STRING
            },

            customer_billing_pin: {
                type: Sequelize.STRING
            },
            customer_billing_add1: {
                type: Sequelize.STRING
            },
            customer_billing_add2: {
                type: Sequelize.STRING
            },
            billing_pin: {
                type: Sequelize.STRING
            },
            states_code: {
                type: Sequelize.STRING
            },
            billing_add1: {
                type: Sequelize.STRING
            },
            billing_add2: {
                type: Sequelize.STRING
            },
            supplier_gst: {
                type: Sequelize.STRING
            },
            gst_supplier_name: {
                type: Sequelize.STRING
            },
            trade_name: {
                type: Sequelize.STRING
            },

            shipping_pin: {
                type: Sequelize.STRING
            },
            shipping_add1: {
                type: Sequelize.STRING
            },
            shipping_add2: {
                type: Sequelize.STRING
            },
            challanDoc: {
                type: Sequelize.STRING
            },
            customer_gst_number: {
                type: Sequelize.STRING
            },
            notes: {
                type: Sequelize.STRING
            },
            terms_and_conditions: {
                type: Sequelize.STRING
            },
            remark: {
                type: Sequelize.STRING
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            challan_type_status: {
                type: Sequelize.ENUM('DIRECT', 'INDIRECT'),
                allowNull: true,
                defaultValue: null,
            },
            delChallan_supply_type: {
                type: Sequelize.INTEGER
            },
            eway_type: {
                type: Sequelize.ENUM('DIRECT', 'INDIRECT'),
                allowNull: true,
                defaultValue: null,
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

    return sales_delivery_challan;
};