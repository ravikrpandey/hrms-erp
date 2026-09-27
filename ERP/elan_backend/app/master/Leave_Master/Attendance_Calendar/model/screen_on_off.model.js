module.exports = (sequelize, Sequelize) => {
    const screenOnOff_Details = sequelize.define("MASTER_SCREEN_OFF", {
        screen_on_off_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: Sequelize.INTEGER
        },
        screen_on_time: {
            type: Sequelize.STRING,
        },
        screen_off_time: {
            type: Sequelize.STRING,
        },
        screen_on_date: {
            type: Sequelize.STRING,
        },
        screen_off_date: {
            type: Sequelize.STRING,
        },
        screen_status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        }
    },
    
    {
      freezeTableName: true,
    });
    return screenOnOff_Details;
};