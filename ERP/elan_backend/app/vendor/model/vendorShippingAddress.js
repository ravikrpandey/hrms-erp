module.exports = (sequelize, Sequelize) => {
    const vendorShippingAddress = sequelize.define(
        "VENDOR_SHIPPING_ADDRESS_MST",
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
            gst_category:{
        type: Sequelize.ENUM("RP", "URP")
      },
      gst_in: {
        type: Sequelize.STRING,
        
      },
            status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
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
    return vendorShippingAddress;
};


