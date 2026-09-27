module.exports = (sequelize, Sequelize) => {
    const stockTransferList = sequelize.define("STOCK_TRANSFER_LIST_NEW", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quantity: {
            type: Sequelize.STRING
        },
        batch_no: {
            type: Sequelize.STRING,
            allowNull: true
        },
        basic_rate: {
            type: Sequelize.STRING,
            allowNull: true
        },
        value: {
            type: Sequelize.STRING,
            allowNull: true
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