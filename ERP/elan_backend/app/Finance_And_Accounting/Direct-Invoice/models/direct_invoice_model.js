module.exports = (sequelize, Sequelize) => {
    const directInvoice = sequelize.define("DIRECT_INVOICE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vendor_code: {
            type: Sequelize.STRING,
        },
        payment_reference: {
            type: Sequelize.STRING,
        },
        du_no: {
            type: Sequelize.STRING,
        },
        aviso_no: {
            type: Sequelize.STRING,
        },
        factura_receibo_no: {
            type: Sequelize.STRING,
        },
        reference: {
            type: Sequelize.STRING(200),
        },
        description: {
            type: Sequelize.TEXT,
        },
        quantity: {
            type: Sequelize.DECIMAL(10, 2),
        },
        customer_code: {
            type: Sequelize.STRING,
        },
        invoice_no: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        date_original: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        date_internal: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        payment_status: {
            type: Sequelize.ENUM("UNPAID", "PAID", "PARTIALLY PAID"),
            defaultValue: "UNPAID"
        },
        invoice_type: {
            type: Sequelize.ENUM("DIRECT", "INDIRECT"),
            defaultValue: "DIRECT"
        },
        invoice_status: {
            type: Sequelize.ENUM("UNPAID", "PAID", "PARTIALLY PAID", "RETURNED","PARTIALLY RETURNED"),
            defaultValue: "UNPAID"
        },
        payment_mode: {
            type: Sequelize.STRING,
        },
        isDebitNote: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        directDebitNote: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isCreditNote: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        debit_no:{
            type: Sequelize.STRING,
            allowNull: true,
        },
        credit_no:{
            type: Sequelize.STRING,
            allowNull: true,
        },
        date_expiry: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        grandTotal: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0,
        },
        totalAmount: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0,
        },
        totalVAT: {
            type: Sequelize.DECIMAL(20, 2),
            defaultValue: 0,
        },
        upload_doc:{
            type: Sequelize.STRING,
        },
        parentInvoiceNo:{
            type: Sequelize.STRING,
        },
        isVendorSelected:{
            type: Sequelize.BOOLEAN,
        },
        isItemSelected:{
         type: Sequelize.BOOLEAN,
         defaultValue: true
        },
        credit_due: {
            type: Sequelize.DECIMAL(20, 2),
        },
    },
        {
            freezeTableName: true
        });
    return directInvoice
}