module.exports = (sequelize, Sequelize) => {
    const receive_store_stock_transfer_list = sequelize.define("RECEIVE_STORE_STOCK_TRANSFER_LIST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quantity: {
            type: Sequelize.STRING
        },
        item_code: {
            type: Sequelize.STRING
        },
        accepted_qty: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE","ALLOCATED"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });
    return receive_store_stock_transfer_list
}