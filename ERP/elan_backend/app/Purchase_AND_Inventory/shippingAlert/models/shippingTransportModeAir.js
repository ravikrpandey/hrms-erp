module.exports = (sequelize, Sequelize) => {
    const shippingTransportModeAir = sequelize.define("SHIPPING_TRNS_MODE_AIR", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        airline_name: {
            type: Sequelize.STRING
        },
        flight_number: {
            type: Sequelize.STRING
        },
        awb_number: {
            type: Sequelize.STRING
        },
        awb_date: {
            type: Sequelize.STRING
        },
       
        etd: {
            type: Sequelize.STRING
        },
        eta: {
            type: Sequelize.STRING
        },
        total_packages: {
            type: Sequelize.STRING
        },
        gross_weight: {
            type: Sequelize.STRING
        },
        chargeable_weight: {
            type: Sequelize.STRING
        },
        freight_type: {
            type: Sequelize.STRING
        },
        freight_forwarder: {
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
    return shippingTransportModeAir
}