module.exports = (sequelize, Sequelize) => {
    const WAREHOUSE_BIN = sequelize.define("WAREHOUSE_BIN", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        area: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        item_category: {
            type: Sequelize.JSON,
            allowNull: false
        },
        volume: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        capacity: {
            type: Sequelize.INTEGER,
            defaultValue: 1000
        },
        remaining_capacity: {
            type: Sequelize.INTEGER,
            defaultValue: 1000
        },
    }, {
        freezeTableName: true
    });
    return WAREHOUSE_BIN
}   