module.exports = (sequelize, Sequelize) => {
    const SalaryComponentDeduction= sequelize.define('PAYROLL_SLRYCOMPONENT_DEDUCTION', {
        deduction_plan: {
            type: Sequelize.STRING,
        },
        name_in_payslip: {
            type: Sequelize.STRING
        },
        deduction_type: {
            type: Sequelize.STRING
        },
        calculation_type: {
            type: Sequelize.STRING
        },
        calculation_type_code: {
            type: Sequelize.STRING
        },
        calculation_amount: {
            type: Sequelize.INTEGER
        },
        calculation_percentage: {
            type: Sequelize.INTEGER
        },
        deduction_frequency: {
            type: Sequelize.ENUM('one_time_deduction', 'recurring_deduction')
        },
        mark_as_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        // entity_type: {
        //     type: Sequelize.INTEGER
        // },
        // financial_year: {
        //     type: Sequelize.INTEGER
        // },
        is_active: {
            type: Sequelize.ENUM('Active', 'Inactive'),
            defaultValue: 'Active'
        }
    },
        {
            freezeTableName: true,
        });
    return SalaryComponentDeduction;
};