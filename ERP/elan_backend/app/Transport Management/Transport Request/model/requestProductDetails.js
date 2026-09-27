module.exports = (sequelize, Sequelize) => {
    const transportReqProductDetail = sequelize.define("TRANSPORT_REQUEST_PRODUCT_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hsn_code: {
            type: Sequelize.STRING,
        },
        price_per_unit: {
            type: Sequelize.INTEGER,
        },
        quantity: {
            type: Sequelize.INTEGER
        },
         total_price: {
            type: Sequelize.INTEGER
        },
        delivered_qty: {
            type: Sequelize.INTEGER
        },
        discount_approved: {
            type: Sequelize.STRING
        },
        discount_request: {
            type: Sequelize.STRING
        },
        maximum_discount: {
            type: Sequelize.INTEGER
        },
        tax: {
            type: Sequelize.INTEGER
        },
        product_description: {
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        uom_name: {
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });

    return transportReqProductDetail;
};
