module.exports = (sequelize, Sequelize) => {
    const PayrollEmployeeSalary = sequelize.define('HRMS_EMPLOYEE_PAY_SALARY', {
        template_name:{
            type: Sequelize.STRING
        },
        description : {
            type: Sequelize.STRING
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
        employer_contri_epf_amt: {
            type: Sequelize.DECIMAL(10,2)
        },
        employer_contri_esi_amt: {
            type: Sequelize.DECIMAL(10,2)
        },
        g_pay: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        tax_calculation : {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        g_pay: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
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

        deduction_amt:{
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0
        },
        monthly_ctc:{
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0
        },
        currency_id:{
            type: Sequelize.INTEGER,
            defaultValue: null
        },
      
        created_by: {
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
    return PayrollEmployeeSalary;
};