module.exports = (sequelize, Sequelize) => {
    const vehicleType_master = sequelize.define("TM_VEHICLETYPE_MASTER", {
        vehicle_type_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vehicle_type_name: {
            type: Sequelize.STRING
        },
        body_type: {
            type: Sequelize.STRING
        },
        axle_type: {
            type: Sequelize.ENUM("SINGLE", "MULTI"),
            allowNull: true,
            defaultValue: null
        },
        number_of_axles: {
            type: Sequelize.INTEGER, // 1,2,3,4,5
            allowNull: false
        },
        length_ft: {
            type: Sequelize.DECIMAL(10, 2)
        },
        width_ft: {
            type: Sequelize.DECIMAL(10, 2)
        },
        height_ft: {
            type: Sequelize.DECIMAL(10, 2)
        },
        max_payload_ton: {
            type: Sequelize.DECIMAL(10, 2)
        },
        max_volume_cft: {
            type: Sequelize.DECIMAL(10, 2)
        },
        temperature_control: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: "NO"
        },
        hazardous_allowed: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: "NO"
        },
        number_of_tyres: {
            type: Sequelize.STRING
        },
        tyre_size: {
            type: Sequelize.STRING
        },
        tyre_type: {
            type: Sequelize.ENUM("TUBE", "TUBELESS"),
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
    }
    );
    return vehicleType_master;
};
