module.exports = (sequelize, Sequelize) => {
    const payrollDeclarationForm = sequelize.define("PAYROLL_DECLARATION_FORM", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        saving_amout: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0  
        },
        declaration_form: {
            type: Sequelize.JSON
        },
        approval_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        remark: {
            type: Sequelize.STRING,
            defaultValue : "Pending Verification"
        },
        isDeleted: { 
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }

    },
        {
            freezeTableName: true,
        });
    return payrollDeclarationForm;
};