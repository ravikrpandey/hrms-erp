module.exports = (sequelize, Sequelize) => {
    const entityMaster = sequelize.define("ENTITY_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        entity_name: {
            type: Sequelize.STRING
        },
        tax_registration_number: {
            type: Sequelize.STRING
        },
        registered_office: {
            type: Sequelize.STRING
        },
        employee_prefix: {
            type: Sequelize.STRING
        },
        logo: {
            type: Sequelize.STRING
        },
        smtp_server_address: {
            type: Sequelize.STRING
        },
        smtp_port_number: {
            type: Sequelize.STRING
        },
        smtp_username: {
            type: Sequelize.STRING
        },
        smtp_password: {
            type: Sequelize.STRING
        },
        is_group: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: 'NO'
        },
        parent_entity_id:{
            type:Sequelize.INTEGER,
            allowNull: true
        },
      
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        financial_id:{
            type:Sequelize.JSON
        },
        cin: {
            type: Sequelize.STRING
        },
        pan: {
            type: Sequelize.STRING
        }, 
        tan: {
            type: Sequelize.STRING
        }, 
        pf: {
            type: Sequelize.STRING
        }, 
        gst_in: {
            type: Sequelize.STRING
        }, 
        esi: {
            type: Sequelize.STRING
        }, 
        msme_certificate: {
            type: Sequelize.STRING
        }, 
        msme_category: {
            type: Sequelize.STRING
        },
        branch_id: {
            type: Sequelize.JSON
        },
    }, {
        freezeTableName: true
    });
    return entityMaster;
}
