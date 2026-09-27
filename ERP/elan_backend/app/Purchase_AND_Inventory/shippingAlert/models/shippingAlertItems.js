module.exports = (sequelize, Sequelize) => {
    const shippingAlertItems = sequelize.define("SHIPPING_ALERT_ITEMS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        claim_qty:{
            type:Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
        {
            freezeTableName: true
        });
    return shippingAlertItems
}