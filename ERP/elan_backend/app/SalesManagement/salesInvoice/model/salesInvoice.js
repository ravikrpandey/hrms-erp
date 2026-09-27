const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const salesInvoice = sequelize.define(
        "SALES_INVOICE_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            invoice_doc_code: {
                type: Sequelize.STRING
            },
            supply_now: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            payment_due_days: {
                type: Sequelize.STRING
            },
            due_charges: {
                type: Sequelize.DECIMAL(20, 2),
                allowNull: true,
                defaultValue: null,
            },
            sales_invoice_create_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            delivery_created: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            details_photo: {
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

    return salesInvoice;
};