module.exports = (sequelize, Sequelize) => {
    const stockLocation = sequelize.define("STOCK_LOCATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        block_id: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        bay_id: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        rack_id: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        stock_request: {
            type: Sequelize.ENUM("APPROVED","REJECTED","PENDING"),
            defaultValue: "PENDING"
        },
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        stock_status: {
            type: Sequelize.ENUM("STOCK_TRANSFERED","TRANSFER_REQUEST","PENDING"),
            defaultValue: "PENDING"
        },
        transfer_quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        internal_transfer_status: {
            type: Sequelize.ENUM("PENDING","INTERNAL_TRANSFERED"),
            defaultValue: "PENDING"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

    }, {
        freezeTableName: true
    });

    return stockLocation;
};