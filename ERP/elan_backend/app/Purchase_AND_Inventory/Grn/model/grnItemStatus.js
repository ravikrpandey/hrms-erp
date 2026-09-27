module.exports = (sequelize, Sequelize) => {
    const grnItemStatus = sequelize.define("GRN_ITEM_STATUS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        batchType: {
            type: Sequelize.STRING
        },
        batchNo: {
            type: Sequelize.STRING
        },
        expiryDate: {
            type: Sequelize.DATEONLY
        },
        itemSerialNo: {
            type: Sequelize.STRING,
            unique: true
        },
        Item_name: {
            type: Sequelize.STRING
        },
        asset_tagId: {
            type: Sequelize.STRING
        },
        itemStatus: {
            type: Sequelize.ENUM("SELECTED", "REJECTED", "NOT RECEIVED"),
            defaultValue: "SELECTED"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        allocation_status: {
            type: Sequelize.ENUM("SELECTED", "PENDING"),
            defaultValue: "PENDING"
        },
        asset_loc_status: {
            type: Sequelize.ENUM("ALLOCATED", "DEALLOCATED"),
            allowNull: true,
            defaultValue: null
        },
        allocation_type: {
            type: Sequelize.ENUM('allocated to employee', 'transfer to other location'),
            allowNull: true,
            defaultValue: null
        },
    }, {
        freezeTableName: true
    });

    return grnItemStatus;
};