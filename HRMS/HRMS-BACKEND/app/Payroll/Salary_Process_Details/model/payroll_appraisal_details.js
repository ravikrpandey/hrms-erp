
module.exports = (sequelize, Sequelize) => {
    const payroll_Appraisal_Details = sequelize.define("HRMS_PAYROLL_APPRAISAL_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
      
        salary_type: {
            type: Sequelize.JSON,
        },
        appraisal_type: {
            type: Sequelize.JSON,
        },
        appraisal_mode: {
            type: Sequelize.ENUM("Flat", "Percentage"),
        },
        appraisal_comp_type: {
            type: Sequelize.JSON,
        },
        increment_date: {
            type: Sequelize.DATEONLY, // Stores only "YYYY-MM-DD" without time
        },

        appraisal_percentage: {
            type: Sequelize.DECIMAL(10, 2),   
        },
        appraisal_amount: {
            type: Sequelize.DECIMAL(10, 2),
           
        },
        final_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
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
    return payroll_Appraisal_Details
}