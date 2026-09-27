module.exports = (sequelize, Sequelize) => {
    const hrmsApplicabilityAll = sequelize.define("HRMS_APPLICABILITY_ALL", {
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
        is_entry: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            allowNull: false
          },
        isDeleted: {
            type: Sequelize.BOOLEAN(false,true),
            defaultValue: false,
          }
    }, {
        freezeTableName: true
    });
    return hrmsApplicabilityAll;
};