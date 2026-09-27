module.exports = (sequelize, Sequelize) => {
    const hrmsApplicabilityGender = sequelize.define("HRMS_APPLICABILITY_GENDER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        gender: {
            type: Sequelize.ENUM("Male", "Female", "Others"),
            defaultValue: "Male",
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(false,true),
            defaultValue: false,
          }
    }, {
        freezeTableName: true
    });
    return hrmsApplicabilityGender;
};