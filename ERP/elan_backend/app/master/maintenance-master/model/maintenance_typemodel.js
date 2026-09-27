module.exports = (sequelize, Sequelize) => {
    const Manitenance_Type = sequelize.define("MAINTENANCE_TYPE", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        maintenance:{
            type: Sequelize.STRING
        },
       
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }        
    },
    
    {
      freezeTableName: true,
    })
    return Manitenance_Type;
}