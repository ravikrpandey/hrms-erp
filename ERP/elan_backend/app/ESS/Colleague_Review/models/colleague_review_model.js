module.exports = (sequelize, Sequelize) => {
    const ColleagueReview = sequelize.define("ESS_COLLEAGUE_REVIEW", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        competence: {
            type: Sequelize.STRING,
            allowNull: false,
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
    return ColleagueReview;
};
