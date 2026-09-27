module.exports = (sequelize, Sequelize) => {
    const shippingAlertDocuments = sequelize.define("SHIPPING_ALERT_DOCUMENTS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_type: {
            type: Sequelize.STRING
        },
        document_name: {
            type: Sequelize.STRING
        },
        entryType: {
            type: Sequelize.ENUM("VENDOR", "CHA"),
            defaultValue: "VENDOR"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
        {
            freezeTableName: true
        });
    return shippingAlertDocuments
}