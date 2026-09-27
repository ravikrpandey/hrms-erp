
module.exports = (sequelize, Sequelize) => {
    const Fnf_Earnings = sequelize.define("FNF_EARNING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        final_salary:{
            type: Sequelize.TEXT
        },
        leave_encashment_days: {
            type: Sequelize.TEXT
        },
        leave_encashment_amount: {
            type: Sequelize.TEXT
        },
      
        bonus_amount:{
            type: Sequelize.INTEGER
        },
         gratuity_amount:{
            type: Sequelize.INTEGER
        },
     
    },
        {
            freezeTableName: true
        });
    return Fnf_Earnings
}