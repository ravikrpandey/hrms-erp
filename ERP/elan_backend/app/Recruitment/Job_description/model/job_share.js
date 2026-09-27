const { compare } = require("mathjs");

module.exports = (sequelize, Sequelize) => {
    const job_descripition_share_type = sequelize.define("RECRUITMENT_JOB_SHARE_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        job_share_type_id: {
            type: Sequelize.INTEGER,
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
    return job_descripition_share_type;
};
