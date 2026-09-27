module.exports = (sequelize, Sequelize) => {
    const job_descripition = sequelize.define("RECRUITMENT_JOB_DESCRIPITION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
        upload_document: {
            type: Sequelize.STRING
        },
        experience: {
            type: Sequelize.STRING,
        },
        jd_number: {
            type: Sequelize.STRING,
        },
        skill: {
            type: Sequelize.STRING,
        },
        salary: {
            type: Sequelize.STRING,
        },
        qualification: {
            type: Sequelize.STRING,
        },
        descripition: {
            type: Sequelize.TEXT
        },
        level_of_interview: {
            type: Sequelize.INTEGER,
        },
        number_of_positions: {
            type: Sequelize.INTEGER,
        },
        percentage: {
            type: Sequelize.INTEGER,
        },
        jobSpecification: {
            type: Sequelize.ENUM("YES", "NO"),
        },
        job_status: {
            type: Sequelize.ENUM("Active", "Inactive"),
        },
        tab_type: {
            type: Sequelize.ENUM("Job Details", "Job Description", "Job requirements", "Skill", "Questions")
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isCompletedJd: {
            type: Sequelize.ENUM("PENDING", "COMPLETED"),
            defaultValue: "PENDING",
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
    return job_descripition;
};
