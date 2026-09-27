module.exports = (sequelize, Sequelize) => {
    const user_allowance = sequelize.define("HRMS_REGISTERED_USER_ALLOWANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        allowance_name: {
            type: Sequelize.STRING,
        },
        allowance_amount: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    }, {
        freezeTableName: true
    });
    return user_allowance;
};