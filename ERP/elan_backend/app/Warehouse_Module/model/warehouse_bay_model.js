module.exports = (sequelize, Sequelize) => {
    const WAREHOUSE_BAY = sequelize.define("WAREHOUSE_BAY", {
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
        volume: {
            type: Sequelize.INTEGER
        },
        item_category: {
            type: Sequelize.JSON,
            allowNull: false
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
    return WAREHOUSE_BAY
}   