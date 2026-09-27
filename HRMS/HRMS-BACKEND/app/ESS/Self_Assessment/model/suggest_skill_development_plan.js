
module.exports = (sequelize, Sequelize) => {
    const suggestSkillDevelopment = sequelize.define("ESS_SUGGEST_SKILL_DEVELOPMENT_PLAN", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        need_for_development: {
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
    return suggestSkillDevelopment;
};
