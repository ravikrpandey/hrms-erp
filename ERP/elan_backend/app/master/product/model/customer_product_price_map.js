module.exports = (sequelize, Sequelize) => {
    const customer_Product_Price = sequelize.define("PRODUCT_PRICE_MAP_WITH_CUSTOMER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       
        product_price: {
            type: Sequelize.DECIMAL(20,2),
            defaultValue: 0
        },
        discount_amount: {
            type: Sequelize.DECIMAL(20,2),
            defaultValue: 0
        },
        final_amount: {
            type: Sequelize.DECIMAL(20,2),
            defaultValue: 0
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
    return customer_Product_Price;
};