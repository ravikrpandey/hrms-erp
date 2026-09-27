module.exports = (sequelize,Sequelize) =>{
    const financeBudgetPlanDateHistory = sequelize.define("FINANCE_BUDGET_PLAN_DATE_HISTORY", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
       
        extend_date:{
            type: Sequelize.DATEONLY,
        },
        
        status:{
            type:Sequelize.ENUM("ACTIVE","INACTIVE"),
            defaultValue:"ACTIVE"
        },
        isDeleted:{
            type:Sequelize.BOOLEAN(true,false),
            defaultValue: false
        }
    },
    {
        freezeTableName:true
    }
    )
    return financeBudgetPlanDateHistory;
}