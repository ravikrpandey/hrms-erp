module.exports = (sequelize, Sequelize) => {
    const holiday_Details = sequelize.define("MASTER_HOLIDAY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        holiday_name: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    {
      freezeTableName: true,
    });
    return holiday_Details;
}