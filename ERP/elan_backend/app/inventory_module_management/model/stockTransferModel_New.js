module.exports = (sequelize, Sequelize) => {
    const stockTransfer = sequelize.define("STOCK_TRANSFER_NEW", {
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
        transfer_status: {
            type: Sequelize.ENUM("Draft", "Submitted", "Approved", "Dispatched", "In Transit", "Received", "Completed", "Cancelled", "Returned"),
            defaultValue: "Draft"
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
        source_row_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        source_shelf_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        source_section_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        target_row_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        target_shelf_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        target_section_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
    }, {
        freezeTableName: true
    });
    return stockTransfer
}