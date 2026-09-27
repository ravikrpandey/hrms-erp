module.exports = (sequelize, Sequelize) => {
    const hrmsApplicabilityDepartment = sequelize.define("HRMS_APPLICABILITY_DEPARTMENT", {
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
            type: Sequelize.BOOLEAN(true,false),
            defaultValue: false,
          }
    }, {
        freezeTableName: true
    });
    return hrmsApplicabilityDepartment;
};