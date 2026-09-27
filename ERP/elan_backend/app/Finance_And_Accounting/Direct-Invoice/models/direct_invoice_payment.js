module.exports = (sequelize, Sequelize) => {
    const direct_invoice_payment = sequelize.define("SYS_DI_PAYMENT_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date:{
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW()
        },
        payment_method:{
            type: Sequelize.STRING
        },
        amount_paid:{
            type: Sequelize.DECIMAL(20, 2)
        },
        receipt_no: {
           type: Sequelize.STRING
        },
        amount_due:{
            type: Sequelize.DECIMAL(20, 2)
        },
        upload_document:{
            type: Sequelize.STRING
        },
        terms:{
            type: Sequelize.STRING
        },
        remarks:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isVendor: {
            type: Sequelize.BOOLEAN,
        },

    }, {
        freezeTableName: true
    });
    return direct_invoice_payment
}