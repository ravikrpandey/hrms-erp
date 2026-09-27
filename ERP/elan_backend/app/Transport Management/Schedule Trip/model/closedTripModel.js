

module.exports = (sequelize, Sequelize) => {
    const close_trip = sequelize.define("CLOSED_TRIP", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        upload_pod: {
            type: Sequelize.STRING
        },
        remaks: {
            type: Sequelize.STRING
        },
        trip_end_km: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
    });

    return close_trip;
};
