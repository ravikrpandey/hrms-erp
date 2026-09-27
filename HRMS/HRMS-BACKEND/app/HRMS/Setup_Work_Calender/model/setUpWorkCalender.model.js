module.exports = (sequelize, Sequelize) => {
    const setupWorkCalender = sequelize.define('SETUP_WORK_CALENDERS', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        month_name: {
            type: Sequelize.STRING
        },
        week_name: {
            type: Sequelize.STRING
        },
        week_1st: {
            type: Sequelize.STRING
        },
        week_2nd: {
            type: Sequelize.STRING
        },
        week_3rd: {
            type: Sequelize.STRING
        },
        week_4th: {
            type: Sequelize.STRING
        },
        week_5th: {
            type: Sequelize.STRING
        },
        createdBy: {
            type: Sequelize.INTEGER,
        },
        check_week: {
            type: Sequelize.BOOLEAN(true, false),
        },
        employee_id:{
            type: Sequelize.STRING
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
    });
    return setupWorkCalender;
}