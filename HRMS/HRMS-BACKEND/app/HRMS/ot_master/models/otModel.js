module.exports = (sequelize, Sequelize) => {
    const overTime = sequelize.define("OVERTIME_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        from_range: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        to_range: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        rate: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0.00
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(false, true),
            defaultValue: false,
        }
    }, {
        freezeTableName: true
    });
    return overTime;
};