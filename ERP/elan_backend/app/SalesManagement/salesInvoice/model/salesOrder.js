const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const salesOrder = sequelize.define(
        "SALES_ORDER_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sales_order_no: {
                type: Sequelize.STRING
            },
            elan_sales_order_no: {
                type: Sequelize.STRING
            },
            invoice_no: {
                type: Sequelize.STRING
            },
            sales_order_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            customisation_branding_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            delivered_on_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            expected_delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            expected_dispatch_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            elan_so_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            file: {
                type: Sequelize.STRING,
                
            },
            pincode: {
                type: Sequelize.INTEGER
            },
            postal_address: {
                type: Sequelize.TEXT
            },
            address: {
                type: Sequelize.TEXT
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
            pod_remark: {
                type: Sequelize.STRING
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_dispatched: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_proceed_to_dispatched: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_deviation: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            so_invoice: {
                type: Sequelize.STRING,
            },
            expected_delivery_days: {
                type: Sequelize.INTEGER,
            },
           
            status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
                defaultValue: 'PENDING',
            },
            dispatch_status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
                defaultValue: 'PENDING',
            },
            invoice_status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED',),
                defaultValue: 'PENDING',
            },
            payment_status: {
                type: Sequelize.ENUM("UNPAID", "PAID","PARTIALLY PAID"),
                defaultValue: "UNPAID"
            },
        },
        {
            freezeTableName: true,
        }
    );

    return salesOrder;
};