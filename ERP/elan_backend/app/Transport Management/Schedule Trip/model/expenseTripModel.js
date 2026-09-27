module.exports = (sequelize, Sequelize) => {
    const expense_trip = sequelize.define("TRIP_EXPENSE_INFO", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        expense_date: {
            type: Sequelize.DATEONLY
        },
        expense_amount: {
            type: Sequelize.INTEGER
        },
        expense_document: {
            type: Sequelize.STRING
        },
        expense_des: {
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

    return expense_trip;
};
