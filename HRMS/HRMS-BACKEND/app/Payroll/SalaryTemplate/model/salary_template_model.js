module.exports = (sequelize, Sequelize) => {
    const PayrollSalaryTemplate = sequelize.define('PAYROLL_SALARY_TEMPLATE', {
        template_name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        ctc: {
            type: Sequelize.DECIMAL(10,2)
        },
        total_annual_gross: {
            type: Sequelize.DECIMAL(10,2)
        },
        total_monthly_gross: {
            type: Sequelize.DECIMAL(10,2)
        },
        gross_salary: {
            type: Sequelize.DECIMAL(10,2)
        },

        isPF_calculate:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        pfCap: {
            type: Sequelize.DECIMAL(10,2)
        },
        esiThreshold: {
            type: Sequelize.DECIMAL(10,2)
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        // entity_type: {
        //     type: Sequelize.INTEGER
        // },
        // financial_year: {
        //     type: Sequelize.STRING
        // },
        // company: {
        //     type: Sequelize.STRING
        // },
        // branch: {
        //     type: Sequelize.INTEGER
        // },
     
        earningComponentList: {
            type: Sequelize.JSON
        },
        reiembursementComponentList: {
            type: Sequelize.JSON
        },
        deductionComponentList: {
            type: Sequelize.JSON
        },
        variableearningComponentList: {
            type: Sequelize.JSON
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        currency_id: {
            type: Sequelize.INTEGER
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM('Active', 'Inactive'),
            defaultValue: 'Active'
        },
    },
    {
        freezeTableName: true,
    });
    return PayrollSalaryTemplate;
};