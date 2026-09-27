module.exports = (sequelize, Sequelize) => {
    const PROCUREMENT_PURCHASE_NEGOTIATION_ITEM = sequelize.define("PROCUREMENT_PURCHASE_NEGOTIATION_ITEM", {
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
        vendor_remarks: {
            type: Sequelize.STRING,
            comment: "vendor remarks at Quotation"
        },
        vendor_uploaded_document: {
            type: Sequelize.STRING
        },
        checked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        vendor_responded: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        target_amount: {
            type: Sequelize.DECIMAL(10, 2)
        },
    },
        {
            freezeTableName: true,
        });
    return PROCUREMENT_PURCHASE_NEGOTIATION_ITEM
}