
module.exports = (sequelize, Sequelize) => {
    const deduction_rules = sequelize.define("DEDUCTION_RULES", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lop_days:{
            type: Sequelize.TEXT
        },
        lop_deduction_amount: {
            type: Sequelize.TEXT
        },
        loan_recovery_amount: {
            type: Sequelize.TEXT
        },
      
        assets_recovery_amount:{
            type: Sequelize.INTEGER
        },
         notice_pay_recovery:{
            type: Sequelize.INTEGER
        },
    
    },
        {
            freezeTableName: true
        });
    return deduction_rules
}