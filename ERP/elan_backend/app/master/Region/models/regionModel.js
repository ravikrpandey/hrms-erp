module.exports = (sequelize,Sequelize) =>{
    const regionMaster = sequelize.define("MASTER_REGION", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        region_name:{
            type: Sequelize.STRING
        },
        region_code:{
            type:Sequelize.STRING,
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
    return regionMaster;
}