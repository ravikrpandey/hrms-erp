const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const salesBooking = sequelize.define(
        "SALES_BOOKING",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            advance_adjustment_percentage: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            advance_amount: {
                type: Sequelize.DECIMAL(20, 2),
                allowNull: true
            },
            sales_booking_no: {
                type: Sequelize.STRING
            },
            sales_booking_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            schedule_delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },

            notes: {
                type: Sequelize.STRING
            },

            remark: {
                type: Sequelize.STRING
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },

            booking_status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
                defaultValue: 'PENDING',
            },
            is_book_created: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            is_deviation: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            po_number: {
                type: Sequelize.STRING
            },
            po_date: {
                type: Sequelize.DATEONLY
            }
        },

        {
            freezeTableName: true,
        }
    );

    return salesBooking;
};