module.exports = (sequelize, Sequelize) => {
    const job_descripition_skill = sequelize.define("RECRUITMENT_JOB_SKILL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        skill_name: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    });
    return job_descripition_skill;
};
