module.exports = (sequelize, Sequelize) => {
    const SalaryComponentVariableEarning = sequelize.define('PAYROLL_SLRYCOMPONENT_VARIABLE_EARNING', {

        variable_earning_name: {
            type: Sequelize.STRING,
        },
        name_in_payslip: {
            type: Sequelize.STRING,
        },
        calculation_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        // mark_as_active: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: true
        // },
        // is_part_of_salary_structure: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false
        // },
        is_taxable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        deduct_when_credited: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        deduct_monthly: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
    },
        {
            freezeTableName: true,
        });
    return SalaryComponentVariableEarning;
};