module.exports = (sequelize, Sequelize) => {
    const masterManitenance = sequelize.define("MASTER_MAINTENANCE", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
    return masterManitenance;
}