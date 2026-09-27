module.exports = (sequelize, Sequelize) => {
    const BehaviourAssessment = sequelize.define("ESS_BEHAVIORAL_VL_ASSESSMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        competence: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        self_rating: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        final_rating: {
            type: Sequelize.STRING,
        },
        behavioural_average_rating: {
            type: Sequelize.DECIMAL(10,2)
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
    return BehaviourAssessment;
};
