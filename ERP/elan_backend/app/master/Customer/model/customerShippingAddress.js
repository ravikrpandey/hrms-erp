module.exports = (sequelize, Sequelize) => {
    const customerShippingAddress = sequelize.define(
        "CUSTOMER_SHIPPING_ADDRESS_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },


            shipping_address: {
                type: Sequelize.TEXT
            },
            shipping_pin_code: {
                type: Sequelize.STRING
            },
            shipping_postal_address: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
            },
            shipping_gst_category: {
                type: Sequelize.STRING
            },
            shipping_gst_in: {
                type: Sequelize.STRING
            },
            is_Deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

        },

        {
            freezeTableName: true,
        }
    );
    return customerShippingAddress;
};


