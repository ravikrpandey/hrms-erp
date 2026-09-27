module.exports = (sequelize, Sequelize) => {
    const payroll_Appraisal_Approval = sequelize.define("HRMS_PAYROLL_APPRAISAL_APPROVAL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.JSON
        },
        approval_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },
        remarks: {
            type: Sequelize.STRING
        },
        progress_status: {
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
    return payroll_Appraisal_Approval
}

