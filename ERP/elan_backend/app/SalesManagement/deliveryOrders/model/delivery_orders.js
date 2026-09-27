const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const delivery_orders = sequelize.define(
        "SALES_DELIVERY_ORDER_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            delivery_doc_code: {
                type: Sequelize.STRING
            },
            ref_invoice_no: {
                type: Sequelize.STRING
            },
            customer_name: {
                type: Sequelize.STRING
            },
            create_date: {
                type: Sequelize.STRING
            },
            source_warehouse_id: {
                type: Sequelize.INTEGER
            },
           
            shipping_address: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            state: {
                type: Sequelize.STRING
            },
            pincode: {
                type: Sequelize.STRING
            },
            country: {
                type: Sequelize.STRING
            },
            receiving_person_name: {
                type: Sequelize.STRING
            },
            receiving_person_contact: {
                type: Sequelize.STRING
            },
            transport: {
                type: Sequelize.STRING
            },
            vehicle_number: {
                type: Sequelize.STRING
            },
            driver: {
                type: Sequelize.STRING
            },
            driver_contact_number: {
                type: Sequelize.STRING
            },
            remarks: {
                type: Sequelize.STRING
            },
            upload_photo: {
                type: Sequelize.STRING,
                allowNull: true,
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

    return delivery_orders;
};