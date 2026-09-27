module.exports = (sequelize, Sequelize) => {
    const hrmsApplicabilityMarital = sequelize.define("HRMS_APPLICABILITY_MARITAL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        marital: {
            type: Sequelize.ENUM("Married", "Unmarried", "Separated"),
            defaultValue: "Unmarried"
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
    return hrmsApplicabilityMarital;
};