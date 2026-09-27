module.exports = (sequelize, Sequelize) => {
    const stockTransfer = sequelize.define("RECEIVE_STOCK_TRANSFER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        random_id: {
            type: Sequelize.STRING
        },
        stock_entry_type: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATEONLY, 
            allowNull: true
        },
        reason: {
            type: Sequelize.STRING,
        },
        received_by: {
            type: Sequelize.STRING,
        },
        date_received: {
            type: Sequelize.DATEONLY, 
            allowNull: true
        },
        acknowledged: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        remarks: {
            type: Sequelize.TEXT
        },
        default_status: {
            type: Sequelize.ENUM("Pending","Completed"),
            defaultValue: "Pending"
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
    return stockTransfer
}