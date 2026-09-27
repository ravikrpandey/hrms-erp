module.exports = (sequelize, Sequelize) => {
    const hrmsRestrictonsModel = sequelize.define("HRMS_RESTRICTIONS_DURATIONS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        duration: {
            type: Sequelize.ENUM("FULL DAY", "HALF DAY"),
            defaultValue: "FULL DAY"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(false,true),
            defaultValue: false
          }
    }, {
        freezeTableName: true
    });
    return hrmsRestrictonsModel;
};