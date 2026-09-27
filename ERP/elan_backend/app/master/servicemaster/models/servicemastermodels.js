module.exports = (sequelize,Sequelize) =>{
    const ServiceMaster = sequelize.define("MASTER_SERVICE", {
        service_id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        service_name:{
            type:Sequelize.STRING(100)
        }, 
        service_code:{
            type:Sequelize.STRING(100)
        },
        service_description:{
            type:Sequelize.STRING
        },
        cgst: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0
        }, 
        MVP: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0
        },
        sgst: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0
        },
        igst: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0
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