module.exports = (sequelize, Sequelize) => {
    const transport_master = sequelize.define("TM_TRANSPORTER_MASTER", {
        id: {
           type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tm_code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        tm_name: {
            type: Sequelize.STRING,
        },
        tm_contact_person_name: {
            type: Sequelize.STRING,
        },
        tm_contact_number: {
            type: Sequelize.STRING,
        }, 
        gst_rate: {
            type: Sequelize.DECIMAL(20,2),
        },
        tm_email: {
            type: Sequelize.STRING,
        },
        tm_gst_number: {
            type: Sequelize.STRING,
        },
        tm_address: {
            type: Sequelize.STRING,
        },
        rcm_check: {
            type: Sequelize.BOOLEAN,
            defaultValue:false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
    });

    return transport_master;
};
