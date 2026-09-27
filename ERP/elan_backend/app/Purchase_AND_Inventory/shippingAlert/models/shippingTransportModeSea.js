module.exports = (sequelize, Sequelize) => {
    const shippingTransportModeSea = sequelize.define("SHIPPING_TRNS_MODE_SEA", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vessel_name: {
            type: Sequelize.STRING
        },
        voyage_number: {
            type: Sequelize.STRING
        },
        shipping_line: {
            type: Sequelize.STRING
        },
       
        container_number: {
            type: Sequelize.STRING
        },
        container_type: {
            type: Sequelize.STRING
        },
        seal_number: {
            type: Sequelize.STRING
        },
        containers: {
            type: Sequelize.TEXT
        },
        bl_number: {
            type: Sequelize.STRING
        },
        bl_date: {
            type: Sequelize.STRING
        },
        bl_type: {
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
        volume: {
            type: Sequelize.STRING
        },
        freight_type: {
            type: Sequelize.STRING
        },
        ocean_freight: {
            type: Sequelize.STRING
        },
        currency_id: {
            type: Sequelize.INTEGER
        },
        forwarder: {
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
    return shippingTransportModeSea
}