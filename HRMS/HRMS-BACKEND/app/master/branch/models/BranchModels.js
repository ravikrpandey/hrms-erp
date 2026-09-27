module.exports = (sequelize, Sequelize) => {
    const tbl_branch = sequelize.define("MASTER_BRANCH", {
         id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        branch_name: {
            type: Sequelize.STRING
        },
        branch_code: {
            type: Sequelize.STRING
        },
        branch_contact_person_name: {
            type: Sequelize.STRING
        },
        branch_contact_no: {
            type: Sequelize.STRING
        },
        contact_country_code: {
            type: Sequelize.STRING
        },
        alt_contact_country_code: {
            type: Sequelize.STRING
        },
        branch_alt_contact_no: {
            type: Sequelize.STRING
        },
        branch_email: {
            type: Sequelize.STRING
        },
        branch_alt_email: {
            type: Sequelize.STRING
        },
        branch_pin_code: {
            type: Sequelize.STRING
        },
        branch_address: {
            type: Sequelize.TEXT
        },
        branch_gstnumber: {
            type: Sequelize.STRING
        },
        billing_status:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        latitude: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: Sequelize.DECIMAL(11, 8),
            allowNull: true
        },
        geofence_radius_meters: {
            type: Sequelize.INTEGER,
            defaultValue: 150
        },
        is_geofence_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },{
        freezeTableName:true
    });
    return tbl_branch;
};