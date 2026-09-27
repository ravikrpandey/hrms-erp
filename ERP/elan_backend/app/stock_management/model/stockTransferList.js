module.exports = (sequelize, Sequelize) => {
    const stockTransferList = sequelize.define("STORE_STOCK_TRANSFER_LIST", {
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
    return stockTransferList
}