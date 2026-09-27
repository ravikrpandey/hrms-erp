module.exports = (sequelize, Sequelize) => {
    const employee_minute = sequelize.define("MASTER_EMPLOYEE_MINUTE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
        {
            freezeTableName: true
        }
    );

    return employee_minute;
};
