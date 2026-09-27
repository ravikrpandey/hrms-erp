module.exports = (sequelize, Sequelize) => {
    const payroll_payslip = sequelize.define("HRMS_PAYROLL_PAY_SLIPS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        base_salary: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false, 
            defaultValue: 0.00
        },
        gross_salary: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false, 
            defaultValue: 0.00
        },
        recieve_amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false, 
            defaultValue: 0.00
        },
        pay_slip_month: {
            type: Sequelize.INTEGER,
        },
        pay_slip_year: {
            type: Sequelize.INTEGER,
        },
        pay_slip_doc: {
            type: Sequelize.STRING,
        },
        pay_slip_status: {
            type: Sequelize.ENUM("HOLD", "PROCESSED","INACTIVE"),
            defaultValue: "HOLD",
        },
        approval_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING","REJECTED", "CLOSED"),
        },
        salary_data: {
            type: Sequelize.JSON,
        },
        remark:{
            type: Sequelize.TEXT
        },
        tax_amount:{
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false, 
            defaultValue: 0.00
        },

     
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        }
    );
    return payroll_payslip;
};