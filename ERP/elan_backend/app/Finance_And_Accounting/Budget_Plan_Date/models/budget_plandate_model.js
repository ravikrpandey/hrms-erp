module.exports = (sequelize,Sequelize) =>{
    const financeBudgetPlanDate = sequelize.define("FINANCE_BUDGET_PLAN_DATE", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        start_date:{
            type: Sequelize.DATEONLY,
        },
        end_date:{
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
    return financeBudgetPlanDate;
}