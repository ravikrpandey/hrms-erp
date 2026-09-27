module.exports = (sequelize, Sequelize) => {
    const shippingTransportModeCourier = sequelize.define("SHIPPING_TRNS_MODE_COURIER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        entryType: {
            type: Sequelize.ENUM("VENDOR", "FORWARDER"),
            defaultValue: "VENDOR"
        },
        courier_name: {
            type: Sequelize.STRING
        },
        awb_number: {
            type: Sequelize.STRING
        },
        tracking_url: {
            type: Sequelize.STRING
        },
        remarks: {
            type: Sequelize.TEXT
        },        
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
        {
            freezeTableName: true
        });
    return shippingTransportModeCourier;
};
