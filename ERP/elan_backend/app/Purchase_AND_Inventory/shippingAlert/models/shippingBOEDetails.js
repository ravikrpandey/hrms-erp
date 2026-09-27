module.exports = (sequelize, Sequelize) => {
    const shippingBOEDetails = sequelize.define("SHIPPING_BOE_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        boe_number: {
            type: Sequelize.STRING
        },
        boe_date: {
            type: Sequelize.DATEONLY
        },
        exchange_rate: {
            type: Sequelize.DECIMAL(15, 4)
        },
        invoice_amount: {
            type: Sequelize.DECIMAL(15, 4)
        },
        freight_charges: {
            type: Sequelize.DECIMAL(15, 4)
        },
        insurance_charges: {
            type: Sequelize.DECIMAL(15, 4)
        },
        assessable_value: {
            type: Sequelize.DECIMAL(15, 4)
        },
        duty_percent: {
            type: Sequelize.DECIMAL(6, 2)
        },
        duty_amount: {
            type: Sequelize.DECIMAL(15, 4)
        }
    },
        {
            freezeTableName: true
        });
    return shippingBOEDetails
}