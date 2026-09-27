const Sequelize = require("sequelize");
const db = require("../../../models/index");

module.exports = (sequelize, DataTypes) => {

    const salesReturnItem = sequelize.define(
        "SALES_RETURN_ITEM_LIST",
        {

            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

           

            qty: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0,
            },

            return_qty: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0,
            },

            rate: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            discount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            gst: {
                type: Sequelize.DECIMAL(5, 2),
                defaultValue: 0,
            },

            total: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            serial_no: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            batch_no: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM(
                    "PENDING",
                    "APPROVED",
                    "REJECTED",
                    "RECEIVED"
                ),
                defaultValue: "PENDING",
            },

            remarks: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            return_reason: {
                type: Sequelize.TEXT,
                allowNull: true,
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

    

    return salesReturnItem;
};