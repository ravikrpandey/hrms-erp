module.exports = (sequelize, Sequelize) => {
    const hrmsLocationMaster = sequelize.define("LOCATION_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        location_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        location_code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(false,true),
            defaultValue: false,
          }
    }, {
        freezeTableName: true
    });
    return hrmsLocationMaster;
};