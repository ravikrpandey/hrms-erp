module.exports = (sequelize, Sequelize) => {
    const DeductionCycle = sequelize.define('DEDUCTION_CYCLE', {
        deduction_cycle_type: {
            type: Sequelize.STRING,
        },
        deduction_cycle_name: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    },
    {
    freezeTableName: true
}) 
return DeductionCycle;
};