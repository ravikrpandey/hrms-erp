module.exports = (sequelize,Sequelize) =>{
    const masterBudgetCategory = sequelize.define("MASTER_BUDGET_CATEGORY", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        budget_category:{
            type: Sequelize.STRING
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
    return masterBudgetCategory;
}