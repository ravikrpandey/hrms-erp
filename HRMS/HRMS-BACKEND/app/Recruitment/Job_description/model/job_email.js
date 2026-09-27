module.exports = (sequelize, Sequelize) => {
    const job_descripition_email = sequelize.define("RECRUITMENT_JOB_DESCRIPITION_EMAIL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        middle_name: {
            type: Sequelize.STRING
        },
        contact_number: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        cv_upload: {
            type: Sequelize.STRING
        },
        country_code: {
            type: Sequelize.STRING
        },
        final_remarks: {
            type: Sequelize.STRING
        },
        selected_percentage: {
            type: Sequelize.INTEGER
        },
        bgv_status: {
            type: Sequelize.ENUM("PENDING", "REJECTED","COMPLETED","HOLD","SUBMITTED"),
            defaultValue:"PENDING"
        },
        onboarding_status: {
            type: Sequelize.ENUM("PENDING","COMPLETED","ONBOARDED"),
            defaultValue:"PENDING"
        },
        selection_status: {
            type: Sequelize.ENUM("SELECTED", "REJECTED","APPROVED","HOLD","GO_FOR_BGV","COMPLETED","SELECTED_WITHOUT_BGV"),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        resume_id: {
            type: Sequelize.STRING
        },
    },

        {
            freezeTableName: true,
        });
    return job_descripition_email;
};
