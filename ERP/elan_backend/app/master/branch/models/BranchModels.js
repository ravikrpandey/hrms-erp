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
        country_code: {
            type: Sequelize.STRING
        },
        contact_no: {
            type: Sequelize.STRING
        },
        pan_number: {
            type: Sequelize.STRING
        },
        alt_country_code: {
            type: Sequelize.STRING
        },
        branch_email: {
            type: Sequelize.STRING
        },
        branch_alt_email: {
            type: Sequelize.STRING
        },
        branch_pin_code: {
            type: Sequelize.INTEGER
        },
        branch_gstnumber: {
            type: Sequelize.STRING
        },
        branch_address: {
            type: Sequelize.STRING
        },
        billing_status: {
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
        reverse_charge_applicable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        gst_composition_scheme: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        gst_lut_bond: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

        branch_contact_detail: {
            type: Sequelize.STRING,
        },
        branch_alt_contact_detail: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        gst_filing_cycle: {
            type: Sequelize.ENUM("Monthly", "Quarterly", "Annual"),
            defaultValue: "Monthly"
        },
        e_wayBill: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        sez_registration: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        eway_amount: {
            type: Sequelize.DECIMAL(20,2),
            defaultValue: 0
        },
        type_gst_registration: {
            type: Sequelize.ENUM("Regular", "Composition", "Casual", "SEZ", "Exempted", "Unregistered"),
            defaultValue: "Unregistered"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return tbl_branch;
};