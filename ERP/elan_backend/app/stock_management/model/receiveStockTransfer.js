module.exports = (sequelize, Sequelize) => {
    const receive_store_stock_transfer = sequelize.define("RECEIVE_STORE_STOCK_TRANSFER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        stock_entry_type: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATEONLY, 
            allowNull: true
        },
        date_recieved: {
            type: Sequelize.DATEONLY, 
            allowNull: true
        },
        reason: {
            type: Sequelize.STRING,
        },
        recieve_by: {
            type: Sequelize.STRING,
        },
        expected_transfer_date: {
            type: Sequelize.DATEONLY, 
            allowNull: true
        },
        acknowledge: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        remarks: {
            type: Sequelize.TEXT
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
    return receive_store_stock_transfer
}