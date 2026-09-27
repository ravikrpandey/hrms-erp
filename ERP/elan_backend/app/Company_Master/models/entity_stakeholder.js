module.exports = (sequelize, Sequelize) => {
    const entityStakeholder = sequelize.define("ENTITY_STAKEHOLDER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
     
        stakeholder_name :{
            type: Sequelize.STRING
        },

        designation :{
            type: Sequelize.STRING
        },

        contact_no :{
            type: Sequelize.STRING
        },
        country_code :{
            type: Sequelize.STRING
        },
        
        email_id :{
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
    }, {
        freezeTableName: true
    });
    return entityStakeholder;
}
