module.exports = (sequelize,Sequelize) =>{
    const sealType = sequelize.define("MASTER_SEAL", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        seal_type:{
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
    return sealType;
}