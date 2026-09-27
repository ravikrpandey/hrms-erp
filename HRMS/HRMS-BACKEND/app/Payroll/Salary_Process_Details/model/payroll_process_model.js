module.exports = (sequelize, Sequelize) => {
    const payroll_process = sequelize.define("HRMS_PAYROLL_PROCESS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        process_id: {
            type: Sequelize.STRING,
        },
        pay_slip_month: {
            type: Sequelize.INTEGER,
        },
        pay_slip_year: {
            type: Sequelize.INTEGER,
        },
        payroll_status: {
            type: Sequelize.ENUM("HOLD", "PROCESSED","INACTIVE"),
            defaultValue: "PROCESSED",
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        }
    );
    return payroll_process;
};