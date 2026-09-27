module.exports = (sequelize, Sequelize) => {
    const hrmsLocationMaster = sequelize.define("HRMS_APPLICABILITY_LOCATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(false,true),
            defaultValue: false,
            allowNull: false
          }
    }, {
        freezeTableName: true
    });
    return hrmsLocationMaster;
};