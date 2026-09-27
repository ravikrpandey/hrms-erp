module.exports = (sequelize, Sequelize) => {
    const stockTransferList = sequelize.define("RECEIVED_STOCK_TRANSFER_LIST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quantity: {
            type: Sequelize.STRING
        },
       
        quantities_damaged: {
            type: Sequelize.STRING
        },
        accepted_quantities: {
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