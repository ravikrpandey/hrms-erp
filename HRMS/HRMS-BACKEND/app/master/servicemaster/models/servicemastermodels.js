module.exports = (sequelize,Sequelize) =>{
    const ServiceMaster = sequelize.define("MASTER_SERVICE", {
        service_id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        service_code:{
            type: Sequelize.STRING(100)
        },
        service_name:{
            type:Sequelize.STRING(100)
        },
        service_description:{
            type:Sequelize.STRING
        },
        MVP:{
            type:Sequelize.STRING
        },
        service_document:{
            type:Sequelize.STRING
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
    return ServiceMaster;
}