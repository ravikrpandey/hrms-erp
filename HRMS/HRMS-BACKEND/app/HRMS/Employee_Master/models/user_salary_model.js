module.exports = (sequelize, Sequelize) => {
    const user_salary = sequelize.define("HRMS_REGISTERED_USER_SALARY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        salary_Year: {
            type: Sequelize.STRING,
        },
        salary_month: {
            type: Sequelize.STRING,
        },
        new_salary: {
            type: Sequelize.STRING,
        },
        old_salary: {
            type: Sequelize.STRING,
        },
        percent_increment: {
            type: Sequelize.STRING,
        },
        remarks: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    }, {
        freezeTableName: true
    });
    return user_salary;
};