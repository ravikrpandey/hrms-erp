module.exports = (sequelize, Sequelize) => {
    const stockTransfer = sequelize.define("STOCK_TRANSFER", {
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
        driver_name: {
            type: Sequelize.STRING,
        },
        expected_transfer_date: {
            type: Sequelize.DATEONLY, 
            allowNull: true
        },
        vehicle_no: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        uploadedFile: {
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