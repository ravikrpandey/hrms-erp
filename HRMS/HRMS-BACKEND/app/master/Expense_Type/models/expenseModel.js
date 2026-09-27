module.exports = (sequelize,Sequelize) =>{
    const typeOfExpense = sequelize.define("MASTER_EXPENSE", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        expense_type:{
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
    return typeOfExpense;
}