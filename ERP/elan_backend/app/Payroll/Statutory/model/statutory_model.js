module.exports = (sequelize, Sequelize) => {
    const PayrollStatutory = sequelize.define('PAYROLL_STATUTORY', {
        payment_frequency: {
            type: Sequelize.STRING
        },
        monthly_bonus_percent: {
            type: Sequelize.FLOAT
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        entity: {
            type: Sequelize.INTEGER
        },
          financial_year: {
            type: Sequelize.STRING
        },
    },
        {
            freezeTableName: true,
        });
        return PayrollStatutory;
};