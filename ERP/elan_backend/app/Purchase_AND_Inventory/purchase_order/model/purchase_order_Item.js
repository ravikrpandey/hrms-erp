module.exports = (sequelize, Sequelize) => {
    const purchase_order_item = sequelize.define("PROCUREMENT_PURCHASE_ORDER_ITEM", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_mvp: {
            type: Sequelize.DECIMAL(30, 2),
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        unit_price: {
            type: Sequelize.DECIMAL(30, 2),
        },
        grand_total: {
            type: Sequelize.DECIMAL(30, 2),
        },
        gst_percentage: {
            type: Sequelize.DECIMAL(20, 2),
        },
        discount_percentage: {
            type: Sequelize.DECIMAL(20, 2),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        });
    return purchase_order_item;
};
