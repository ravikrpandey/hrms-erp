module.exports = (sequelize, Sequelize) => {
    const Job_approval = sequelize.define("ESS_JOB_APPROVEL_LEVEL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.INTEGER
        },
        approvel_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING","REJECTED"),
            defaultValue: "PENDING"
        },
        remark:{
            type: Sequelize.TEXT
        },
        progressStatus: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        });
    return Job_approval
}