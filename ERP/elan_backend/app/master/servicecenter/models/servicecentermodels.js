module.exports = (sequelize,Sequelize) =>{
    const ServiceCenterMaster = sequelize.define("SERVICE_CENTER_MASTER", {
        id :{
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        sc_code:{
            type: Sequelize.STRING(100)
        },
        sc_name:{
            type:Sequelize.STRING(100)
        },
        contact_person:{
            type: Sequelize.STRING(100)
        },
        sc_email:{
            type: Sequelize.STRING(100)
        },
        sc_gst_no:{
            type:Sequelize.STRING
        },
        sc_contact_no:{
            type:Sequelize.STRING
        },
        sc_address:{
            type:Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
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
    return ServiceCenterMaster;
}