module.exports = (sequelize, Sequelize) => {
    const purchase_order_service = sequelize.define("PROCUREMENT_PURCHASE_ORDER_SERVICE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        po_type: {
            type: Sequelize.ENUM("Capex", "Opex")
        },
        total_mvp: {
            type: Sequelize.INTEGER,
        },
        tax: {
            type: Sequelize.INTEGER,
        },
        total_cgst: {
            type: Sequelize.DECIMAL(20,2),
        },
        total_sgst: {
            type: Sequelize.DECIMAL(20,2),
        },
        total_igst: {
            type: Sequelize.DECIMAL(20,2),
        },
        total_discount: {
            type: Sequelize.DECIMAL(20,2),
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        unit_price: {
            type: Sequelize.INTEGER,
        },
        grand_total:{
             type: Sequelize.DECIMAL(30,2),
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
    return purchase_order_service;
};
