module.exports = (sequelize,Sequelize) =>{
    const salesReason = sequelize.define("MASTER_SALES_REASON", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        sales_reason:{
            type: Sequelize.STRING
        },
        type:{
            type: Sequelize.STRING
        },
        descriptions:{
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
    return salesReason;
}