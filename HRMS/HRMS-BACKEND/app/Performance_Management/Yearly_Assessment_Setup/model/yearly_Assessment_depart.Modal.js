module.exports = (sequelize, Sequelize) => {
    const departmentAssessment = sequelize.define("PM_YEARLY_ASSESSMENT_DEPARTMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dept_id: {
            type: Sequelize.JSON,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    });
    return departmentAssessment;
};