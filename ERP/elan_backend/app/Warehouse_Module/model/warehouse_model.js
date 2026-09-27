module.exports = (sequelize, Sequelize) => {
    const warehouse = sequelize.define("WAREHOUSE_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        area: {
            type: Sequelize.DECIMAL(20, 2)
        },
        address: {
            type: Sequelize.STRING
        },
        pin: {
            type: Sequelize.STRING
        },
        gst: {
            type: Sequelize.STRING
        },
        pan_tin: {
            type: Sequelize.STRING
        },
        license_number: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        inOut: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: "NO"
        },
        postal_address: {
            type: Sequelize.JSON
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
    return warehouse
}