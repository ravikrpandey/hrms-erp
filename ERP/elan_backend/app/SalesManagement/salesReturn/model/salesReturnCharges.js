const Sequelize = require("sequelize");
const db = require("../../../models/index");

module.exports = (sequelize, Sequelize) => {

    const salesReturnCharges = sequelize.define(
        "SALES_RETURN_CHARGES",
        {

            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            sales_return_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            charge_type: {
                type: Sequelize.ENUM(
                    "CANCELLATION",
                    "RESTOCKING",
                    "LOGISTICS",
                    "DAMAGE",
                    "PENALTY"
                ),
                allowNull: false,
            },

            calculation_type: {
                type: Sequelize.ENUM(
                    "FLAT",
                    "PERCENT"
                ),
                defaultValue: "FLAT",
            },

            value: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            amount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            gst_amount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            total_amount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            remarks: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM(
                    "ACTIVE",
                    "INACTIVE"
                ),
                defaultValue: "ACTIVE",
            },

            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },

        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );

   

    return salesReturnCharges;
};