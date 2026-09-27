module.exports = (sequelize, Sequelize) => {
    const entityManagement = sequelize.define("ENTITY_MANAGEMENT_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
     
        mg_name :{
            type: Sequelize.STRING
        },

        mg_designation :{
            type: Sequelize.STRING
        },

        mg_contact_no :{
            type: Sequelize.STRING
        },
        mg_country_code :{
            type: Sequelize.STRING
        },
        
        mg_email_id :{
            type: Sequelize.STRING
        },
    
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        entity_id:{
            type:Sequelize.INTEGER
        }
    }, 
    {
        freezeTableName: true
    });
    entityManagement.associate = (db) => {
        
        entityManagement.belongsTo(db.entityMaster, {
          foreignKey: "entity_id",
          onDelete: "RESTRICT",
        });
       
      };
    return entityManagement;
}
