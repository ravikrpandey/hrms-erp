const Sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {

    const SalesReturnChargeMaster = sequelize.define(
        "SALES_RETURN_CHARGE_MASTER",
        {

            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            rule_code: {
                type: Sequelize.STRING(50),
                unique: true,
            },

            rule_name: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },

            reference_type: {
                type: Sequelize.ENUM(
                    "SO_CANCEL",
                    "INVOICE_CANCEL",
                    "GOODS_RETURN"
                ),
                allowNull: false,
            },

            charge_type: {
                type: Sequelize.ENUM(
                    "RESTOCKING",
                    "LOGISTICS",
                    "CANCELLATION",
                    "PENALTY",
                    "DAMAGE",
                    "HANDLING"
                ),
                allowNull: false,
            },

            calculation_type: {
                type: Sequelize.ENUM("FLAT", "PERCENT"),
                allowNull: false,
            },

            value: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },

            apply_on: {
                type: Sequelize.ENUM(
                    "ORDER_VALUE",
                    "ITEM_VALUE",
                    "RETURN_VALUE",
                    "FIXED"
                ),
                defaultValue: "ORDER_VALUE",
            },

            min_days: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },

            max_days: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },

            priority: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            },

            is_branding: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },

            is_customization: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },

            customer_type: {
                type: Sequelize.ENUM(
                    "ALL",
                    "RETAIL",
                    "WHOLESALE",
                    "VIP"
                ),
                defaultValue: "ALL",
            },

            min_order_value: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
            },

            max_order_value: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
            },

            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            }

        },
        {
            freezeTableName: true,
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    return SalesReturnChargeMaster;
};