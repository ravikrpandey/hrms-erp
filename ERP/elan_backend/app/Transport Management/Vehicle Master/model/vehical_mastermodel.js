module.exports = (sequelize, Sequelize) => {
    const vehicle_master = sequelize.define("TM_VEHICLE_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vehicle_number: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        vehicle_model: {
            type: Sequelize.STRING,
        },
        vehicle_make: {
            type: Sequelize.STRING,
        },
        chassis_number: {
            type: Sequelize.STRING,
            unique: true
        },
        engine_number: {
            type: Sequelize.STRING,
            unique: true
        },
        registration_expiry_date: {
            type: Sequelize.DATE,
        },
        insurance_policy_number: {
            type: Sequelize.STRING,
        },
        insurance_expiry_date: {
            type: Sequelize.DATE,
        },
        permit_type: {
            type: Sequelize.ENUM("National", "State"),
            allowNull: true,
            defaultValue: null
        },
        gps_enabled: {
            type: Sequelize.ENUM("Yes", "No"),
            allowNull: true,
            defaultValue: null
        },
        rc_copy_upload: {
            type: Sequelize.STRING,
        },
        insurance_copy_upload: {
            type: Sequelize.STRING,
        },
        permit_document_upload: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
    });
    return vehicle_master;
};
