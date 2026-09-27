
module.exports = (sequelize, Sequelize) => {
    const skillDevelopment = sequelize.define("ESS_SKILL_DEVELOPMENT_PLAN", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        need_for_development: {
            type: Sequelize.STRING,
        },
        action_plan: {
            type: Sequelize.STRING,
        },
        initiate_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
        end_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
        file_document: {
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
    return skillDevelopment;
};
