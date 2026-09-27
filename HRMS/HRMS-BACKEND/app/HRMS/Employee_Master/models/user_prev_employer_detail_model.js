module.exports = (sequelize, Sequelize) => {
    const previous_employer = sequelize.define("HRMS_USER_PREVIOUS_EMPLOYER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        company_name: {
            type: Sequelize.STRING,
        },
        from_date: {
            type: Sequelize.STRING,
        },
        to_date: {
            type: Sequelize.STRING,
        },
        last_salary: {
            type: Sequelize.STRING,
        },
        reason_of_leaving: {
            type: Sequelize.STRING,
        },
        location: {
            type: Sequelize.STRING,
        },
        position: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    }, {
        freezeTableName: true
    });
    return previous_employer;
};