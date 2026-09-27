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
        leadership: {
            type: Sequelize.ENUM("YES", "NO"),
        },
        start_date: {
            type: Sequelize.DATEONLY,
        },
        created_on: {
            type: Sequelize.STRING,
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
        qualification_name: {
            type: Sequelize.STRING,
        },
        descripition: {
            type: Sequelize.TEXT
        },
        age_range_min: {
            type: Sequelize.INTEGER,
        },
        age_range_max: {
            type: Sequelize.INTEGER,
        },
        job_Type_id: {
            type: Sequelize.INTEGER,
        },
        monthly_salary: {
            type: Sequelize.INTEGER,
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
        job_status: {
            type: Sequelize.ENUM("Active", "Inactive"),
            defaultValue: "ACTIVE"
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
