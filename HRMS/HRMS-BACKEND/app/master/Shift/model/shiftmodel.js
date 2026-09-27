module.exports = (sequelize, Sequelize) => {
    const shift = sequelize.define("MASTER_SHIFT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        shift_name: {
            type: Sequelize.STRING
        },
        shift_time: {
            type: Sequelize.STRING
        },
        shift_duration: {
            type: Sequelize.STRING
        },
        grace_peroid:{
            type: Sequelize.STRING
        },
        grace_day:{
             type: Sequelize.FLOAT,
             defaultValue: 0
        },
        createdAt:{
            type: Sequelize.DATE,
            defaultValue: new Date,
        },
        updatedAt:{
            type: Sequelize.DATE,
            defaultValue: new Date,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return shift;
}