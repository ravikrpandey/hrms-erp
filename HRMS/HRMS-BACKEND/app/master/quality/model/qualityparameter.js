module.exports = (sequelize, Sequelize) => {
    const quality_parameter = sequelize.define("MASTER_QUALITY_PARAMETR", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quality_parameter: {
            type: Sequelize.STRING
        },
        value: {
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
    }, {
        freezeTableName: true
    });
    return quality_parameter;
};