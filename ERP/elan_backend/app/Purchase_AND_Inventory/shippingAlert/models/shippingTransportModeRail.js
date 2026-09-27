module.exports = (sequelize, Sequelize) => {
    const shippingTransportModeRail = sequelize.define("SHIPPING_TRNS_MODE_RAIL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        train_number: {
            type: Sequelize.STRING
        },
        train_name: {
            type: Sequelize.STRING
        },
        railway_zone: {
            type: Sequelize.STRING
        },
        wagon_number: {
            type: Sequelize.STRING
        },
        coach_number: {
            type: Sequelize.STRING
        },
        container_number: {
            type: Sequelize.STRING
        },
       
        departure_date: {
            type: Sequelize.STRING
        },
        expected_arrival: {
            type: Sequelize.STRING
        },
        total_packages: {
            type: Sequelize.STRING
        },
        gross_weight: {
            type: Sequelize.STRING
        },
        cargo_type: {
            type: Sequelize.STRING
        },
        rr_number: {
            type: Sequelize.STRING
        },
        rr_date: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
        {
            freezeTableName: true
        });
    return shippingTransportModeRail
}