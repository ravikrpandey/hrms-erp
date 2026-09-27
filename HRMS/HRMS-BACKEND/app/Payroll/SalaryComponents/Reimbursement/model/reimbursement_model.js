module.exports = (sequelize, Sequelize) => {
    const SalaryComponentEarning = sequelize.define('PAYROLL_SLRYCOMPONENT_REIMBURSEMENT', {
        reimbursement_name: {
            type: Sequelize.STRING,
        },
        reimbursement_type: {
            type: Sequelize.STRING
        },
       
        is_taxable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
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
    return SalaryComponentEarning;
};