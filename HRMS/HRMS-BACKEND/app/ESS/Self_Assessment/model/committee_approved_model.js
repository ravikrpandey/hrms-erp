module.exports = (sequelize, Sequelize) => {
    const CommitteeAssessmentRating = sequelize.define("ESS_COMMITTEE_ASSESSMENT_RATING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        competence: {
            type: Sequelize.STRING,
            allowNull: false,
        },      
        remark: {
            type: Sequelize.STRING,
        }, 
        status: {
            type: Sequelize.ENUM("ACTIVE","INACTIVE"),
            defaultValue: "ACTIVE",
        },
        
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    });
    return CommitteeAssessmentRating;
};
