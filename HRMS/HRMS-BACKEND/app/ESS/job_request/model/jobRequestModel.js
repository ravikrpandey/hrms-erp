module.exports = (sequelize, Sequelize) => {
    const Job_Request = sequelize.define("ESS_JOB_REQUEST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cost_center_id: {
            type: Sequelize.INTEGER,
        },
        job_title: {
            type: Sequelize.STRING,
        },      
        start_date: {
            type: Sequelize.DATEONLY,
        },
        end_date: {
            type: Sequelize.DATEONLY,
        },
        job_specification: {
            type: Sequelize.ENUM("YES", "NO"),
        },
        upload_document: {
            type: Sequelize.STRING
        },
        skill: {
            type: Sequelize.STRING
        },
        qualification: {
            type: Sequelize.STRING
        },
        experience: {
            type: Sequelize.STRING
        },
        no_of_position: {
            type: Sequelize.STRING
        },
        salary: {
            type: Sequelize.STRING
        },
        editor_msg: {
            type: Sequelize.TEXT
        },
        budget_status: {
            type: Sequelize.ENUM("YES", "NO"),
        },
        budget_Justification: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        final_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
       },
        {
            freezeTableName: true,
        });
    return Job_Request;
};