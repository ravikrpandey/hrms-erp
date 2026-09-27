module.exports = (sequelize, Sequelize) => {
    const travel_request = sequelize.define("FINANCE_TRAVEL_ADVANCE_BOOKING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_amount: {
            type: Sequelize.DECIMAL(12, 2)
        },
        payment_type: {
           type: Sequelize.ENUM("Petty_Cash", "Bank"),
            defaultValue: "Petty_Cash"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ALLOCATED"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    },
        {
            freezeTableName: true,
        }
    );
    return travel_request;
};