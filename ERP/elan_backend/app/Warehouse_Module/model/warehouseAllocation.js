module.exports = (sequelize, Sequelize) => {
    const WarehouseAllocation = sequelize.define("WAREHOUSE_ALLOCATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        area: {
            type: Sequelize.DECIMAL(20, 2)
        },
        receiveQty: {
            type: Sequelize.DECIMAL(20, 2)
        },
        barcode_no: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        allocation_status: {
            type: Sequelize.ENUM("PENDING", "ALLOCATED", "REJECTED"),
            defaultValue: "PENDING"
        },
        order_status: {
            type: Sequelize.ENUM("PENDING", "ALLOCATED", "DELIVERD"),
            defaultValue: "PENDING"
        },
        
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });
    return WarehouseAllocation
}