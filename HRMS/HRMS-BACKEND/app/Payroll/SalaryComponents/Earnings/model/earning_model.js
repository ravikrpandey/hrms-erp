module.exports = (sequelize, Sequelize) => {
    const SalaryComponentEarning = sequelize.define('PAYROLL_SLRYCOMPONENT_EARNING', {
        earning_type: {
            type: Sequelize.STRING,
        },
        earning_name: {
            type: Sequelize.STRING,
        },
        name_in_payslip: {
            type: Sequelize.STRING,
        },
        calculation_type: {
            type: Sequelize.STRING
        },
        calculation_amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        calculation_percentage: {
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
        // is_pro_rata: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false
        // },
        consider_for_epf: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        // epf_condition: {
        //     type: Sequelize.ENUM('always', 'less-than-15000'),
        //     allowNull: true
        // },
        consider_for_esi: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        consider_for_nps: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        consider_for_saf: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        // show_in_payslip: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false
        // },
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
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        earning_type_code: {
            type: Sequelize.STRING,
        },
        calculation_type_code: {
            type: Sequelize.STRING,
        },
         gratuity: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
         is_overtime: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    },
        {
            freezeTableName: true,
        });
    return SalaryComponentEarning;
};