module.exports = (sequelize, Sequelize) => {
    const shift = sequelize.define("MASTER_SHIFT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        financial_year_id: {
            type: Sequelize.INTEGER
        },
        entity_id: {
            type: Sequelize.INTEGER
        },
        shift_name: {
            type: Sequelize.STRING
        },
        shift_time: {
            type: Sequelize.STRING
        },
        shift_duration: {
            type: Sequelize.STRING
        },
        grace_period: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: new Date,
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: new Date,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return shift;
}