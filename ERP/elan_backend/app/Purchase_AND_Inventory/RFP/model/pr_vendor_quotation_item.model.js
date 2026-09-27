module.exports = (sequelize, Sequelize) => {
    const PROCUREMENT_PURCHASE_QUOTATION_ITEM = sequelize.define("PROCUREMENT_PURCHASE_QUOTATION_ITEM", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        price_amt: {
            type: Sequelize.DECIMAL(10, 2)
        },
        sgst: {
            type: Sequelize.DECIMAL(10, 2)
        },
        cgst: {
            type: Sequelize.DECIMAL(10, 2)
        },
        igst: {
            type: Sequelize.DECIMAL(10, 2)
        },
        delivery_charges: {
            type: Sequelize.DECIMAL(10, 2)
        },
        additional_charges: {
            type: Sequelize.DECIMAL(10, 2)
        },
    },
        {
            freezeTableName: true,
        });
    return PROCUREMENT_PURCHASE_QUOTATION_ITEM
}