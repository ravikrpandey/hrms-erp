const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const salesReturnMst = sequelize.define(
        "SALES_RETURN_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            reference_type: {
                type: Sequelize.ENUM(
                    "SO_CANCEL",
                    "INVOICE_CANCEL",
                    "GOODS_RETURN"
                ),
                allowNull: false,
            },

            return_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },

            return_no: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM(
                    "DRAFT",
                    "PENDING_APPROVAL",
                    "APPROVED",
                    "REJECTED",
                    "POSTED"
                ),
                defaultValue: "DRAFT",
            },

            total_amount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            total_charge: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            net_amount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },

           
        },

        {
            freezeTableName: true,
        }
    );

    return salesReturnMst;
};