module.exports = (sequelize, Sequelize) => {
    const grnItem = sequelize.define("GRN_ITEM", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        receiveQty: {
            type: Sequelize.INTEGER
        },
        invoice_qty: {
            type: Sequelize.INTEGER
        },
        po_qty: {
            type: Sequelize.INTEGER
        },
        rejectQty: {
            type: Sequelize.INTEGER
        },
        remaining_qty: {
            type: Sequelize.INTEGER
        },
        selection_item: {
            type: Sequelize.INTEGER
        },
        invoice_status: {
            type: Sequelize.ENUM("PENDING", "COMPLETED"),
            defaultValue: "PENDING"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        amount:{
            type: Sequelize.DECIMAL(10,2)
        },
        total_mvp:{
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    });

    return grnItem;
};