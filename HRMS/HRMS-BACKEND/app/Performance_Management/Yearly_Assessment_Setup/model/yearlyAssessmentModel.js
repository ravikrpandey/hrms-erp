module.exports = (sequelize, Sequelize) => {
    const AssessmentSetup = sequelize.define("PM_YEARLY_ASSESSMENT_SETUP", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        assessment_name: {
            type: Sequelize.STRING,
          
        },
        start_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
        end_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
       
        assessment_degree: {
            type: Sequelize.ENUM("180 Degree", "360 Degree"),
           
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    });
    return AssessmentSetup;
};
